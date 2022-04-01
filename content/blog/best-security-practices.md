---
title: "Recommended security practices"
description: Choosing simple and fast solutions over security is not our way. We have worked with many projects that required a high level of security. Over the years we’ve learned to find a balance between the project budget, high-security standards, and better experience for the end-user. In Webdevelop Pro we strive to incorporate security into every product that we create.
date: 2020-04-28
draft: false
authors: "Vlad Tarasenko"
image: /images/blog/15.jpg
tags: [
  "Golang",
  "Network Security",
  "Python"
]
---

Before going deep into our topic, it would be good to make a historical understanding introduction.

## Why we have so many vulnerable software?

### Security never in a big priority

Security is not something that brings money to most of the companies. Therefore companies are focused on their direct product and leave everything else in the second place. There is an old saying that you need to:

- Get to market fast.
- Include all features planned.
- Maintain a high level of quality.

And, as you know, simultaneously you can only have two out of the three. So, while quality is part of the conversation, security is even not included in the list. But, at the same time, security usually is not just a feature but a core component of the product and it is hard to get it right behindhand.

### Quality Doesn’t Mean Security

The Quality Assurance Engineer, usually, does not check for security flaws. His/her primary task is to make sure the product works as intended but QA doesn’t do hacking on a regular basis. Almost all the time security creates a problem for user interface and increases the complexity of the product.

### Too Many Moving Parts in Modern applications

Current modern applications are big and complex. Long-running products contain a lot of legacy code. Multiple development teams and remote contractors spread around the world. For project managers, it is difficult enough to ensure that the software functions properly.

### Not Enough Skills

Unfortunately, we don't have enough security-oriented engineers on the market. Many people involved in software development just don’t have enough experience and knowledge of security problems.

## What's the Solution?

First of all, check your system as recently as possible. Finding security problems early reduces costs and speeds up release cycles. Usually, security consulting agencies are expensive, but we are happy to share with our clients a number of effective and easy-to-implement practices.

- Static code analysis
- Code reviews
- Follow security guidelines

### Static Code Analysis Tools for Secure Software Development

A wide array of all known security defects can be found by the static code analysis. Getting reports, finding, and fixing security problems is a simple and well-working approach. Static code analysis tools can identify errors, including:

- Memory leaks
- Access violations
- Arithmetic errors
- Array and string overruns

This maximizes code and minimizes the impact of errors on the finished product — and project timeline. For golang we do recommend GoSec, Golang linter, and memory sanitizer checks. It's much harder to analyze dynamic languages, but still, you can use Bandit and Pylinter for python

### Code Reviews

It's straight forward. More skilled engineers should share their knowledge and check other developer's code. Engineers should challenge themselves to read about new security standards and practices.

## Follow Security Guidelines

We build for you general security guidelines that we follow in every project.

### Authentication

- Don't rely on Basic Auth. Use standard authentication instead, JWT, OAuth.
- Use the standards. Don't reinvent the wheel in Authentication, token generation, password storage.
- Use Max Retry and jail features in Login.
- Use encryption on all sensitive data. Encryption with the public key is a good approach.

### JSON Web Token

- Always generate a random complicated key to make brute-forcing the token very hard.
- Don't extract the algorithm from the header. Force the algorithm in the backend (HS256 or RS256).
- Make token expiration (TTL, RTTL) as short as possible.
- Don't store sensitive data in the JWT payload, it can be decoded

### OAuth

- Always validate redirect_uri server-side to allow only whitelisted URLs.
- Always try to exchange for code and not tokens (don't allow response_type=token).
- Use state parameter with a random hash to prevent CSRF on the OAuth authentication process.
- Define the default scope, and validate scope parameters for each application.

### Access

- Limit requests (Throttling) to avoid DDoS / brute-force attacks.
- Use HTTPS on server-side to avoid MITM (Man in the Middle Attack).
- Use HSTS header with SSL to avoid SSL Strip attack.

### Input

- Use the proper HTTP method according to the operation: GET (read), POST (create), PUT/PATCH (replace/update), and DELETE (to delete a record), and respond with 405 Method Not Allowed if the requested method isn't appropriate for the requested resource.
- Validate content-type on request Accept header (Content Negotiation) to allow only your supported format (e.g. application/xml, application/json, etc.) and respond with 406 Not Acceptable response if not matched.
- Validate content-type of posted data as you accept (e.g. application/x-www-form-urlencoded, multipart/form-data, application/json, etc.).
- Validate user input to avoid common vulnerabilities (e.g. XSS, SQL-Injection, Remote Code Execution, etc.).
- Don't use any sensitive data (credentials, Passwords, security tokens, or API keys) in the URL, but use standard Authorization header.
- Use an API Gateway service to enable caching, Rate Limit policies (e.g. Quota, Spike Arrest, or Concurrent Rate Limit) and deploy APIs resources dynamically.

### Processing

- Check if all the endpoints are protected behind authentication to avoid broken authentication process.
- User own resource ID should be avoided. Use /me/orders instead of /user/654321/orders.
- Don't auto-increment IDs. Use UUID instead.
- Use a CDN for file uploads.
- If you are dealing with a huge amount of data, use Workers and Queues to process as much as possible in the background and return response fast to avoid HTTP Blocking.
- Do not forget to turn the DEBUG mode OFF.

### Output

- Send X-Content-Type-Options: nosniff header.
- Send X-Frame-Options: deny header.
- Send Content-Security-Policy: default-src 'none' header.
- Remove fingerprinting headers - X-Powered-By, Server, X-AspNet-Version, etc.
- Force content-type for your response. If you return application/json, then your content-type response is application/json.
- Don't return sensitive data like credentials, Passwords, or security tokens.
- Return the proper status code according to the operation completed. (e.g. 200 OK, 400 Bad Request, 401 Unauthorized, 405 Method Not Allowed, etc.).

### CI & CD

- Audit your design and implementation with unit/integration tests coverage.
- Use a code review process and disregard self-approval.
- Ensure that all components of your services are statically scanned by AV software before pushing to production, including vendor libraries and other dependencies.
- Design a rollback solution for deployments.