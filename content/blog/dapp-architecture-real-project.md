---
title: "Dapp Architecture At Real Project"
subTitle: The real experience of the blockchain-based business launching.
description: >
  Blockchain brings us new business opportunities, can help to reduce operating costs and to avoid some regulation limitations. But at the same moment, it puts a lot of tech complexity.
date: 2019-04-23
draft: false
authors: "Vlad Tarasenko"
image: /images/blog/27.jpg
tags: [
  "Ethereum",
  "Google Cloud Platform",
  "GCP",
  "Architecture"
]
---

Recently we have a pretty interesting discussion in Starfish Mission coworking space about what do you need for the blockchain-based business launching.

First of all, blockchain does solve a lot of trust issues and in some cases works much better than traditional payment solutions. But it also brings new problems and new technical challenges. And keep in mind - your old questions do not go anyway.

Blockchain brings us new business opportunities, can help to reduce operating costs and to avoid some regulation limitations. But at the same moment, it puts a lot of tech complexity. Below I provide a general list of the all key directions we took to build the blockchain-based Curio Cards project.

## Private Network

If you consider your project as a long term one, first of all, you should think about:

- Testing. How to test your solution correctly?
- Speed. How you can create MVP fast enough, but still make it reliable?
- Abstraction. How to work comfortably without relying on any other solutions?

By using your network, you will get:

- Free ethereum, enough for making 10-20 tests daily.
- Doing tests regularly - helps you to keep your project bugs-free and open to code refactoring.
- While the test and Robsten networks may have some outrages, your private network is pretty stable. You don’t have any problem with getting new ethereums because you can mine them pretty quickly.

## Admin Panel

The administration panel is the main hub that connects all pieces.

![post image](/images/blog/post-img-23.png)

The original idea of the admin panel is to give an ability to the non-technical people to interact with the ethereum network (issue new card-contracts) without knowing how it works.

Admin panel does not interact with the ethereum network by itself but stores data in the Postgres. And Postgres triggers Golang which deploys the contract to the ethereum network.

## Frontend

The frontend is another part of the project which consumes a lot of time and usually requires additional efforts.

![post image](/images/blog/post-img-24.png)

We've decided to use Vue.js because it is simple to learn, straight forward, and has everything for convenient frontend development.

## Backend

To be scalable and flexible, we’ve decided to use microservice architecture.

![post image](/images/blog/post-img-25.png)

List of the services which we will discuss in the future:

- Admin panel - python
- Content management system - python
- Contract deployer - golang
- Ethereum scanner - golang

## Solidity Contract

Solidity is not so bad, and it’s not so hard to use it in production.

![post image](/images/blog/post-img-26.png)

And definitely, we will discuss Curio Cards contract in the future and will try to build our own.

Stay connected!