---
title: "Using GoLang and MQTT"
subTitle: My goal is to build a reliable solution based on paho client and highlight different cases.
description: Surprisingly, on GoLang we don't have a lot of different solutions around MQTT protocol. My goal is to build a reliable solution based on paho client and highlight different cases. While trying different approaches I finally come out with a scalable and robust solution.
date: 2020-05-14
draft: false
authors: "Vlad Tarasenko"
image: /images/blog/11.jpg
tags: [
  "Golang",
  "Big Data",
  "MQTT"
]
---

Surprisingly, on GoLang we don't have a lot of different solutions around MQTT protocol, and when I'm writing this article only one production-ready solution that available, it's GoLang paho client.

My goal is to build a reliable solution based on paho client and highlight different cases. While trying different approaches I finally come out with a scalable and robust solution.

To make a more real-world example, let's agree we have an MQTT Server with two channels:

- state
- data

State channel design to send less frequently, 1 time per second, but can send the message with size up to 64kb. Data channel design to send up to 100 times per second, but the maximum data size cannot be more than 4kb.

Let's start with MQTT client structure

```
// MqttClient oversees struct
type MqttClient struct {
  ctx        context.Context
  ctxCancel  context.CancelFunc

  stateBuf    []byte
  dataBuf    chan *Message

  mu   sync.Mutex
  conn *mqtt.Client
}
```

We will try to accumulate state data in the stateBuf and send it once per second. dataBuf operate as a FIFO queue. Let's define constants we will use:

```
// Error error handler
type Error string

// Error error handler
func (e Error) Error() string { return string(e) }

const (
  // KeyLifeTime for how long minute jwt key will be valid
  KeyLifeTime = 2 // minute

  // StateInterval - duration between state publish event
  StateInterval = 1 // second

  // NoConnection return no MqttClient connection error
  NoConnection = Error("No MqttClient connection")

  // topicType = "state" // or "state", events
  qos      = 1 // QoS 2 isn't supported in GCP
  retain   = false
  username = "unused" // always this value in GCP
)
```

Traditionally, we will start with a New function. Every New MqttClient will have a 100 000 message buffer for data messages. We also start goroutines for state and data listeners and function which will publish states every second.

```
// NewMqttClient create MqttClient connection using gived config and log stream
func NewMqttClient(config *cfg.Config) *MqttClient {
  mq := MqttClient{
    cfg:         config,
    stateBuffer: make([]byte, 65535),
    dataBuf:    make(chan *Message, 100000),
  }
  mq.ctx, mq.ctxCancel = context.WithCancel(context.Background())

  mq.stateBuffer = mq.stateBuffer[:0]
  go mq.listenConfig()
  go mq.publishStateInterval()
  go mq.listenPublish()
  return &mq
}

// ConnectionLostHandler notify when connection lost
func (mq *MqttClient) ConnectionLostHandler(client mqtt.Client, err error) {
  // this can happen during network problems
  mq.close(1)
}
```

Intifite connect function, will try to connect once per second till success connection

```
// connect connects to the MqttClient
func (mq *MqttClient) connect() *mqtt.Client {
  mq.mu.Lock()
  defer mq.mu.Unlock()

  if mq.conn != nil {
    return mq.conn
  }

  ticker := time.NewTicker(time.Second)
  defer ticker.Stop()
  for ; ; <-ticker.C {
    select {
    case <-mq.ctx.Done():
      return nil
    default:
      conn, err := mq.reconnect()
      if err != nil {
        switch err.(type) {
        case *os.PathError:
          log.Print(err)
          time.Sleep(time.Second * 10)
        default:
          if err.Error() == "Invalid Key: Key must be PEM encoded PKCS1 or PKCS8 private key" {
            log.Print(err)
            time.Sleep(time.Second * 10)
          }
        }
        continue
      }
      mq.conn = conn
      return mq.conn
    }
  }
}

func (mq *MqttClient) getClientID() string {
  // generate MqttClient client
  clientID := fmt.Sprintf(
    "projects/%s/locations/%s/registries/%s/devices/%s",
    mq.cfg.ProjectID, mq.cfg.Region, mq.cfg.RegistryID, mq.cfg.DeviceID)

  return clientID
}
```

Reconnect is actually function which will set up connection to MQTT Server

