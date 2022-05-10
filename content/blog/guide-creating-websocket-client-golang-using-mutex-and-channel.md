---
title: "Step by step guide for creating WebSocket client in Golang using mutex and channel"
subTitle: Guideline how to build websocket on go without any race conditions
description: >
  In this guide to using WebSockets in Golang I would like to concentrate  on the following: the application should work whether WebSocket server is online or not. The server can be offline for a number of reasons: poor connection, server issues, etc, but a
date: 2019-11-18
draft: false
authors: "Vlad Tarasenko"
image: /images/blog/26.jpg
tags: [
  "Golang",
  "Websocket",
  "Async"
]
---

In this guide to using WebSockets in Golang I would like to concentrate on the following: the application should work whether WebSocket server is online or not. The server can be offline for a number of reasons: poor connection, server issues, etc, but as soon as the WebSocket server's online so should be our application. Some messages must have the delivery guarantee and some may be discarded.

## Straightforward implementation

Let’s start building our WebSocket server. We'll use the 
[default server implementation](https://github.com/webdeveloppro/golang-websocket-client/commit/a152d6335d3916f47e5f11a69a5d0068382ea037#diff-34538493b671cc84d42dd43882ad5c19) 
and will create straightforward solution for the client:

```
// WebSocketClient returns websocket connection
type WebSocketClient struct {
  wsconn    *websocket.Conn
  configStr string
}
```

In this struct we have connection, config information

Connect function returns the existing connection if there is any or retries to connect to the websocket server each second if there's none.

```
func (conn *WebSocketClient) Connect() *websocket.Conn {
  if conn.wsconn != nil {
    return conn.wsconn
  }

  ticker := time.NewTicker(time.Second * 1)
  defer ticker.Stop()
  for ; ; <-ticker.C {
    ws, _, err := websocket.DefaultDialer.Dial(conn.configStr, nil)
    if err != nil {
      continue
    }
    conn.wsconn = ws
    go conn.listen()
    return conn.wsconn
  }
}
```

Listen function reads incoming WebSocket messages

```
func (conn *WebSocketClient) listen() {
  ticker := time.NewTicker(time.Second)
  for range ticker.C {
    ws := conn.Connect()
    if ws == nil {
      continue
    }
    for {
      _, byteMsg, err := ws.ReadMessage()
      if err != nil {
        conn.Close()
        break
      }
    }
  }
}
```

Here you can find [the full code](https://github.com/webdeveloppro/golang-websocket-client/commit/a152d6335d3916f47e5f11a69a5d0068382ea037#diff-fb87476fa66849c8514ba700e715b4b6)

The code is pretty simple, though it does have a few downsides:

- Memory leaks in goroutines;
- Wsconn variable is shared between goroutines without protection which can lead to unexpected results or panic;
- Data-races can cause instability and crashes.

## Goroutines and Mutex

We will start from a pretty simple yet powerful idea: we can protect sharing memory with the help of sync package. Each time you share a variable or a map between goroutines, you need to guard them with ```Mutex.lock```, and unlock them when you are done. And that means we need to use Mutex in our Connect function.

```
diff --git a/pkg/client/client.go b/pkg/client/client.go
index 3ac1788..739c825 100644
--- a/pkg/client/client.go
+++ b/pkg/client/client.go
@@ -4,6 +4,7 @@ import (
        "encoding/json"
        "fmt"
        "net/url"
+       "sync"
        "time"

        "github.com/gorilla/websocket"
@@ -12,7 +13,9 @@ import (
 // WebSocketClient return websocket client connection
 type WebSocketClient struct {
        configStr string
-       wsconn    *websocket.Conn
+
+       mu     sync.Mutex
+       wsconn *websocket.Conn
 }


 func (conn *WebSocketClient) Connect() *websocket.Conn {
+       conn.mu.Lock()
+       defer conn.mu.Unlock()
        if conn.wsconn != nil {
                return conn.wsconn
        }
```

It seems solid. Full [listing here](https://github.com/webdeveloppro/golang-websocket-client/commit/fbf763136bc753c0591273b63bf45cac517038dd#diff-fb87476fa66849c8514ba700e715b4b6).

But what are we supposed to do if we have a lot of incoming data to write and the server is down? We don’t want the client to consume too much memory and we need a way to drop the data. NewWebSocketClient constructor always calls the Connect function first and locks ```conn``` variable. Since we have no way to call the Write function before that, the Write function has to wait for its turn with no connection to the server.

## Goroutines and RWMutex

If we take a closer look at our code we notice that there are either read or write operations. Basically, Listen function is used for reading from websocket and Write function is used for writing. We can use rwmutex to make a blocking call shared variables depending on
reading or writing condition but we need to be careful.

We need to lock Connect on reading access and unlock it after

```
diff --git a/pkg/client/client.go b/pkg/client/client.go
index 739c825..da504f8 100644
--- a/pkg/client/client.go
+++ b/pkg/client/client.go
@@ -14,7 +14,7 @@ import (
 type WebSocketClient struct {
        configStr string

-       mu     sync.Mutex
+       mu     sync.RWMutex
        wsconn *websocket.Conn
 }

@@ -31,11 +31,12 @@ func NewWebSocketClient(host, channel string) (*WebSocketClient, error) {
 }

 func (conn *WebSocketClient) Connect() *websocket.Conn {
-       conn.mu.Lock()
-       defer conn.mu.Unlock()
+      conn.mu.RLock()
        if conn.wsconn != nil {
+              conn.mu.RUnlock()
                return conn.wsconn
        }
+       conn.mu.RUnlock()

```

It looks like we've made two mistakes here. First, we should have used defer. There's a span in RUnlock when race condition can still occur. Conn variable is first unlocked and then returned.
And second, we have forgotten to unlock readlock ```conn.mu.RUnlock()``` in case we don’t have a connection.

```
 @@ -31,11 +31,12 @@ func NewWebSocketClient(host, channel string) (*WebSocketClient, error) {
 }

 func (conn *WebSocketClient) Connect() *websocket.Conn {
-       conn.mu.Lock()
-       defer conn.mu.Unlock()
+      conn.mu.RLock()
        if conn.wsconn != nil {
+              defer conn.mu.RUnlock()
                return conn.wsconn
        }
+       conn.mu.RUnlock()
```

For creating, we need to do a full “block” to assign a new connection:

```
@@ -46,7 +47,9 @@ func (conn *WebSocketClient) Connect() *websocket.Conn {
                        continue
                }
                conn.log("connect", nil, fmt.Sprintf("connected to websocket to %s", conn.configStr))
+               conn.mu.Lock()
                conn.wsconn = ws
+               conn.mu.Unlock()
                return conn.wsconn
        }
 }
```

And here, we did not put defer intentionally. ```defer``` inside ```for``` can lead to unpredicted results.

For the write function we need to use full block

```
@@ -78,7 +79,9 @@ func (conn *WebSocketClient) Write(payload interface{}) error {
        if err != nil {
                return err
        }
-       ws := conn.Connect()
+       conn.mu.Lock()
+       defer conn.mu.Unlock()
+       ws := conn.wsconn
        if ws == nil {
```

Once we run - we can see that read and write are works in parallel, and if we lost connection write will just drop messages without holding them. [Full listing](https://github.com/webdeveloppro/golang-websocket-client/commit/8d095002873ea43ddf1a09c351f7fbf079924ae8#diff-fb87476fa66849c8514ba700e715b4b6)

## Simplify code with channels

One of Golang's core concepts says: “Don’t communicate by sharing memory; instead, share memory by communicating.”. Golang does have a lot of tools to communicate by sharing memory indeed.<br>
Our connect function got little bit messy and what if we would like to drop message if connection is not available? We can add even more lock/unlocks but it would make application hard to read and maintain in the future. Rules of thumb here is if you feel you are getting spaghetti code with mutex you should try to combine mutex with channels.

Following this rule, lets start with a simple version, the idea is that:

- we will save data in a temporary channel in the client structure.
- once server is up we immediately send a data
- to maintain the link between temporary buffer and connection status we will update Write and will create new ```listenWrite```. Write function will write to channel only, and ```listenWrite``` will wait for a new data from a channel and will try to send that data to websocket server.

Lets add buffer to the client structure:

```
diff --git a/pkg/client/client.go b/pkg/client/client.go
index da504f8..4e833bf 100644
--- a/pkg/client/client.go
+++ b/pkg/client/client.go
@@ -13,6 +13,7 @@ import (
 // WebSocketClient return websocket client connection
 type WebSocketClient struct {
        configStr string
+       sendBuf   chan []byte

        mu     sync.RWMutex
        wsconn *websocket.Conn
@@ -20,23 +21,25 @@ type WebSocketClient struct {

 // NewWebSocketClient create new websocket connection
 func NewWebSocketClient(host, channel string) (*WebSocketClient, error) {
-       conn := WebSocketClient{}
+       conn := WebSocketClient{
+               sendBuf: make(chan []byte, 1),
+       }

        u := url.URL{Scheme: "ws", Host: host, Path: channel}
        conn.configStr = u.String()

        go conn.Connect()
        go conn.listen()
+      go conn.listenWrite()
        return &conn, nil
 }
```

New write function

```
func (conn *WebSocketClient) Write(payload interface{}) error {
        data, err := json.Marshal(payload)
        if err != nil {
                return err
        }
-       conn.mu.Lock()
-       defer conn.mu.Unlock()
-       ws := conn.wsconn
-       if ws == nil {
-               err := fmt.Errorf("conn.ws is nil")
-               return err
-       }
+       conn.sendBuf <- data
+       return nil
+}
```

listenWrite is waiting for a data from sendBuf using for instruction. We moved all old code from write function into for cycle.

```
+func (conn *WebSocketClient) listenWrite() {
+       for data := range conn.sendBuf {
+               ws := conn.Connect()
+               if ws == nil {
+                       err := fmt.Errorf("conn.ws is nil")
+                       conn.log("listenWrite", err, "No websocket connection")
+                       continue
+               }
    // old write function
```

Plus, we would need to update constructor and other functions accordingly, here is a [full client file](https://github.com/webdeveloppro/golang-websocket-client/commit/8d095002873ea43ddf1a09c351f7fbf079924ae8#diff-fb87476fa66849c8514ba700e715b4b6)

Thanks to the channel, our connection function easy to read and understand once again:

```
func (conn *WebSocketClient) Connect() *websocket.Conn {
  conn.mu.Lock()
  defer conn.mu.Unlock()
  if conn.wsconn != nil {
    return conn.wsconn
  }

  ticker := time.NewTicker(time.Second)
  defer ticker.Stop()
  for ; ; <-ticker.C {
      ws, _, err := websocket.DefaultDialer.Dial(conn.configStr, nil)
      if err != nil {
        conn.log("connect").Error().Err(err).Msgf("Cannot connect to websocket: %s", conn.configStr)
        continue
      }
      conn.log("connect").Debug().Msgf("connected to websocket to %s", conn.configStr)
      conn.wsconn = ws
      return conn.wsconn
  }
}
```

## Context with cancelation

Lets get back to the memory leaks problem. To avoid memory leak and orphans goroutines it’s strongly recommended to add context and cancel functions to your goroutines with infinity loops. As we can see, few our functions (listenWrite, Connect) can become orphan goroutine. And, as our second goal, we still want to create write function which will drop messages if connection is not ready.

Lets start our write function, its a good candidate for context with timeout instruction. To make write function smart, we will give 50ms to write data before dropping it.
First of all we need to make sure our sendBuf is 1, unless we want to keep first 100 messages in the buffer:

```
-              sendBuf:    make(chan []byte, 100),
+              sendBuf:    make(chan []byte, 1),
```

Next, will add context which will stop function execution automatically after 50 milliseconds, so it will look like this:

```
@@ -80,8 +99,17 @@ func (conn *WebSocketClient) Write(payload interface{}) error {
        if err != nil {
                return err
        }
-       conn.sendBuf <- data
-       return nil
+       ctx, cancel := context.WithTimeout(context.Background(), time.Millisecond*50)
+       defer cancel()
+
+       for {
+               select {
+               case conn.sendBuf <- data:
+                       return nil
+               case <-ctx.Done():
+                       return fmt.Errorf("context canceled")
+               }
+       }
 }
```

Basically, thats all - our function write function will drop message if it wasn’t written to the websockets after 50ms.

Going back to first problem, memory leaks in gorutings. Thats quit simple to fix too, we just need to add global cancellation functionality, so lets update client structure first:

```
diff --git a/pkg/client/client.go b/pkg/client/client.go
index 6152174..76da3c6 100644
--- a/pkg/client/client.go
+++ b/pkg/client/client.go
@@ -1,6 +1,7 @@
 package client

 import (
+       "context"
        "encoding/json"
        "fmt"
        "net/url"
 )

 // WebSocketClient return websocket client connection
 type WebSocketClient struct {
        configStr string
        sendBuf   chan []byte
+       ctx       context.Context
+       ctxCancel context.CancelFunc

        mu     sync.RWMutex
        wsconn *websocket.Conn
@@ -22,15 +28,16 @@ type WebSocketClient struct {
 // NewWebSocketClient create new websocket connection
 func NewWebSocketClient(host, channel string) (*WebSocketClient, error) {
        conn := WebSocketClient{
-               sendBuf: make(chan []byte, 100),
+              sendBuf: make(chan []byte, 1),
        }
+       conn.ctx, conn.ctxCancel = context.WithCancel(context.Background())

        u := url.URL{Scheme: "ws", Host: host, Path: channel}
        conn.configStr = u.String()

        go conn.listen()
        go conn.listenWrite()
        return &conn, nil
 }
```

and for every goroutine with forever loops we will add select which will wait to the Done event or continue function execution otherwise.

```
@@ -44,14 +51,19 @@ func (conn *WebSocketClient) Connect() *websocket.Conn {
        ticker := time.NewTicker(time.Second)
        defer ticker.Stop()
        for ; ; <-ticker.C {
-               ws, _, err := websocket.DefaultDialer.Dial(conn.configStr, nil)
-               if err != nil {
-                       conn.log("connect", err, fmt.Sprintf("Cannot connect to websocket: %s", conn.configStr))
-                       continue
+               select {
+               case <-conn.ctx.Done():
+                       return nil
+               default:
+                       ws, _, err := websocket.DefaultDialer.Dial(conn.configStr, nil)
+                       if err != nil {
+                               conn.log("connect", err, fmt.Sprintf("Cannot connect to websocket: %s", conn.configStr))
+                               continue
+                       }
+                       conn.log("connect", nil, fmt.Sprintf("connected to websocket to %s", conn.configStr))
+                       conn.wsconn = ws
+                       return conn.wsconn
                }
-               conn.log("connect", nil, fmt.Sprintf("connected to websocket to %s", conn.configStr))
-               conn.wsconn = ws
-               return conn.wsconn
        }
 }

…
```

Same for the ```listen```

```
@@ -60,17 +72,24 @@ func (conn *WebSocketClient) listen() {
        ticker := time.NewTicker(time.Second)
        defer ticker.Stop()
        for {
-               ws := conn.Connect()
-               if ws == nil {
+               select {
+               case <-conn.ctx.Done():
                        return
+               case <-ticker.C:
+                       for {
+                               ws := conn.Connect()
+                               if ws == nil {
+                                       return
+                               }
+                               _, bytMsg, err := ws.ReadMessage()
+                               if err != nil {
+                                       conn.log("listen", err, "Cannot read websocket message")
+                                       conn.closeWs()
+                                       break
+                               }
+                               conn.log("listen", nil, fmt.Sprintf("websocket msg: %x\n", bytMsg))
+                       }
                }
-               _, bytMsg, err := ws.ReadMessage()
-               if err != nil {
-                       conn.log("listen", err, "Cannot read websocket message")
-                       conn.Stop()
-                       break
-               }
-               conn.log("listen", nil, fmt.Sprintf("receive msg %s\n", bytMsg))
        }
 }
```

And one other advice from websocket best practices, add ping/pong communication. Its important to have it in a case if server process will come to the zombie state. Client listen function won’t get any error and unless client will try to write data to the server, will keep reading nothing and it will looks like everything works as it should. Ping functionality can be easily implemented with one function:

```
+// Send pings to peer with this period
+const pingPeriod = 30 * time.Second
+


+func (conn *WebSocketClient) ping() {
+       conn.log("ping", nil, "ping pong started")
+       ticker := time.NewTicker(pingPeriod)
+       defer ticker.Stop()
+       for {
+               select {
+               case <-ticker.C:
+                       ws := conn.Connect()
+                       if ws == nil {
+                               continue
+                       }
+                       if err := conn.wsconn.WriteControl(websocket.PingMessage, []byte{}, time.Now().Add(pingPeriod/2)); err != nil {
+                               conn.closeWs()
+                       }
+               case <-conn.ctx.Done():
+                       return
+               }
+       }
+}
+
```

You can find whole code of the websocket [client here](https://github.com/webdeveloppro/golang-websocket-client)