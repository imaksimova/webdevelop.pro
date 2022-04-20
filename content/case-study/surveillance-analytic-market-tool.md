---
date: 2022-03-31T16:09:15+03:00
draft: false
title: "Market Surveillance & Analytic"
subTitle: Network Security, Fintech software, Blockchain
description: >
  A client is a group of people from Standford University with an experience in law and e-commerce industries. When cryptocurrencies ski up from $1000 to $18 000 for bitcoin in about two years, it was a bloom of different startups, companies, and technologies based on blockchain technology. It was also bloom for venture capital and angel investors. While blockchain opens a lot of new opportunities, cryptocurrency markets are global, fragmented, and still widely unregulated.
casesItems:
  - label: Expertise
    text: Network Security, Fintech software, Blockchain
  - label: Deliverables
    text: Research, Development
  - label: Tech stack
    text: >
      Google Cloud and related services: Google SQL, Kubernetes, Google build, 
      and Cloud functions, <a href="/tags/python/">python</a>, 
      <a href="/tags/golang">golang</a>, <a href="/tags/vuejs-2">Vuejs</a>, 
      Stylus, Postgres, testcafe.
goals: >
  <p>AIf you have invested 100 000 bitcoins into blockchain startup, what's real picture of founders digital assets, does they use funds for company expenses only? Previously, does that company had any suspicion transactions? Crypto market was missing an analytic and surveillance tool for digital assets. The company been providing wallet surveillance, analytic and fund movement reports. You can set up notifiction to get report during strange network or wallets activity. As a venture capital, or fintech company you can sign a partnership and get a full report of of funds movements and predictions of funds beloning after using mixers or another coin laundering schemes.</p>
goalsItem:
  - text: funds movements
  - text: surveillance for mixers
  - text: deanynomous wallet owners
  - text: labeling wallets with identities
  - text: unusual network activity
  - text: movements on target wallets

tags: [
  "Fintech",
  "Blockchain",
  "E-commerce"
]
---

## Challenges

The company has a massive goal of collecting, storing and identifying transactions in bitcoin, ethereum, and other blockchain ledgers. While reading and transcoding blockchain transactions in a traditional SQL database is not a trivial task by itself, analyzing mixer transactions and identifying wallet owners was complicated and hard to solve challenge. In addition, the company has a tradiional problem of growing, building relations with customers and were actively looking for engineers, designers, data scientists, and quality engineers.

## Solution

At first, we split our resources based on priorities and company goals. Relatively quickly we manage to set up google dataflow jobs to build bitcoin and ethereum blockchain ledger parser and saved all the data into postgresql and bigquery storages. Using google cloud AI tools (deep learning VM images, data labeling services, AI Hub) data scientists we able to process raw transactions and build prediction models. Partnership with different exchanges helped us to retrieve vital data set to deanonymize and label wallets with concrete identifies.

## Results

At first, the company were able to reach intermediate results. By building analyzer tool for bitcoin ledger company attracted different venture capitals: Pantera, foundation capital, aspect venture, digital currency group. This provides critical connections to get data sets to work with wallet identifies and funds prediction after mixers. While those tasks aren’t possible to solve 100% correctly the company was successful enough to be bought by a big player on the market