```
// Reconnect connects to the MqttClient
func (mq *MqttClient) reconnect() (*mqtt.Client, error) {

  clientID := mq.getClientID()
  // load private key
  keyData, err := ioutil.ReadFile(mq.cfg.PrivateKey)
  if err != nil {
    log.Printf("reconnect: cannot read Private Key: %s", mq.cfg.PrivateKey)
    return nil, err
  }

  var key interface{}
  switch mq.cfg.Algorithm {
  case "RS256":
    key, err = jwt.ParseRSAPrivateKeyFromPEM(keyData)
  case "ES256":
    key, err = jwt.ParseECPrivateKeyFromPEM(keyData)
  default:
    err := fmt.Errorf("Unknown algorithm: %s", mq.cfg.Algorithm)
    log.Print(err)
    return nil, err
  }
  if err != nil {
    log.Print("reconnect: cannot read private key: %s", mq.cfg.PrivateKey)
    return nil, err
  }

  // generate JWT as the MqttClient password
  t := time.Now()
  token := jwt.NewWithClaims(jwt.GetSigningMethod(mq.cfg.Algorithm), &jwt.StandardClaims{
    IssuedAt:  t.Unix(),
    ExpiresAt: t.Add(time.Minute * KeyLifeTime).Unix(),
    Audience:  mq.cfg.ProjectID,
  })
  pass, err := token.SignedString(key)
  if err != nil {
    log.Print("reconnect: cannot sign key")
    return nil, err
  }

  // configure MqttClient client
  opts := mqtt.NewClientOptions().
    AddBroker(mq.cfg.MqttServer).
    SetClientID(clientID).
    SetUsername(username).
    // SetDefaultPublishHandler(MessageHandler).
    SetTLSConfig(&tls.Config{MinVersion: tls.VersionTLS12}).
    SetPassword(pass).
    // For some reason auto reconnect just freeze publish
    SetAutoReconnect(false).
    SetConnectionLostHandler(mq.ConnectionLostHandler).
    SetKeepAlive(KeyLifeTime).
    SetPingTimeout(3).
    SetProtocolVersion(4) // Use MqttClient 3.1.1

  conn := mqtt.NewClient(opts)
  tok := conn.Connect()
  if err := tok.Error(); err != nil {
    mq.log.Error().Err(err).
      Msg("reconnect: cannot connect")
    return &conn, err
  }

  if !tok.WaitTimeout(time.Second * 5) {
    err := fmt.Errorf("Connection Timeout")
    log.Print(err)
    return &conn, err
  }

  if err := tok.Error(); err != nil {
    log.Print(err)
    return &conn, err
  }
  return &conn, nil
}
```

Function to close connection

```
// Stop will send close message and shutdown websocket connection
func (mq *MqttClient) Stop() {
  mq.ctxCancel()
  mq.close(1)
}

// close close MqttClient connection
func (mq *MqttClient) close(quiesce uint) {
  mq.mu.Lock()
  defer mq.mu.Unlock()

  if mq.conn != nil && (*mq.conn).IsConnected() {
    (*mq.conn).Disconnect(quiesce)
  }
  mq.conn = nil
}
```

Publish state data to the mqtt channel

```
// PublishStateInterval every N seconds will push state to the cloud
func (mq *MqttClient) publishStateInterval() {
  ticker := time.NewTicker(time.Second * StateInterval)
  defer ticker.Stop()

  for {
    select {
    case <-mq.ctx.Done():
      return
    case <-ticker.C:
      err := mq.PublishState()
      if err != nil {
        log.Print("PublishStateInterval: error sending state to MqttClient")
      }
    }
  }
}
```

If needed we can publish state from external function

```
// PublishState will publish state buffer data
func (mq *MqttClient) PublishState() error {
  if len(mq.stateBuffer) > 0 {
    conn := mq.connect()
    topic := fmt.Sprintf("/devices/%s/%s", mq.cfg.DeviceID, "state")
    data := append([]byte("["), mq.stateBuffer...)
    data = append(data, []byte("]")...)
    tokenRes := (*conn).Publish(topic, qos, retain, data)
    tokenRes.Wait()
    err := tokenRes.Error()
    if err != nil {
      return err
    }

    mq.stateBuffer = mq.stateBuffer[:0]
    return nil
  }
  return nil
}
```

