---
date: 2022-03-31T16:08:25+03:00
draft: false
title: "Security data provider"
subTitle: Network Security, Sensitive Storage Provider
description: The client is a well-established tech company from the San Francisco Bay Area. 
  After closing a series A round, the client’s company was focused on growth, business expansion, 
  and feature development. The primary business goals were to achieve smooth integration with 
  the current development process and the ability to release new functionality fast and 
  without breaking any old functionality or APIs for existing clients.
cases:
  - label: Expertise
    text: Network Security, Sensitive Storage Provider
  - label: Deliverables
    text: Development, Testing, Documentation
  - label: Tech stack
    text: >
      AWS and related services: RDS, Elasticbeanstack, Private cloud, Python, Nodejs, Selenium, wireshark, OWASP.
goals: >
  <p>The company provides HIPAA compliant secure data storage, including security for sensitive information such as social security number, banks account data, credit card number, and other types of personal information. The company is usually acting as a proxy for other companies to store and retrieve customers’ private data in real-time. This is a way to remove all legal and jurisdiction pressure from one’s shoulders and completely avoid any liabilities of holding sensitive user data. Also, the product was built in a way to help leverage some of SEC regulation liabilities by providing a flexible full cycle of integrations for the for e-commerce and fintech platforms.</p>
goalsItem:
  - text: HIPAA compliant
  - text: Easy integration
  - text: Enhanced security
  - text: Highly protected storage

stepItems:
  - label: Step 1
    items:
      - title: Team foundation
        duration: 2 weeks
        text: "Team: Lead Engineer, UI/UX Designer, Frontend Engineer, Backend Engineer, DevOps"
  
  - label: Step 2
    items:
      - title: Integration process
        duration: 4 weeks
        text: Gathering information and analyzing current processes, researched existing workflows and fixing issues and bugs.
  
  - label: Step 3
    items:
      - title: Proposals to increase effectiveness
        duration: 2 weeks
        text: The stage of active discussions with the client and his team, 
          eliminating weak spots and finding the common ground with the existing team.

  - label: Step 4
    items:
      - title: Implementation stage
        duration: 10 weeks
        text: Gradual progress in exchanging experience, sharing knowledge and implementing our proposals.

tags: [
  "Fintech",
  "E-commerce",
  "Network Security"
]

---

## Challenges

The company already had a working product and it was important not to break anything inside their current APIs and their client’s interaction workflow. Even if certain existing features did not work properly, our task was to build features on top of the existing base. Additionally, the release process and communication turned out to be problematic. The release process was cumbersome and typically it used to take 2-5 months for the client to update the product. There was an in-house development team, settled processes and workflows. But due to the exponential growth, certain processes did not work properly and there was a lot of miscommunication between different teams. Thus, the challenge we had to take was optimization and even breaking old workflows in certain cases.

## Solution

At the starting phase, we were involved in gathering information about current workflows, identifying weak spots, and elaborating on the solutions to tackle them.
Another important step was to find a way to release an update at least monthly without breaking any old APIs and creating any problems for customers. Importantly, we were trying to fill in weak or empty spots in the client’s development process. During this process, we, as a company, became more knowledgeable about security cases, leveled up our understanding, and updated our best security practices.

## Cross Site Request Forgery

The client’s old system was designed without protection from CSRF. While working on new APIs we also kept an eye on the CSRF attack. CSRF attack is an attack that usually occurs when a malicious website, email or program causes a user to send an unwanted message on a trusted site. A traditional CSRF attack forces victim to send HTTP request, including session cookie or other authentication information to the company server.

For example, the company’s client user may receive a link that contains a hidden iframe with a function to reveal sensitive information to the 3rd party service. Once the user opens a link, user’s identity and other private information may be stolen. We implemented a Unique Request Tokens for every possible request from the 3rd party websites to eliminate the CSRF attack.

In general, our team learn a lot of advanced security approaches and updated our best security practices.

## Results

We helped the client to identify problems in API documentation which made integration cumbersome and unclear. We updated the design and frontend release process and reduced it from 3 months to 4 weeks by migrating away from the photoshop to new UI/UX software (Figma). We helped the client to detect existing problems in APIs and release new APIs without any breaking changes and without errors by creating automation tests.
