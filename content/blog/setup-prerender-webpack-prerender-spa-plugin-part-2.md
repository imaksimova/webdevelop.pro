---
title: "Setup prerender on webpack with prerender-spa-plugin, Part 2"
description: Let say we have pages, which are not in the prerender routes list for some reason. For example, pages which are visible only for logged in users or ones that are not needed for crawlers, etc. For those pages, the server will return the prerender file for the home page, which is not good. We need to return the initial HTML file which is generated during the webpack build for such pages.
date: 2020-05-01
draft: false
authors: "Volodymyr Antoniuk"
image: /images/blog/13.jpg
tags: [
  "Vue",
  "Vuejs 2",
  "SPA"
]
---

In the [previous article](/blog/setup-prerender-webpack-prerender-spa-plugin-part-1) I described the initial setup for prerender-spa-plugin webpack plugin.
However, during setting up and complicating a prerender, there are various issues.
Some of them I would like to describe in this article

## Default index.html

Let say we have pages, which are not in the prerender routes list for some reason. For example, pages which are visible only for logged in users or ones that are not needed for crawlers, etc. For those pages, the server will return the prerender file for the home page, which is not good. We need to return the initial HTML file which is generated during the webpack build for such pages.
It can be resolved like this:<br>
Prerender for the home page stays in index.html file but initial HTML will be saved as i.html file and configures the server that it returns this file as a fallback in a case when there is no prerender for this route.

Here is the webpack settings:

```
const path = require('path');
const PrerenderSPAPlugin = require('prerender-spa-plugin');

module.exports = {
 chainWebpack: config => {
   config.plugin('html').tap(args => {
     args[0].filename = process.env.WEBPACK_DEV_SERVER ? 'index.html' : 'i.html';
     return args
   })
 },
 configureWebpack: {
   plugins: [
     new PrerenderSPAPlugin({
       indexPath: path.resolve('dist/i.html'),
       staticDir: path.resolve('dist'),
       routes: ['/', '/a', '/b'],
     }),
   ]
 }
};
```

Here is what's new in the configuration:
chainWebpack section changed HTML plugin to save main HTML file with i.html name (but not in webpack dev server mode)
In the prerender configuration, set the source of the initial HTML file as indexPath parameter

The webpack configuration is ready but the server settings need to be changed as well. Here is an example of a part of the express.js server configuration which solves this problem:

```
...
app.use(express.static('dist'));
app.get('/*', (req, res) => {
 res.sendFile(__dirname + '/dist/i.html');
});
...
```

## Google Tag Manager And All His Friends

If you use Google Tag Manager in your site, you can see double the tags issues in prerendered pages. This may be because GTM added tags during prerender and the second time when the user opens the prerendered page in his browser.<br>
To resolve this issue, we need to add more to the prerender configuration:

```
// ...
renderer: new PrerenderSPAPlugin.PuppeteerRenderer({
 injectProperty: '__prerender',
 inject: {},
})
// ...
```

Renderer option: set renderer the same as default (Puppeteer), but now we can change the settings.<br>
So we set injectProperty to inject properties inject (empty object for now in our case) to the global variable window. This injection can be used in JS code in any place to identify prerender.
Then add to tag GTM in HTML template in one line of code:

```
<!-- Google Tag Manager -->
<script>(
 function(w,d,s,l,i){
   if (window.__prerender) return; // <---- hey, relax, it’s prerender
   w[l]=w[l]||[];w[l].push({'gtm.start':
// ...
```

We can use skipThirdPartyRequests option, then all third-party requests will be blocked during prerender, but it is quite unreliable and can lead to unwanted results such as blocked requests to microservices, reject to fetch styles, or scripts.

## Async Components Scripts

Asynchronous components can significantly decrease the time it takes to open the first page because part of the code split from the main thread execution by detaching the components code from the main bundle to separated files. It is easy to implement but can produce additional issues for prerender.<br>
In my simple app, I implement dynamic component loading by simply changing one line<br>
`import PageHome from './components/PageHome';`<br>
… to ...<br>
`const PageHome = () => import(/* webpackChunkName: 'PageHome' */ './components/PageHome');`<br>
for all route components.

That is all that is needed to load the page component on demand.

```
// Comment webpackChunkName- needed to set name of the separated file
```

During prerender in the HTML DOM page, component files will be added as script tags. To avoid double parsing and running those files we need to delete it from prerender files.
For this, we can use the postProccess prerender plugin option. It should be a function that takes a prerendered page’s context with an HTML snapshot as a string.

```
...
postProcess(context) {
 const regEx = /<script.*?src="?\/js\/(?!chunk-vendors|app).*?<\/script>/;
 context.html = context.html.replace(regEx, '');
 return context;
}
...
```

Here we removed script tags except app and chunk-vendors by using regex and the replace method of string. Now the HTML files are more clear.

## Waiting For All Data

If your app gets some data from the server by AJAX request, you probably want to have this data in the prerender file. To make prerender wait for that, you can use the renderAfterDocumentEvent property.

```
...
renderer: new PrerenderSPAPlugin.PuppeteerRenderer({
 injectProperty: '__prerender',
 inject: {},
 renderAfterDocumentEvent: 'render-ready',
}),
...
```

Then you need to trigger that event somewhere in your app.<br>
`document.dispatchEvent(new Event('render-ready'))`<br>
It can be a page component’s mounted hook or somewhere in the router dependency manager - wherever in the app when all data and DOM are ready.

This article explains the basic setup webpack for using prerender-spa-plugin. There are more settings that you can check on github page to use for your needs.