listenConfig will listen for any updates from mqtt server

```
// listenConfig connects to the config channel
func (mq *MqttClient) listenConfig() {
  // This is the topic that the device will receive configuration updates on.
  configTopic := fmt.Sprintf("/devices/%s/config", mq.cfg.DeviceID)
  conn := mq.connect()
  if conn == nil {
    return
  }
  if data := (*conn).Subscribe(configTopic, 1, func(client mqtt.Client, msg mqtt.Message) {
  }); data.Wait() && data.Error() != nil {
    log.Error("listenConfig: subscribe error")
    return
  }
}
```

Publish message to the state or event channel

```
// Publish message or Save state message to the buffer
func (mq *MqttClient) Publish(msg *Message) error {
  // Check if we have correct event topic
  if msg.topic != "data" && msg.topic != "state" &&
    !strings.HasPrefix(msg.topic, "data/") {
    err := fmt.Errorf("Wrong topic type: %s", msg.topic)
    log.Error("publish: Topic should be events or state")
    return err
  }

  // if its a state - we just put it in the buffer
  if msg.topic == "state" {
    if len(mq.stateBuffer)+len(msg.payload) < 65000 {
      if msg.payload[0] == '[' {
        msg.payload = msg.payload[1 : len(msg.payload)-1]
      }
      if len(mq.stateBuffer) > 4 && mq.stateBuffer[len(mq.stateBuffer)-1] != ',' {
        mq.stateBuffer = append(mq.stateBuffer, []byte(",")...)
      }
      mq.stateBuffer = append(mq.stateBuffer, msg.payload...)
    }
    return nil
  }

  // mq.dataBuf <- msg
  // for events we have 2 seconds timeline to send a message
  ctx, cancel := context.WithTimeout(context.Background(), time.Millisecond*100)
  defer cancel()
  for {
    select {
    case mq.dataBuf <- msg:
      return nil
    case <-ctx.Done():
      return fmt.Errorf("Publish: timeout canceled")
    }
  }
}
```

Wait for the new events and publish them immediately

```
func (mq *MqttClient) listenPublish() {
  for msg := range mq.dataBuf {
    conn := mq.connect()
    if conn == nil {
      log.Print("listenPublish: cannot send message")
      return
    }
    topic := fmt.Sprintf("/devices/%s/%s", mq.cfg.DeviceID, msg.topic)

    tokenRes := (*conn).Publish(topic, qos, retain, msg.payload)
    go func(tokenRes mqtt.Token, msg *Message) {
      tokenRes.Wait()
      err := tokenRes.Error()
      if err != nil {
        log.Print(err)
        return
      }
    }(tokenRes, msg)
  }
}
```

## Usage example

Here is a small usage how to run everything together:

```
func start(mqttClient *mqttclient.mqttClient) {
  sigs := make(chan os.Signal, 1)

  mqttClient := CreateMQTT(logBuff)

  // `signal.Notify` registers the given channel to
  // receive notifications of the specified signals.
  signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)

  // The program will wait here until it gets the
  // expected signal (as indicated by the goroutine
  // above sending a value on `done`) and then exit.
  <-sigs
  stop(mqttClient)
}

func stop(mqttClient *mqttclient.mqttClient) {
  mqttClient.DisconnectMQTT()
  time.Sleep(time.Second * 2)
  os.Exit(0)
}

func main() {
  confg, err := cfg.NewCfg()
  mqttClient := mqttclient.NewMqttClient(confg)

  // send state events
  stateData := map[string]int{
    "l_cpu_temp": 12,
    "r_cpu_temp": 32,
    "flow": 1,
    "pressure": 12,
  }
  b, err := json.Marshal(stateData)
  if err != nil {
    log.Print("streamToCloud: cannot marshal data")
    continue
  }
  err = mqttClient.Publish("state", b)
  if err != nil {
    log.Print("streamToCloud: cannot send state data")
  }

  // send 10 data events
  for i := range(10) {
    data := map[string]int{
      "index": i,
      "val": 10 + i,
    }
    err = mqttClient.Publish("data", b)
    if err != nil {
      log.Print("streamToCloud: cannot send state data")
    }
  }
}
```