---
title: "Smooth links transitions on dynamic content in Vuejs Application"
description: Usually links inside Vue.js app handle by vue-router and router-link component. It makes a transition between routes without reloading page. The smooth and slick user interface is one of the advantages of Single Page Applications. In the case with CMS content, links are inside content and can’t be processing separately but inserting as one HTML part with `v-html` directive. Such links on click will reload page even if they follow the same app page.
date: 2020-04-27
draft: false
authors: "Volodymyr Antoniuk"
image: /images/blog/16.jpg
tags: [
  "Vue",
  "Vuejs 2"
]
---

If there is CMS in site`s ecosystem, the app’s front-end may get content in markdown markup or plain HTML and, of course, this content can include links that following to other pages within the same app.

Usually links inside Vue.js app handle by vue-router and router-link component. It makes a transition between routes without reloading page. The smooth and slick user interface is one of the advantages of Single Page Applications. In the case with CMS content, links are inside content and can’t be processing separately but inserting as one HTML part with v-html directive. Such links on click will reload page even if they follow the same app page.
Let’s see what we can do with it in a Vue.js app.

The plan is:

- Get all links from rendered and inserted HTML.
- Replace onclick behavior to make a transition by vue-router.
- Mark links as already processed to avoid double processing

The easiest way to get a certain peace of ready HTML nodes and manage it in the Vue app is custom directive.

Let’s create some helper functions for the directive. We start from the end of the functions chain.

```
import router from '@/router'

function onLinkClick(e) {
 e.preventDefault();
 router.push({ path: e.target.getAttribute('href') });
}
```

Importing the app’s router, because it is required to push a new route.
On link click prevent default link behavior, get the path for a new router from link href attribute, and push it to the router

Now let’s create a function that gets an array of links, set proper onclick function, and mark as ready.

```
function setLinksOpenInHistoryMode(els = []) {
 els.forEach((link) => {
   if (link.hostname === window.location.hostname) {
     link.addEventListener('click', onLinkClick);
     link.setAttribute('data-ready', '');
   }
 });
}
```

By condition `link.hostname === window.location.hostname` each link are checking if it follow to the current site. If not, there is nothing to change for links like that.

Another function is to get all links from node where directive binded

```
function getLinks(el) {
  const selector = 'a:not([data-ready]):not([target="_blank"])';
  return el.querySelectorAll(selector)
}
```

The selector includes all `a` nodes but excluded already processed ones and links which are open in a new tab.

The last one is like an entry function and will be calling in each needed directive hooks.

```
function handler(el) {
  setTimout(() => {
    const links = getLinks(el);
    setLinksOpenInHistoryMode(links);
  });
}
```

setTimeout here is to be sure, that all nodes are mounted and all links are ready.

In some cases, when you don’t want to interrupt a user in some important process, it would be better to open all links in new tab. For such situations would be good to use a modifier and handle it in directive’s code.

So, we don’t need another onClick function, because the browser already can handle it but to add a few attributes to link nodes required.

```
function setLinksOpenInNewTab(els = []) {
 els.forEach((link) => {
   link.setAttribute('target', '_blank');
   link.setAttribute('rel', 'noopener noreferrer');
   link.setAttribute('data-ready', '');
 });
}
```

Attribute `target=”_blank”` do all main works.<br>
As we open all links in a new tab, and some of them can be external links, it would be good to add `rel=”noopener noreferrer”` in terms of security. You can read more here about this.<br>
And one more 'data-ready' to mark a link as already processed.

Also, small changes in handler function required to call the proper function depending on the modifier

```
function handler(el, modifiers) {
  setTimout(() => {
    const links = getLinks(el);
    if (modifiers.new) {
      setLinksOpenInNewTab(links)
    } else {
      setLinksOpenInHistoryMode(links);
    }
  });
}
```

And at last but not at least, directive’s body:

```
export default {
 bind(el, binding) {
   handler(el, binding.modifiers);
 },
 componentUpdated(el, binding) {
   handler(el, binding.modifiers);
 },
};
```

The directive calls handler to transform links on the first bind and when content is updated. Handler calling with an element, to which directive bound, and modifiers, from binding parameters, as arguments.

Now directive is ready to be registered in the app,

```
...
import Vue from 'vue';
import improve-links-directive from './improve-links.js`

Vue.directive('improve-links', improve-links-directive);
```

…using it on element to open links in history mode, ...<br>
`<div v-html="cmsContent" v-improve-links>`

… or in a new tab<br>
`<div v-html="cmsContent" v-improve-links.new>`

As a summary here is all code of custom directive that improves links from CMS content.

```
import router from '@/router'

function onLinkClick(e) {
 e.preventDefault();
 router.push({ path: e.target.getAttribute('href') });
}

function setLinksOpenInHistoryMode(els = []) {
 els.forEach((link) => {
   if (link.hostname === window.location.hostname) {
     link.addEventListener('click', onLinkClick);
     link.setAttribute('data-ready', '');
   }
 });
}

function setLinksOpenInNewTab(els = []) {
 els.forEach((link) => {
   link.setAttribute('target', '_blank');
   link.setAttribute('rel', 'noopener noreferrer');
   link.setAttribute('data-ready', '');
 });
}

function getLinks(el) {
  const selector = 'a:not([data-ready]):not([target="_blank"])';
  return el.querySelectorAll(selector)
}

function handler(el, modifiers) {
  setTimout(() => {
    const links = getLinks(el);
    if (modifiers.new) {
      setLinksOpenInNewTab(links)
    } else {
      setLinksOpenInHistoryMode(links);
    }
  });
}

export default {
 bind(el, binding) {
   handler(el, binding.modifiers);
 },
 componentUpdated(el, binding) {
   handler(el, binding.modifiers);
 },
};
```