---
title: "Setup prerender on webpack with prerender-spa-plugin, Part 1"
description: "During developing SPA (Single Page Application) we met with a common SPA problem: although google crawler uses the last Chromium version to run JS and indexing results as HTML pages (it’s not so easy to make it work and there is still the Fix Search-related JavaScript problems list), but for other search systems and sharing in social networks SPA doesn’t work. They will get the default index.html with the default title, description, etc for all pages."
date: 2020-04-30
draft: false
authors: "Volodymyr Antoniuk"
image: /images/blog/14.jpg
tags: [
  "Vue",
  "Vuejs 2",
  "SPA"
]
---

## Initial Prerender Setup

During developing SPA (Single Page Application) we met with a common SPA problem: although google crawler uses the last Chromium version to run JS and indexing results as HTML pages (it’s not so easy to make it work and there is still the Fix Search-related JavaScript problems list), but for other search systems and sharing in social networks SPA doesn’t work. They will get the default index.html with the default title, description, etc for all pages.

So we have the following options to resolve the current issue:

- SSR (Server Side Rendering)
- Prerender pages

I won’t dig too deeply in the advantages and disadvantages of each option but here is the basic difference:<br>
SSR - gathers page's required data and creates an HTML right on client request
Prerender - creates an HTML page early by running the app in a browser, saving the page snapshot as an HTML file, and ready to provide it on a client request immediately.

This is a summary of why we have chosen prerender:

- We don’t want to create infrastructure and migrate from global CDN.
- We don’t want to spend time to migrate our Vue.js app to Nuxt (SSR framework for Vue.js)
- We don’t want to increase request time which can be produced by request during SSR to microservice servers

Initial Prerender Setup

As an example, I created a very simple SPA by Vue CLI with several routes.
Prerender will do a prerender-spa-plugin webpack plugin for us.

First, we need to install the plugin

```
yarn add prerender-spa-plugin path -D
```

Then, add several lines of webpack configuration. In my case I need to create the file vue.config.js in the project root folder, which will be merged with the main webpack configuration, and add these lines:

```
const path = require('path');
const PrerenderSPAPlugin = require('prerender-spa-plugin');

module.exports = {
  configureWebpack: {
    plugins: [
      new PrerenderSPAPlugin({
        staticDir: path.resolve('dist'),
        routes: ['/', '/a', '/b'],
      }),
    ]
  }
};
```

Here we just add this plugin with minimal required configuration<br>
`staticDir: path.resolve('dist')` - where to put prerendered pages as html files<br>
`Routes: ['/', '/a', '/b']` - list of pages which need to be prerendered

As a result for each route we will have a folder with the file index.html and for the home page - index.html file in root folder accordingly:

```
├── a
│   └── index.html
├── b
│   └── index.html
├── css
│   └── app.cdf92c16.css
├── favicon.ico
├── img
│   ├── a.204d0d3a.jpg
│   ├── b.0ebbb17b.jpg
│   └── logo.82b9c7a5.png
├── index.html
└── js
    ├── app.2bb56259.js
    ├── app.2bb56259.js.map
    ├── chunk-vendors.1ba84834.js
    └── chunk-vendors.1ba84834.js.map
```

[Second part](/blog/setup-prerender-webpack-prerender-spa-plugin-part-2)