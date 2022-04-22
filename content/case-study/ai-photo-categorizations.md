---
date: 2020-04-06
draft: false
title: "AI for photo categorizations"
subTitle: AI/ML Software, E-commerce
textIntro: >
  The client daily updates nearly 10 000 positions in the e-commerce store. 
  Goods originate from different vendors in different formats. Website administrators 
  spend a substantial amount of time to parse and categorize vendor files. The task was 
  to enhance the administrator panel UX by implementing noise-resistant automatic 
  categorization and simplification of goods accounting. This was expected to allow 
  for the reduction of expenses and providing a clear competitive advantage. 
  Another task was to develop a reliable price prediction for new products.
description: >
  The client daily updates about 10 000 positions on the e-commerce store. Goods comes from different vendors in different formats. Website administrators spend a substantial amount of time needed to parse and categorize vendor files. Enhance the administrator panel UX by implementing noise-resistant automatic categorization and simplification of goods accounting would allow to reduce expenses and gives some competitive advantages.
casesItems:
  - label: Expertise
    text: AI/ML Software, E-commerce
  - label: Deliverables
    text: Research and Development
  - label: Tech stack
    text: >
      Tensorflow, TensorFlow Hub, <a href="/tags/python">Python</a>, Keras, Google Colab, Google Drive, Django
goals: >
  <p>The client collected around 150 000 images of goods with proper labels over the number of years. As a result, an extensive database divided into the training and validation sets was created. First of all, we examined existing computer vision solutions for classifying objects by photos. With the client training set, we have improved the object detection and classification algorithm to be noise-resistant to images with more than one object. Our team built a clustering algorithm based on the knowledge and specifics of the customer’s categorization hierarchy. Additionally, we implemented an algorithm persistent to changes in images quality, lighting and visual angle. The category detection pipeline was completely automated and was removed from the manual categorization workflow.</p>
cases: [
  "Ai Ml Development",
  "E Commerce Software"
]
tags: [
  "Computer Vision",
  "AI/ML Technologies",
  "AI Software",
  "E-commerce",
  "Machine Learning"
]
---

## Solution

We were not able to use a popular image recognition datasets include CIFAR, ImageNet, COCO and Open Images as these datasets are rather applicable in academic research contexts, then for the client’s products images. As such, we decided to be careful when generalizing models trained on them. We used google drive as an intermediate storage for all existing 150 000 images. Originally we used an [inception_v3/feature_vector](https://tfhub.dev/google/tf2-preview/inception_v3/feature_vector/4) tensorflow model without the top classification layer. The latter helped us to transfer learning and increase an accuracy by training model using existing images and product labels. We also rented a google colab, which offers free GPUs to train the model faster. As a final step we exported a new model with building an API around. This, in turn, enabled us to connect it to the web application.

## Results

Our client moved to the AI workflow for goods categorization and price prediction. The categorization algorithm was able to identify the correct category in 95% cases. While there was a lot of space for improvement, we learnt many useful insights. The main definition of success was that the e-commerce store administration staff began to spend less time on goods accounting and was able to concentrate on the interaction with customers and selling process.