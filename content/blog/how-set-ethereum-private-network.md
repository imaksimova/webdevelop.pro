---
title: "How to set up Ethereum private network"
subTitle: Some solutions for the problems while setting up Ethereum private network.
description: >
  It seems like the internet has tons of articles on how to set up your own Ethereum private network, but to do this, I walked through several problems and decided to write down the full article which includes problems I faced and solutions.
date: 2018-05-20
draft: false
authors: "Vlad Tarasenko"
image: /images/blog/31.png
tags: [
  "Eth",
  "Geth",
  "Golang",
  "Ethereum"
]
---

Hello crypto folks!

It seems like the internet has tons of articles on how to set up your own Ethereum private network, but to do this, I walked through several problems and decided to write down the full article which includes problems I faced and solutions.

Please keep in mind if you might rewrite or remove your "life" keys and you may lose your ether forever. Don't do any experiments on without backing up your real keys.

I am assuming we have already installed and working from the command line.

## Fresh start:

In case if you did something before. The first step, start on a fresh note, remove or move all our past experiments, some "leftovers" can break everything.

## Set up genesis file:

For our private network to work, we need to set up genesis file, which we have to copy on all our nodes manually:

```
function $initHighlight(block, cls) {
  try {
    if (cls.search(/\bno\-highlight\b/) != -1)
      return process(block, true, 0x0F) +
             ` class="${cls}"`;
  } catch (e) {
    /* handle exception */
  }
  for (var i = 0 / 2; i < classes.length; i++) {
    if (checkCondition(classes[i]) === undefined)
      console.log('undefined');
  }
}
```

```
{
 "config": {
       "chainId": 873,
       "homesteadBlock": 0,
       "eip155Block": 0,
       "eip158Block": 0
 },
 "alloc"      : {},
 "coinbase"   : "0x0000000000000000000000000000000000000000",
 "difficulty" : "0xfe000",
 "extraData"  : "",
 "gasLimit"   : "0x2fefd8",
 "nonce"      : "0x0000000000000042",
 "mixhash"    : "0x0000000000000000000000000000000000000000000000000000000000000000",
 "parentHash" : "0x0000000000000000000000000000000000000000000000000000000000000000",
 "timestamp"  : "0x00"
}
```

### Problems and issues I faced:

**- chainId:**<br>
Chain id identifies the current chain and is used for replay protection. Do not use 0 here - you won’t be able to deploy your contracts. Don’t ask me why.

**- difficulty:**<br>
This value is used to control the Block generation time of a Blockchain, keeping the Block generation frequency within a target range. On the test network, we keep this value low to avoid waiting during tests since the discovery of a valid Block is required to execute a transaction on the Blockchain. Don’t make it too small or too big. The ability to generate 1-2 coin per minute is enough.

**- alloc:**<br>
Allows defining a list of pre-filled wallets. That’s an Ethereum specific functionality to handle the “Ether pre-sale” period.

**- timestamp:**<br>
The timestamp also allows verifying the order of block within the chain (Yellow Paper, 4.3.4. (43)).

**- gasLimit:**<br>
A scalar value equal to the current chain-wide limit of Gas expenditure per block. High in our case to avoid being limited by this threshold during tests.

Let’s save our genesis file to the *~/private_network/genesis.json* file.

## Initial folder creation:
The second important step is to create a primary Ethereum chain based on the genesis file.

I guess, its a part which is confusing. Your nodes run anyway, and you don’t get any strict error if 
you miss an initial step or use different/empty/wrong directory in the next step.

```
geth init ~/private_network/genesis.json --datadir ~/private_network/ethdata
```

Command takes a few seconds to run, and in ~/private_network/ethdata folder, you should see two more folders: geth and keysore. Make sure you can see them.

If you can see that - it’s great. If not double-check your paths. You may recognize an error only on the next step.

## Turn on a private server on the first node:

```
geth --verbosity 6 --datadir="~/private_network/ethdata" --networkid 928928928 --
rpc 127.0.0.1:8545 --rpcapi personal,web3,miner,eth --nodiscover 
```

**- datadir:**<br>
It must be the same as step two.

**- nodiscover:**<br>
Sometimes helps other nodes to connect to the first node. Again, don’t ask me why.

**- verbosity:**<br>
The controls output information must have for debugging issues.

In geth output, find out a text:

```
RLPx listener up
self="enode://947afec11dd0b2b531e3806b43a7c3b12202a2f765d5a2da36394d89e49fe795b4aa3bf42612b98c35181925da16797aebad44a2bda8953a23c883772687237d@[]:30303?discport=0" 
```

and save enode address.

### Set up node on the second machine:

- Create initial eth data:
```
~/private_network/genesis.json file
```
- Set up initial eth data:
```
geth init ~/private_network/genesis.json --datadir ~/private_network/ethdata
```
- Run:
```
geth --datadir="~/private_network/ethdata" --networkid 928928928 --rpc 
127.0.0.1:8545 --rpcapi personal,web3,miner,eth --nodiscover --bootnodes 
enode://947afec11dd0b2b531e3806b43a7c3b12202a2f765d5a2da36394d89e49fe795b4aa3bf42612b98c35181925da16797aebad44a2bda8953a23c883772687237d@<first_node_ip>:30303 
```
You have to use the enode address from the first node. You have to set up

```<first_node_ip>```

and make sure the first node is accessible from that IP.

## Testing and mining process:

After our set up and run geth on the second machine, let’s try to connect to the geth.ipc and create new accounts for mining.

Let’s do on both nodes:

```
geth attach ~/private_network/ethdata/geth.ipc
```

Let’s check we are really using the new network:

```
> personal.listAccounts
[]
```

Should return an empty array, let’s create a new address then:

```
> personal.newAccount(“mypassword”)
“0xXXXYYYZZZZ”
```

and do some mining:

```
miner.start()
```

Check your balance minute after:

```
eth.getBalance(“0x123123”)
```

## Common problems with Ethereum private networks:

DAG generation takes too much time.
There is nothing really you can do; it can take from 3 minutes up to 30. You just need to wait.

Balance is always 0, and node does not mine, the miner does not work --> check out our geth output, look for the warnings or error messages.

There are a few possible problems, and I'll start with the most common ones:

**1. No peers added to the second node.**<br>
Open geth console, and type:

```
geth attach ~/private_network/ethdata/geth.ipc
admin.addPeer("enode://FIRST_NODE_ADDRESS@NODE_IP:PORT");
miner.start()
```

If that does not help:

**2. Make sure you are using init folder from geth init genesis.json command.**<br>
As I told before, it’s confusing, you can run geth with bootnodes without using the right genesis.json start dir, and it will run.

**3. Network issues**<br>
First node not accessible or network packages blocked by a firewall. Try to connect to your node with telnet:

```
telnet <ip> <port>
```

and see if you can connect to the node. The node terminates the connection after 5-10 sec automatically. That’s normal.

If you want to use mist or anything else with your private network - run:

```
mist --rpc ~/private_network/geth.ipc 
```

Let me know if you have any other problems in the comments, and let's try to figure it out together.
