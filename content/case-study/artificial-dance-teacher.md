---
date: 2020-04-06
draft: false
title: "Artificial dance teacher"
subTitle: AI/ML Software, Internet of Things (IOT)
textIntro: >
  Our Client is an owner of a large network of entertainment facilities where gym services and other activities for customers are provided. The client decided to explore new lines of business and offered services for people who cannot visit gym regularly as his fitness segment was growing steadily.
description: >
  The Client has a big chain of entertainment facilities. They provide a lot of gym services and offer different activities and for their customers. Being successful in fitness business, the client decides to explore new areas and offer services for people who cannot visit their gyms regularly.
casesItems:
  - label: Expertise
    text: AI/ML Software, Internet of things
  - label: Deliverables
    text: Research, Strategy and Development
  - label: Tech stack
    text: >
      Google Cloud, Python 3, Facebook VideoPose3D, google storage, data flow, flutter
goals: >
  <p>Client’s marketing team proposed opportunities on how they can keep customers who do not visit them regularly for various personal reasons. Many customers complained that they cannot allocate time but still want to do physical activities. Especiallyf or those who need to commute for 20-30 minutes, it does not make a lot of sense to travel for a 60-minute exercise. Additional challenge was to reach out to the new target group who prefer not to visit gyms at all. The company decided to create an artificial intelligence dance teacher to allow customers exercise at home.</p>
goalsItem:
  - text: Explore and Research
  - text: 3D post estimation
  - text: Fast response
  - text: Semi-supervised training
stepItems:
  - label: Step 1
    items:
      - title: Team foundation
        duration: 5 weeks
        text: "Team: Lead ML Engineer, Lead FullStack Engineer, Data science, 
          Frontend Engineer, Backend Engineer, DevOps, Mobile engineer"
  
  - label: Step 2
    items:
      - title: Research and analyze
        duration: 4 weeks
        text: Researching and analyzing existing solutions. We created a 
          check list with a diverse range of important criteria; we 
          tested each solution to align with our requirements.
  
  - label: Step 3
    items:
      - title: Data collection problem
        duration: 4 weeks
        text: Once we found a number of appropriate solutions, we decided to run specific tests. 
          However, we did not have enough testing and validation data. Our engineers estimated 
          that initial solution will require nearly 400 videos to train system to recognize 
          different drawbacks and problems during workouts. Shooting videos is a cumbersome 
          and complex task. We found out that we can use unity to simulate videos with general 
          problems during workouts. It was much cheaper and quicker approach as compared to 
          shooting and reshooting real videos.

  - label: Step 4
    items:
      - title: Implementation stage
        duration: 8 weeks
        text: Once all training data was prepared we started to implement the backend service, mobile and web applications.
  
  - label: Step 5
    items:
      - title: Collecting feedback
        duration: 2 weeks
        text: The client an a demo version and provided access for the application 
          for the limited number of guests. Out team closely monitored user 
          interactions with an application and collected features and 
          bug reports for future improvements.
cases: [
  "Cto as a Service",
  "Ai Ml Development",
  "Building and Managing Development Team"
]
tags: [
  "Computer Vision",
  "AI/ML Technologies",
  "CTO as a service",
  "Project Management",
  "Machine Learning"
]
---

## Challenges

There is a plenty of pose detection open source solutions like TensorFlow pose estimations or posest available for the software community. The key obstacle is that solutions are optimized for general use cases. Using such an open-source model in your business will, most likely, give you a lot of false-positive or true-negative results. The challenge that we tried to tackle is that our team aimed at not simply understanding the user position, but to analyzing whether the user pose reflects a trainer pose. Every person has one’s own parameters such as height, sex and flexibility. Consequently, something that might be an incorrect position for one person, can perfectly be acceptable for the other. For the purposes of this project, merely a 2D pose reconstruction was not enough to detect what the user is doing wrong. For example, we wanted to detect if the user slightly bends over his back when he/she does not need to. Another challenge was the requirement to analyze life videos in addition to pictures. This was helpful under the scenario that various people exercise at a different speed and if the trainer dances faster than you, it does not mean you are doing something wrong.

## Solutions

In order to be successful, we decided to move gradually with slow interactions. At first, we tried already existing pose-estimation solutions to find out what we can use and what limitations and problems we might face. After working with different data sets and models, like COCO, Leeds Sports Poses, MPII Human Pose, prebuild solutions on TenserFlow and OpenCV pose estimations we decided to move forward with a solution from Facebook VideoPose3D. Its pre-trained model is based on the Human 3.6M dataset. The strong side of that solution is the ability to analyze video with temporal convolutions and semi-supervised training. We also experimented with few cameras, camera positions and angles to get aggregate useful data. The 3D view provided the ability to use such techniques as User body segmentation to address the round back issues. Later we added dynamic time wrapping and anomaly detection to build a correlation between user and trainer speed. Our client created nearly 250 videos in order to build accurate training and validation sets. We also set up a product infrastructure on google cloud as part of our service.
Shooting videos is a cumbersome and complex task. We found out that we can use unity to simulate videos with general problems during workouts. It was much cheaper and quicker approach as compared to shooting and reshooting real videos.

## Results

Potential users provided a positive feedback on the demos. Our client decided to focus on extending the machine learning network to understand more movements and has an ambitious goal to launch the product with a new mobile application next year. We, as a team, constantly work on new functionality and increasing our experience with pose estimation.

