title: "Simple short Best HTML Practice"
subTitle: "Best HTML Practice"
description: "Examples from my own experience with HTML practices"
date: 2022-08-14
draft: false
authors: "Ostap Lazoriak"
image: /images/blog/simple-short-best-html-practice.jpeg
tags: [
  "HTML",
  "Best Practice"
]

How often have you written something without realizing that the code you wrote might not be perfect?
This often happens to me and I strive to improve my practical skills. In the article, I will try to give examples from my own experience.
## Structural
```
<!DOCTYPE html>
  <html>
  <head>
  <body>
    <header></header>
    <section>
      <article></article>
      <article></article>
    </section>
    <section>
      <article></article>
      <article></article>
    </section>
    <footer></footer>
  </body>
</html>
```
Make sure correct use of the **HTML5** semantic elements. Use the **header** and **footer** elements to define the top and bottom of a page, but also can define the top and bottom of an article or section.
Use the **nav** element for major blocks of links to allow assistive technologies to quickly and easily navigate through the site. The **nav** element can be used around unordered lists, **ul**, or around a block of content referring to multiple links. You can use the **aria-label** property to identify different navigation areas.
Use the **main** tag to define the main content of the page and **aside** to define anything related to the main content.

**Use appropriate containers tags** (**div** vs **section** vs **article**) You will benefit a lot from understanding when to use Section vs Article vs Div in Html. Understanding when to use these tags has a great impact on your site and you should avoid using div tags everywhere. HTML5 is full of semantic tags.

**Don't put block tags inside inline tags** - Think of block tags as boxes and inline tags as envelopes. Don’t try to put boxes inside envelopes. Some browsers in some situations will remove the block tag from inside the inline tag breaking your markup. Block and inline tags are not to be confused with CSS display block and inline. In the eyes of HTML tags will always be inline or block regardless of their CSS display value.

**Validate your HTML** - Always validate your HTML to make sure it is valid markup. It prevents you from making dumb mistakes and with time you will learn enough to avoid these mistakes altogether. This can even be added to your build process to ensure your website does not get deployed with invalid markup.

## Content

Use the correct levels for headings, from the most important as an **h1** down through **h6** and do not skip heading levels. Each page should have a heading level 1, **h1**, that represents the most important idea on the page. Any sub-headings should be an **h2**, sub-sections can then be divided into **h3s** and on down to **h6** s based on the nested structure.
**Avoid SIBU tags** - The SIBU tags are **<s/>, <i/>, <b/>** and **<u/>** tags which are for style purposes only, they are not semantic tags at all and anything they do can be accomplished with CSS alone or other semantic tags. USE **<strong/>** instead of **<b/>**, **<em/>** instead of **<i/>**, `text-decoration: underline` instead of **<u/>**, `text-decoration: line-through` instead of **<s/>**

Use an **alt** attribute on images if the image is important to the content, such as information to understanding or interacting with something. Otherwise, if an image is decorative and adds no value to the content, the attribute can be declared **alt=""** and it will not be read by assistive technologies.

## Images
**Don't use the IMG tag for non-content imagery** - You should learn when to use HTML image tag vs CSS background image as soon as possible. A common mistake you may find out there is developers using the image tag to include non-content imagery like icons. If the image does not help the content make sense it should not be an image tag and a simple test is by looking at the content without the image. If it makes sense then the image is decorative.
**Lazy load images** - Some browsers will load the images only if they are in the view that way if you have a page with 100 images, only those within the viewport will be loaded, and as the user scrolls the rest gets loaded accordingly. All you gotta do is specify the loading attribute with a value of lazy. There is also a polyfill if you want this feature in all browsers.
`<img src="image.jpg" alt="..." loading=«lazy">`
**Optimization:** High All images are optimized to be rendered in the browser. TinyPNG losslessly optimises png, apng (animated png) and jpg images. Free and paid version available. 

## Webfonts
 - google-webfonts-helper for localStore https://google-webfonts-helper.herokuapp.com/fonts
 - Google Technical considerations about webfonts
 - Webfont size: High Webfont sizes don't exceed 2 MB (all variants included).
 - Webfont format: High WOFF, WOFF2 and TTF are supported by all modern browsers.
 - Using `<link rel="preload">` will trigger a request for the WebFont early in the critical rendering path, without having to wait for the CSSOM to be created.

## SEO

Use the anchor, **a**, tag for links that go somewhere else and the button tag for an action like submitting a form or a click event.
**Canonical url Helps prevent duplicate content issues:**
`<link rel="canonical" href="http://example.com/2017/09/a-new-article-to-read.html">`
**sitemap.xml:** High A sitemap.xml exists and was submitted to Google Search Console (previously Google Webmaster Tools).
**robots.txt:** High The robots.txt is not blocking webpages.
**Structured Data:** High Pages using structured data are tested and are without errors. Structured data helps crawlers understand the content in the current page. Complete list of vocabularies that can be used as structured data. Schema.org Full Hierarchy
**Noopener:** Medium In case you are using external links with `target="_blank"`, your link should have a `rel="noopener"` attribute to prevent tab nabbing. If you need to support older versions of Firefox, use `rel="noopener noreferrer"`.

## CSS Methodologies

- **OOCSS** stands for Object Oriented CSS, so it's best understood in the context of Object Oriented programming.
- **BEM** is a specific concrete application of OOCSS. BEM stands for Block Element Modifier, and it describes the pattern of each CSS object's class name.
- **SMACSS** stands for Scalable and Modular Architecture for CSS. It's a book and a methodology for writing CSS (created by Jonathan Snook), but its most significant and influential aspect is its organizational system, which is designed to provide a set of buckets into which CSS should be organized.

### Most of important is Class naming from BEM:
**Block** - Independent components that can be reused
```
<div class="card">
  <img src="...">
  <h2>...</h2>
  <p>...</p>
  <a>...</a>
</div>
```
**Elements** - The ‘children’ of blocks, used exclusively within their parent block
```
<div class="card">
  <img class="card__img" src="...">
  <h2 class="card__title">...</h2>
  <p class="card__description">...</p>
  <a class="card__button">...</a>
</div>
```
**Modifiers** - Used for variations in style of blocks or elements
```
<div class="card card--dark">
  <img src="...">
  <h2 class="card__title card__title--large">
  ...
  </h2>
  <p>...</p>
  <a>...</a>
</div>
```

## Cheat sheets
[Key concepts](https://en.bem.info/methodology/key-concepts/)
[Block modification](https://en.bem.info/methodology/block-modification/)
[BEM CHEAT SHEET](https://9elements.com/bem-cheat-sheet/)
[HTML semantics cheat sheet](https://learn-the-web.algonquindesign.ca/topics/html-semantics-cheat-sheet/)

## Resources for tests
[Performance/Best Practices/SEO/Accessibility](https://web.dev/measure/)
[Website Page Analysis](https://tools.pingdom.com/)
[WebPageTest](https://www.webpagetest.org/)
[Wave testing](https://wave.webaim.org/)
[W3C validator](https://validator.w3.org/)
[W3C Link Checker](https://validator.w3.org/checklink)
[CSS Validator](https://jigsaw.w3.org/css-validator/)

## Additional Resources
[Front End Checklist](https://github.com/thedaviddias/Front-End-Checklist)
[html best practices](https://github.com/hail2u/html-best-practices)
[Top Free Website Speed Test Tools](https://www.keycdn.com/blog/website-speed-test-tools)
[Fast load times](https://web.dev/fast/#prioritize-resources)
