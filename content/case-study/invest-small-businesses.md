---
date: 2022-03-31T16:08:41+03:00
draft: false
title: "Invest in small businesses"
subTitle: Fintech software, Financial Services, Crowdfunding
description: >
  <p>Our client (investment company) decided to run a crowdfunding platform with a focus on 
  small businesses after a long record of working with hedge funds, 
  credit unions, and due diligence companies.</p>
  <p>The main goal was to help local businesses grow and get enough funds to expand and enter new markets. 
  Likewise, the client aimed to build a secure and easy-to-use system for non-accredited investors.</p>
casesItems:
  - label: Expertise
    text: Fintech software, Financial Services, Crowdfunding
  - label: Deliverables
    text: Strategy, Development, Maintenance
  - label: Tech stack
    text: >
      AWS and related services: SQL, Route 53, Elasticbean, lambda functions, 
      CiCircle, <a href="/tags/python">Python</a>, Golang, Backbone, Bootstrap, 
      Postgres, <a href="/tags/aiohttp">Aiohttp</a>
goals: >
  <p>Two primary goals of the client were as follows. The first was to provide a way for small businesses to present themselves and reach out to potential customers interested in their products. And the second goal was to build features for business owners so that they can effectively raise funds to satisfy their companies’ needs. Additionally, the company intended to provide educational material and educate potential customers. Apart from the tasks listed above, we were requested to create a simple and transparent system to show investors all relevant legal information, business description, product goals, and growth expectations of the company they can invest.</p>
goalsItem:
  - text: Open opportunities
  - text: Easy funding
  - text: Training materials
  - text: Reg CF
    tooltipText: >
      Regulation CF for equity crowdfunding by the U.S. Security Exchange Commission.
      Open to accredited and non-accredited investors
      Limited marketing capabilities
      Mandatory investment holding period
      Specific investment limits based on income or net worth
  - text: Safe investment
stepItems:
  - label: Step 1
    items:
      - title: Team foundation
        duration: 5 weeks
        text: "Team: Lead Engineer, Designer, Fullstack Engineer"
  
  - label: STEP 2&3 (PARALLEL WORKFLOW)
    inner: true
    items:
      - title: Initial legal framework development
        duration: 18 weeks
        text: At the time when the project started, the law around Reg CF 
          was not clear and the client spent a lot of resources to build reliable legal workflows.
      
      - title: Prototype Launch
        duration: 10 weeks
        text: The main focus on this big milestone is approval from FINRA 
          and receiving all required licenses to operate.
  
  - label: Step 4
    items:
      - title: FINRA review
        duration: 2 weeks
        text: We primarily were focused on quality assurance and communicating with the legal team.

  - label: STEP 5&6 (PARALLEL WORKFLOW)
    inner: true
    items:
      - title: Architecture update
        duration: 4 weeks
        text: The client entered into the partnership with credit unions and 
          launched white-label platforms for them. That resulted in extra efforts 
          for us to re-design the architecture for the project.
      
      - title: Team ramp-up
        duration: 2 weeks
        text: "Team: Lead Engineer, Designer, Two Frontend Engineers, 
          Backend Engineer, DevOps, Quality Assurance. We proposed to use 
          the microservice architecture in order to have 10+ white 
          label solutions with custom functionality."
  
  - label: Step 7
    items:
      - title: MVP Launch
        duration: 6 weeks
        text: Demo of our platform to investors, friends, family members, 
          and first users. The primary goal is to get real feedback 
          from company owners and potential investors.
  
  - label: STEP 8&9 (PARALLEL WORKFLOW)
    inner: true
    items:
      - title: Legal workflow updates
        duration: 10 weeks
        text: We identified needs for improvement from the real users’ perspective. 
          In order to fix the inconveniences, we needed to elaborate more 
          on the design, UI, and UX which were based on the initial legal framework.
      
      - title: Product Launch
        duration: 12 weeks
        text: Publicly launched platform. Press releases on TechCrunch, 
          Business Insider, and other popular websites were published, 
          advertisements placed and more users received.
cases: [
  "Cto as a Service",
  "Fintech Software",
  "Building and Managing Development Team"
]
tags: [
  "Fintech",
  "CTO as a service",
  "Crowdfunding platforms"
]
---

Unlike many other investment companies, the client wanted to make a focus on funds security and transparency. The client intended to build a system in which all possessions of any funds from investors and all committed capital was held in the third-party FDIC insured FBO account.

![](/images/cases/img-3.svg)

Once an investment company reached its minimum fundraising target, capital was transferred from the third-party FDIC insured FBO account to the investment company. Afterward, the company issued purchased securities to each of the investors.

![](/images/cases/img-4.svg)

If a company would fail to reach its minimum goal, all commitments were returned from the third-party FDIC account to the investor. The product did not include any hidden fees or accrued interest.

![](/images/cases/img-5.svg)

## Challenges

It is natural that for every startup everything starts with big challenges and it’s crucial solving them correctly within the given amount of time. Before starting with any software development, we had to coordinate our working plan with the legal team to receive correct legal requirements and limitations.

#### Legal

In 2016 Obama signed a JOBS Act. His speech during the law’s crowdfunding provision:

```
This bill is a potential game-changer. Right now, you can only turn to 
a limited group of investors - including banks and wealthy 
individuals - to get funding. Because of this bill, start-ups and small 
business will now have access to a big, new pool of potential 
investors - namely, the American people. For the first time, ordinary 
Americans will be able to go online and invest in entrepreneurs that 
they believe in.
```

Although it was really a game-changer, there were no legal frameworks around the law by the time we started a project. We had to be flexible enough so that we can tweak the development process once lawyers provide detailed information.

#### Security

Dealing with funds always requires high-security standards. In addition to all technical security best practices, we provided consultations to clients’ employees and contractors. We set up a secure email service, discussed how to avoid social engineers’ hacks, how to keep sensitive data, and provide an additional layer of network security in the company office. The next step was to provide security for the investor funds and create protection from unfair businesses. From the technical side, we integrated escrow accounts and used additional third-party providers to secure investor funds. In addition, to protect investors, we developed software to help the company to complete the due diligence before listing the business on the platform

#### Funds limitation

The client raised an angel round and we had to hit important milestones in order to close seed and then series A rounds. At first, we provided a fully remote team which helped to raise a seed round. After the seed round, we were able to find local talents that fit the client’s goals and can increase the development process.

## Solution

In 3 months we were able to provide a fully working MVP product. Fully working MVP gave a lot of trust for investors and also provided general feedback for the idea and values of the company. Having an MVP in place helped us to improve the product and business processes. Gradually, we built technical solutions ready for the public release which were fully focused on investors’ features and company owners’ requests. The platform was good enough so that the client managed the partnership with multiple credit unions and provided them a white label solution of the platform we created. Among these credit unions were such that had more than 2 million users and this forced us to do extra work for the platform optimization.

## Results

During the first year, the client was able to list 54 different companies and raised more than $1.2 million to help local U.S.-based businesses to grow.