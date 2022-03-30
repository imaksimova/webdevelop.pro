---
title: "Advanced Online Payment Security: Threats and Maintenance"
subTitle: Numerous approaches to exploit website’s resources in order to make benefits
description: In this article, we are going to discuss the most common and ruthless Advanced Online Payment Security threats and how to fight them or at least maintain an environment that is less likely to be exploited.
date: 2020-06-02
draft: false
authors: "Vlad Tarasenko"
image: /images/blog/8.jpg
tags: [
  "Fintech",
  "Network Security"
]
---

Wondering what all the huge corporations using big data have in common? The answer is rather simple - security vulnerabilities.

We strive to believe that the sensitive information is bulletproof towards a data breach or any other form of fraudulent activity when it is under legitimate protection.

In this article, we are going to discuss the most common and ruthless Advanced Online Payment Security threats and how to fight them or at least maintain an environment that is less likely to be exploited.

## Magecart Attack

One of the numerous approaches to exploit website’s resources in order to make benefits is called a Magecart Attack.

The name Magecart stands for an overgrowing group of cybercriminals divided into seven subgroups who specialize on attacks involving unauthorized collection of credit card info from online payment forms.

The logic behind the scene is embedding a malicious JavaScript code to “skim” the sensitive information from a consumer on the checkout page.

The overall process consists of 3 major steps:

#### Gaining Access

The criminal either getting access to the website through its infrastructure (or the server) and set the skimming code there, or use the 3rd party vendors to do so who are usually much easier target than the main domain.

#### Skimming

The skimming is done by a JavaScript that listens to the keyboard inputs on a specific form on a page (e.g. Credit Card number or CVV fields, password section, etc.) and saves it for the next step.
The skimming code is always integrated and obscured in the more trustworthy code to avoid quick disclosure.

#### Transferring

When fraudsters managed to fulfil two previous steps – the battle is most likely lost. The information of the end user collected on the second step is getting transferred to whatever location on the internet and can be used in any way possible.
Among eminent examples of Magecart attack such cases as British Airways in 2018 with half a million credit card numbers stolen and Ticketmaster UK also in 2018 with 40.000 account information stolen can be highlighted.

#### How to stop

- **Zero-trust approach** – the simplest way to be protected from Magecart attack is obviously to prevent it on the first stage. A zero-trust approach by a JavaScript to block any sensitive information from keyboard inputs and cookies by default is a good start. From there, you allow only a set of trusted scripts to run with an exclusive access to the private info entered on the page. Now, even if the skimming code was successfully integrated, it can no longer interact with the sensitive data.
Unfortunately, as the regular internet browser does not have such functionality, it is strongly recommended to develop your own scripts or use a 3rd party services who are capable of securing against this type of fraud.

- **Real-time webpage monitoring** – the 24/7 observation of activities on the website may be one of the most effective strategies to fight Magecart attacks. Most of the time, both merchant and a buyer are unaware of the threat they are in. Therefore, being able to notice any fraudulent attempts to insert a malicious code and react in real-time is what makes this approach so effective.

- **Content Security Policy (CSP)** – CPS allows the administrator to set a specific whitelist of domains that will be a valid source of data to be loaded from. By doing so, you ensure that only JavaScripts from trusted resources are executed within your environment. However, keep in mind that despite the fact that this contributes to system's security pretty effectively, it creates a few additional challenges as CSP suffers from certain limitations such as substantial configuration and maintenance and it does not guarantee that the data breach or infection will not happen from a whitelisted domain.

## Card Not Present (CNP) Fraud

Online shopping has been around since 1979, but in the past few years due to the rapid development of technology, it is predicted to hit 22% of global retail sales (29 trillion USD) by year 2023. Therefore, it is quite obvious why it became such a purposeful target for cybercriminals.
For instance, the majority of transactions in E-commerce do not require the presence of the physical card to be initiated. Fraudsters use this as a convenient opportunity to use the previously stolen data, as their real identity not necessarily has to be exposed. Also, because both seller and a cardholder are not present during the financial operation, it is challenging to validate the legitimacy of the transaction.

There are numerous approaches to CNP fraud.

#### Scheduled payments

Unfortunately, by far not every buyer pays close attention to their expenses. Knowing this, the defrauder schedules a relatively small payment that most likely will be noticed only after a several months if ever. The transactions are often masked as some kind of a monthly subscription service, or, for instance, insurance payment. The more victim’s information is available for the thief, the more lookalike behavior can be imitated.

#### Gift Cards

Gift Cards nowadays are getting more and more involved into CNP frauds. They can be easily transferable from account to account. They are pretty much risk free in terms of identity disclosure, and they can be sold for real money for up to 60% of their initial value.

