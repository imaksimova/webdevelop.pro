---
title: "Basic comparison between Python async and sync function"
subTitle: Something crucial about Python functions.
description: >
  Async operation will really speed up your code for blocking I/O operations or networks requests. But it requires to work carefully with "event loop" and code might get complicated.
date: 2018-03-26
draft: false
authors: "Vlad Tarasenko"
image: /images/blog/33.png
tags: [
  "Python",
  "Async",
  "Function",
  "Sync"
]
---

Async operation will really speed up your code for blocking I/O operations or network requests. But it requires to work carefully with "event loop," and code might get complicated.

## Synchronous/Blocking IO

### Sequential execution

In synchronous operations, everything is simple: you have a code that is working step by step on each operation; your resources are blocked until that operation will not return control to the program.

![post image](/images/blog/post-img-43.png)

## Asynchronous execution

All Python code executes in the main request thread, but the main advantage of the asynchronous operation is:
1) that I/O does not block it, and
2) multiple I/O or other async tasks can execute concurrently.

Usually, 90% of the programming time spends on I/O, database, network operations.

![post image](/images/blog/post-img-44.png)

The reordering of different task instructions in this way allows you to hide I/O latency. So while one task is currently sitting at an I/O instruction (e.g., waiting for data), another task's instruction, with hopefully less latency, can execute in the meantime.

**Test results**

- sync: python 2.7.10 + requests library;
- async: python 3.6 + iohttp with asyncio;
- loop script: python test.

**1 request**

sync:

```
sync$ time python test.py > /dev/null0.107u 0.051s 0:00.64 23.4% 0+0k 0+0io 0pf+0w
```

async:

```
async$ time python test.py > /dev/null0.195u 0.049s 0:00.68 30.8% 0+0k 0+0io 0pf+0w
```

For one request we won't see any big difference and sometimes async operation can take even more time to execute, but let's check out **10 iterations.**

sync:

```
sync$ time python test.py 10 > /dev/null0.451u 0.065s 0:05.50 9.2%  0+0k 0+0io 0pf+0w
```

async:

```
async$ time python test.py 10 > /dev/null0.218u 0.031s 0:01.77 13.5% 0+0k 0+0io 0pf+0w
```

Here we can see that async execution finished in 2 sec versus a traditional method that finished in 6 sec.

**1000 requests**

sync:

```
sync$ time python test.py 1000 > /dev/null37.998u 1.166s 9:31.52 6.8% 0+0k 0+0io 277pf+0w
```

async:

```
async$ time python test.py 1000 > /dev/null2.221u 0.231s 2:03.71 1.9%  0+0k 49+0io 695pf+0w
```

**Almost 10 min vs 2 min.**

Now, let's say we have a real application with millions of requests per day. The payoff is obvious.