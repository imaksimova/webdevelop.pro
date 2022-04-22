---
date: 2020-04-06
draft: false
title: "Decentralized art gallery"
subTitle: Blockchain, Digital Marketing, Art, Fintech software
textIntro: >
  Our client was a digital art gallery where you one could buy rare 
  collectibles from popular artists and resell them later. The client was among 
  the first users of non-fungible or unique tokens on the Ethereum blockchain 
  and his company is even mentioned in the ERC-721 token standard as one of the successful early examples.
description: >
  The client is a digital art gallery where you can buy rare collectibles from popular artists and resell it later. The client was the first adaptor of non-fungible or unique tokens on the Ethereum blockchain and his company is even mentioned in the ERC-721 token standard as one of the early examples.
casesItems:
  - label: Expertise
    text: Blockchain, Digital Marketing Art, Fintech software
  - label: Deliverables
    text: Research, Development, Testing
  - label: Tech stack
    text: >
      Google Cloud and related services (google SQL, Kubernetes, google build, cloud functions). 
      Python, Golang, Vuejs, Stylus, Postgres, Metamask, Test Ethereum networks.
goals: >
  <p>The traditional art market is an industry with a huge potential and capitalization of $67.4 billion in sales in 2018. Traditionally, buyers acquire art items for holding them and re-selling in the future. Our Client decided to use a well-known mechanism when every buyer could profit and increase the assets value by simply holding them. Cherry-picking the platform allowed to sell one’s assets on other platforms and use the digital verification system to confirm the owner of the original art.</p>
goalsItem:
  - text: Transparency of transactions
  - text: No 3rd participants involved
  - text: User friendly UI
  - text: Collectible digital artwork
  - text: ERC-721 standard
cases: [
  "Distributed Network and Blockchain Development",
  "Fintech Software",
  "Building and Managing Development Team"
]
tags: [
  "Fintech",
  "Digital Assets",
  "ERC-721",
  "Blockchain",
  "Project Management"
]
---

The product was a platform for artists and collectors with a friendly, use-to-use interface without hidden fees aiming to benefits artists. Historically, in order to sell digital artwork, one needs to go through the uneasy workflow of registration and legalization of your artwork. That also includes giving your work to the third party and paying massive fees. With our client’s platform, one can own a rare and collectible digital artwork, and deal with it without any third-party mediator. The platform is built on a proven blockchain technology.

## Challenges

Decentralized networks, blockchain, and Ethereum, in particular, is still a new marketplace to work with. In fact, in mid-2018, at the time when we started to work with the project, an Ethereum tooling was still clumsy. The main challenge was how to provide smooth service for regular users who don’t know anything about blockchain and simply want to buy art products, keep them and re-sell later. How to make the process of buying art as simple as doing regular purchases with your credit card? How to gain trust of potential clients and build the credibility of your platform, prove that it is reliable? How to handle a massive amount of transactions when one hits blockchain limitations? There are the questions we asked ourselves as we worked on this project.

## Solution

First, we conducted a profound research of existing technologies and came up with a detailed plan for the user interface, frontend and backend development, services infrastructure, and testing requirements. For an every step, we outlined which technologies or service providers we can use right now and those which needs to be customized for our needs. Furthermore, we included user education as an integral part of the project. We were looking for a simple way of explaining how blockchain works to gain more attendance and platform trust. After we reached a critical number of users, we came close to the blockchain input/output operations limits. One of the challenges we had to face is that blockchain has a significant delay in writing and updating data, but we updated it in a batch. Our solution was to create a local cache that has almost no delay and once per 10 seconds we synchronized platform cache with a global Ethereum ledger.

## Results

During the boom or cryptocurrencies, the platform was able to attract both art creators and collectors. In the pre-launch environment, the platform received good reviews from visitors. During benchmark tests, it was able to handle up to 100 requests per second.

## Project architecture

### Admin Panel

The administration panel is the main hub that connects all pieces.

![](/images/cases/img-1.png)

The original idea of the admin panel is to give an ability to non-technical people to interact with the Ethereum network (issue new card-contracts) without knowing how it works. Admin panel does not interact with the Ethereum network by itself, but stores data in the Postgres. And Postgres triggers Golang which deploys the contract to the Ethereum network.

### Frontend

The frontend was a part of the project which consumed a plenty of time and required additional efforts.

![](/images/cases/img-1.png)

We've decided to use Vue.js because it is simple to learn, straight forward, and has everything for convenient frontend development.

### Backend

We’ve decided to use microservice architecture for scalability and flexibility

![](/images/cases/img-2.png)