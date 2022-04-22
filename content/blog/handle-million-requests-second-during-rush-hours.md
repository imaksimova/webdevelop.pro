---
title: "Handle million requests per second during rush hours"
description: For end-user, it doesn't matter how powerful your server if user needs to wait for couple seconds the see content on the main page. We are talking about latency of the whole platform in general and you need to keep in mind that a system is only as fast as the slowest component.
date: 2020-05-15
draft: false
authors: "Vlad Tarasenko"
image: /images/blog/10.jpg
tags: [
  "Golang",
  "Big Data",
  "Python",
  "Scalability",
  "Architecture"
]
---

Today, I want to talk about how to handle millions of requests during different promotions, rush hours, and just unexpected users flow.

We are talking about the latency of the whole platform in general and you need to keep in mind that a system is only as fast as the slowest component. For end-user, it doesn't matter how powerful your server if the user needs to wait for a couple of seconds to see content on the main page. Also, be ready for some unexpected problems, like if you don't have enough bandwidth to meet the demand. In that case, there is no need to looking for a problem in the application itself.

Let's start with simple steps. In general, its always useful to keep in eye on your system performance, but also be aware - premature optimization is the root of all evil. Start with an understanding of what's currently the slowest part of your application.

### Understanding whats slow

If you are doing optimization for the first time, probably you can identify your problem components pretty quickly. Start with splitting our application on the backend and frontend.

### Default Frontend Optimization

As for the frontend, inspect frontend (HTML/js/CSS) on standard caching practices:

- Use cache headers in your responses (Etag, cache and so on)
- Store all static data on CDN if you can
- Optimize your images using tinypng service
- Inspect your javascript libraries. Make sure you don't use different libraries with the same functionality
- Gzip all HTML/js/CSS content. All modern browser supports gzipping
- Try to reduce the number of requests to 3rd party services. Including different metrics, analytics, and advertisement tools

### Simple Backend optimizations

As for the backend, here is a simple list which will help you to increase application response time:

- Make sure you are using database connection pooling
- Inspect your SQL queries and add caching for them
- Add caching for whole responses

You will need to keep your cache updated but in a lot of cases, you can improve the situation dramatically.

## Code and Architecture changed

In order to go deeper, I would recommend starting with some benchmark or loading tests. And based on your architecture you will need to use different tools. Ideally, you want to have backend benchmark tests using [https://github.com/wg/wrk](https://github.com/wg/wrk) or ab, and an end to end benchmark tests using headless chrome applications (testcafe and similars).

Basic wrk usage:

<pre>
<code>wrk -t12 -c400 -d30s http://127.0.0.1:8080/

Running 30s test @ http://127.0.0.1:8080/
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   635.91us    0.89ms  12.92ms   93.69%
    Req/Sec    56.20k     8.07k   62.00k    86.54%
  22464657 requests in 30.00s, 17.76GB read
Requests/sec: 748868.53
Transfer/sec:  606.33MB
</code>
</pre>

Test the most popular endpoints and to see the general picture and understand where the bottleneck is.

### Exploring details

Once we have information about the existing bottleneck we need to dig deeper and see how it's possible to fix. In most cases, most slow operations are networking requests and reading/writing I/O operations. Whatever possible - try to use non-blocking operations or light threads for network and i/o operations. You can get a lot of benefits from using different profiling solutions like New Relic’s Thread Profiler, Stackdriver Profiling or simply using pprof for golang/c++ applications.

![](/images/blog/post-img-1.png)

### Whats next?

After fixing general bottlenecks, you might find yourself in the position where you have eliminated all major problems but still, you don't have the response time you need. The next step you can take is to update application architecture, set up Kubernetes with autoscaling functionality, and start using cloud providers.

### Microservices

Typical situation - when you have a few components which eat 80% of the resources during rush hours. Cause of those two components core functionality isn't working fast enough and project losing users. A reliable and robust solution is to split your application by parts, so each part can work independently and add resources only where it is needed. With microservices you can archive:

- Better management through modularity
- Deploying and updating software at scale

### Using Kubernetes and autoscaling

Probably, if you haven't yet, you should start using Kubernetes. It does give you the ability to add more resources when needed and shut it down once pick is gone. K8s provide nice, well-tested container orchestration solution and add fault-tolerant updates, have built-in communication across a cluster, and much more. But one of the disadvantages is that it's hard and timeconsuming to maintain.

### Using cloud providers

AWS, Google Cloud, Azure - that's all great solutions and they will provide and manage advanced technologies for you. While you will pay much more for all these bells and whistles, some of them can help to easily build a scalable, reliable solution. If you are expecting to have millions requests per second, probably you should consider using a cloud provider from a beginning.