#### Cryptocurrency

As an alternative to regular payments, the cryptocurrency, when converted to traditional money, is used to process a fraudulent transaction and leaves no digital trails to be further used in the investigation.

#### Ways to deal with:

- **3-D Secure 2.0** – a frictionless authentication process that does not require a cardholder to participate in the verification process between merchant and client’s issuing bank. Examples of utilizing the 3-D Secure 2.0 are Visa Secure, American Express SafeKey and MasterCard Identity Check.
- **Tokenization** – protection of sensitive data by creating an algorithmically generated numbers that replace real information with unique tokens. Tokenization is a common practice in online payment security strategies as its concept is rather simple, but highly efficient.
- **Biometric authentication** – usage of unique personal characteristics to identify the individual and grant an authorized access. The most common examples are fingerprints scanners, facial recognition and voice identification.

## Credit Card Cracking

The modern possibilities of an automated software allow bad actors to apply brute forcing strategies in order to gain unauthorized access to numerous online accounts of the victim.

Card Cracking is often mistaken with DDoS attacks as it processes thousands automatic requests per second while attempting to find correct credit card details.

Typically, attackers use relatively easy to get Private Account Number (PAN) along with the name of the cardholder to brute force the additional information needed to proceed with the scam. Bots that are focused on processing small transactions on numerous resources simultaneously (especially with weak security) are capable of cracking five credit cards each 20 seconds which scales up to 21.600 credit cards daily.

In the worst scenario, after some credit cards were confirmed valid by a criminal, your website may become a potential target for Account Takeovers, or Fraudulent Chargebacks due to a low level of security on your resource.

## How to protect

- **Monitor the activity of small orders** – small transactions are used to test the validity of the card and also its limits. Check the beyond-normal spices in graph to spot any unusual activity and stop it.
- **Behavior Analysis** – bots have their own behavior patterns that are distinct from human being. Utilize machine learning analysis and analyze as many data as possible to separate consumer’s activity from scammers card cracking.
- **Set up a blacklist** – once you began suspecting an individual in card cracking on your website, it is safer to add them to a blacklist, as they tend to commit crime repetitively.
As a universal solution against various types of fraud, big companies often utilize services of a 3rd party organization that specializes in digital protection. While there might be an overwhelming number of options, let us review a few and understand how they stay on guard of your online security.

#### Sift

In order to identify fraudulent activity, Sift uses 16,000 unique signals and machine learning to help seamlessly fight cybercriminals. By collecting and analyzing millions of security decisions monthly, they are capable of protecting the client at any stage of user interaction.
Sift is mainly focused on chargeback and promo abuse reduction (coupons, referrals, etc.), real-time transactional risk analysis, alternative payments security fulfillment (eWallets, cryptocurrency, bank transfers), and content integrity.

In the resent 2020 update, Sift managed to implement Continuous Score Calling – enchanted technology which ensures to accept only trusted transactions that passed multi-factor authentication. In addition, they have presented the Insult Monitor, which makes the satisfaction rate of the end-user a real measurable metric in terms of fraud protection which was never considered before.

**Trusted by:** Airbnb, Twitter, Kickstarter, Upwork, etc.

#### Zimperium

One of the leading representatives of mobile app and device security – Zimperium, offers powerful protocols for fighting and preventing IOS and Android threats such as MITM (Man in the middle) attacks, rogue software, operation system flaws, and phishing.

Their own on-device security engine – z9 is focused specifically on real-time protection powered by machine learning against uncommon threats towards the most popular mobile device platforms. Recently, z9 proved its efficiency by stopping all Day Zero attacks known to man as of yet.

**Trusted by:** Microsoft, T-Mobile, Blackberry, Telstra, VMware, etc.

#### Network security

Keep an eye on your network.

- Use strong authentication methods.
- Upgrade your software with latest security patch
- Physically secure equipment and ports
- Establish cyber security rules for your employees
- Explain importants of the network security for every employee
- Encrypt sensetive data
- Protect devices, including mobile phones, against viruses, spyware, and other malicious code
- Perform regular internal security audits and plan for improvements
- Define strong security rules for administrator accounts

Today, the online payment security systems should be more focused on working real-time and implementing automatic authorization technologies to fight and prevent fraud on any level while providing a friction-free and secure experience to the end-consumer.
Unfortunately, the Internet security and cybercriminals will always be in a never-ending race where one will try to outrun another. When the complexity of the protection grows, the hacking algorithms are growing alongside. Therefore, it is extremely important to keep your systems up to date and have a clear understanding and control over the current situation.
