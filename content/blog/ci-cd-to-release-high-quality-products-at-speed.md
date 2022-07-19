---
title: "CI/CD to release high-quality products at speed"
subTitle: "Many software companies today are using Continuous Integration and Continuous Delivery (CI/CD) to release high-quality products at speed"
description: "CI/CD to release high-quality products at speed"
date: 2022-07-19
draft: false
authors: "Vladyslav Tarasenko"
image: https://user-images.githubusercontent.com/704096/179827430-6759d4e3-d4e9-4145-8cbf-b2266d17575f.png
tags: [
  "DevOps",
  "CI/CD"
]
---

## Many software companies today are using Continuous Integration and Continuous Delivery (CI/CD) to release high-quality products at speed

Nowadays many companies about to use or already using Continuous Integration (CI) and Continuous Delivery (CD) to release high-quality products at speed. Stability and reliability of the platform is a foundation for any technical product or service. The CI/CD pipeline approach provide you more control over what should and what should not be deployed.  But building a CI/CD pipeline can be a challenge. But by using right  automation strategy and tools you can save a lot of time and resources.

If you work in the tech industry, in most cases the key to success is ability to adopt right technologies, the right approaches, ability to be effecting in day to day tasks. Smartphone manufacturing giant Nokia [lost significant market share as it failed to adapt to newer technology – Android](https://www.thomasnet.com/insights/7-companies-that-failed-to-adapt-to-disruption-and-paid-the-ultimate-price/).  

Most of you are probably familiar with the waterfall approach, a method in software development where you first develop, then test, then release. No processes overlap, and nothing happens in parallel. You start something and finish it before you go on to the next.

<img width="882" alt="Waterfall approach" src="https://user-images.githubusercontent.com/704096/179823261-edeadade-fa24-4cba-98ae-3946ab43fbe6.png">

Continuous Integration and Continuous Delivery (CI/CD) is a methodology borne out of the cultural shift that bridges the gap between Developers, Testers, and Operations via DevOps. The process emphasizes on developers continuously integrating their work, followed by testers testing it rigorously so that operations teams can release products and updates more often. 
CI/CD does accelerates release cycles, which increase ability to ship new functionality to customers on regular basic and accelerates to Time-To-Market delivery. Also, correct CI/CD process contributes to building a more robust, resilient, and secure product.  

CI/CD is an automated chain where the idea is to involve as few human hands as possible, in order to avoid unnecessary manual work and error.
This doesn’t mean that humans aren’t involved in the process, of course. It just means that the chain should be able to run on its own, checking for errors and notifying testers and developers when something breaks or doesn’t merge so that they can make changes much quicker than they would have been able to in a waterfall approach.

## Phases of CI/CD 

Best CI/CD practice embodies Agile methodologies. Let’s have a quick overview of the major phases of CI/CD:

### Continuous Integration 
- Commit: The developer commits code regularly to the version control system.
- Build: The code is then built using suitable build tools to obtain an artifact. 
- Unit Test: The developer generally writes unit tests to test functionalities at ground level. These are run along with the build. 
- Deploy to Development Environment: The build is then deployed onto a common Development Environment where devs can test how their code works when combined with other developers’ code.  

<img width="772" alt="Deploy to" src="https://user-images.githubusercontent.com/704096/179824381-d2fe2de2-7b78-4b45-98e3-31bcd4165748.png">


### Continuous Delivery 
- Deploy to Testing Environment: Deployment to this environment happens once a development phase(sprint) is completed. The last successful build is deployed onto the Testing Environment. This environment will ideally be a mimic of the Production Environment. 
- Testing: QA teams run various automated tests like Integration testing, Regression testing, Load, and Performance testing. This ensures that the product developed at the end of each sprint is ready to be released to the market. 

<img width="764" alt="Pasted Graphic 2" src="https://user-images.githubusercontent.com/704096/179824693-5633ccbe-6e1b-42e8-909f-64898529e1a1.png">


### Continuous Deployment
- Deploy to Production Environment: Ideally, this happens at the end of the testing phase in each sprint. But companies have preferred to take this step based on business strategy and needs. 
- Continuous Monitoring: This involves monitoring the product’s performance, the underlying server status and ensuring the sanity and security of the Production Environment. 
- Rollback: This entails the ability to roll back to a previous stable version of the product in case of any unfortunate issues. 

<img width="760" alt="Pasted Graphic 3" src="https://user-images.githubusercontent.com/704096/179824993-075f9f93-0c55-44fb-9d06-e72439998d5e.png">


### Role of Automation Testing in CI/CD

In order to test functionality effectively we need to run tests on every build. From time and resource perspective its not possible manually to test every build. Automation enables meaningful and effective way to test new changes and usually auto tests are the core component on CI/CD pipeline. 
It gives an ability of an early bugs detection. And as result, the product that goes out to the release stage will be more accurate and bug-free. All this will only be possible with the automation of test suites.
 
In nutshell test automation offers the following pros:
- Reduces manual efforts when the same test must be run repetitively. This saves both time, resources and as result QA can be focused on more important tasks
- Gives almost immediate feedback. 
- Increases product stability and reality. As result you will be able to do updates more regularly. 

Bear in mind that automated tests in the CI/CD pipeline can use real browsers and devices. Don’t risk testing on emulators and simulators as you can miss some real issues and problems.


### How to build correct Automation Tests to fit in CI/CD pipelines? 
Its good to split tests on subtests and to have multiple automated test suites built for different purposes. Following are some testing types and where they fit into the CI/CD pipelines:
-  Unit Tests: Many teams follow the [Test Driven Development (TDD) approach](https://www.browserstack.com/guide/what-is-test-driven-development). Unit tests are written by the developers and run as a part of the build phase.
- Integration Tests: After every commit is built and deployed onto the development environment, these tests are run to check if the newly added module/changes work well together. Some organizations have a dedicated environment to run integration tests.
- Regression Tests: Regression tests are run once nightly to ensure that the newly added changes do not impact the existing code. This helps make sure the day’s work is all good and gives feedback if any changes are necessary.
- Performance and Load Tests: Before releasing the code to the production environment, a set of tests are run to evaluate the responsiveness and stability of the system. These tests are run on the UAT/Pre-Production environment after the code is deployed at the end of the sprint.
- Security Tests is a process intended to reveal flaws in the security mechanisms of an information system that protect data and maintain functionality as intended.
