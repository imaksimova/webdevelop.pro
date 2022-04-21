---
title: "Vue.js and TypeScript Problems Collection"
subTitle: Fury road with Vue.js 2 and TypeScript.
description: >
  I believe that TypeScript will give you a lot of advantages and if you will invest some time in learning, it will definitely give you outcomes in future.  So I decided to migrate small Vue.js 2 application on TypeScript. At first, I wasn't prepared to fac
date: 2018-02-27
draft: false
authors: "Vlad Tarasenko"
image: /images/blog/34.png
tags: [
  "Vue",
  "Typescript",
  "Sign up",
  "Vuejs 2",
  "Migration"
]
---

Hello everyone.

I believe that TypeScript will give you a lot of advantages, and if you invest some time in learning, it will definitely give you outcomes in the future.

So I decided to migrate small Vue.js 2 application on TypeScript. At first, I wasn't prepared to face so many problems, but I was able to solve them one by one.

First - if you are new in the TypeScript, try to get an editor with good auto-compilation (I would recommend Visual Studio Code or JetBrains editor).

My journey started with typical tutorial stuff; I installed TypeScript and TSLint:

```
npm install typescript --save-dev
npm install tslint --save-dev
npm install vue-class-component 
npm install vue-property-decorator <-- bug here (check out explanation below).
```

Created basic TSconfig and updated webpack.config.js .

Then I start to update my file one by one:

**main.js => main.ts**

```
new Vue({
    el: '#app',
    router,
    // Will have error in render: "TypeError: Cannot read property 'matched' of undefined"
    render(h) {
        return h(App)
    },
});
```

**router/index.js => router/index.ts changes**

First version of router/index.ts:

```
import Vue from 'vue';
import Router from 'vue-router';
import VueResource from 'vue-resource';
import Signup from '@/pages/signup';

Vue.use(Router);
Vue.use(VueResource);

export default new Router({
    mode: 'history',
    routes: [
        {
        path: '/signup',
        name: 'signup',
        component: Signup,
        },
    ],
});
```

pages/signup.vue migrated version:

```
import Vue from 'vue';
import { Route } from 'vue-router';
import Component from 'vue-property-component';
// Error here
import Response  from 'vue-resource';

export type FieldData = {
    email: string;
    password: string;
};

// Error here
@Component
export default class Signup extends Vue {
    fieldsDesc: Array;
    data: FieldData;
    error: string;

    constructor() {
        super();
        this.fieldsDesc = [];
        this.error = '';
        this.data = {
            email: '',
            password: '',
        };
    }

    static beforeRouteEnter(to: Route, from: Route, next: any) {
        // Error here
        Vue.http.request({ url: `${Vue.config.server.user}/signup`, method: 'options' }).then((res: AxiosResponse) => {
        if (res.status === 200) {
            next((vm: { setData:any } & Vue) => {
                vm.setData('', res.data);
            });
        } else {
            next((vm: { setData:any } & Vue) => {
                vm.setData(res.statusText, []);
            });
        }
        }).catch((err: Error) => {
            console.log('Error happens', err);
            console.debug(err);
        });
    }
    ...
```

At this point, my journey turned into horrify movie.

## Vue-router functions, beforeRouteEnter, watch and other do not work with Component class

I notice that my code still does not compile because TypeScript cannot find function beforeRouteEnter in components, i.e. Component decorator is not working. Also, I saw that the watch decorator was undefined too and I have a strong impression I missed something.

I double-check documentation, especially Component.registerHooks . I make sure I did everything right, but still, Vue.js does not work as supposed.

I discovered that folder node_modules/vue-property-decorator is empty (it has only README and LICENCE file). Tried to install directly from git - but it did not work either. Ended up with cloning project from git and building it by myself:

```
npm uninstall vue-property-decorator
cd ..
git clone https://github.com/kaorun343/vue-property-decorator
cd vue-property-decorator
npm install 
npm build
cd ..
cp -rf vue-property-decorator/* your_project/node_modules/
```

Here is a script to run to fix if you need it.

## Property 'name' does not exist on type 'Class'

That's an easy one to fix - just put a variable right before the class name:

```
@Component
export default class Signup extends Vue {
  name: string; <-- just put your var right here.
```

## Cannot import .vue file with TypeScript

Put vue-file-import.d.ts in the directory covered by the tsconfig.json. (Thank you, Ponny).
**Main (/)** project folder in my case.

```
// Cannot find module '@/pages/index.vue'.
// vue-file-import.d.ts to main folder of the project
declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
```

## beforeRouteEnter do not trigger with Vue.js and TypeScript

Make sure to put Component.registerHooks code in main.ts (entry point) file **before** any imports:

```
// main.ts - entry point
// Make sure to register before importing any components
import Component from 'vue-class-component'

// before you will make any import
Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate' // for vue-router 2.2+
]);
in the component file
```

## Unable to resolve the signature of a class decorator when called as an expression error

We get rid of the problem with Vue.js component decorator but still have a problem with vue-resource and vue HTTP calls.

That might look like this bug 181 but I updating Vue.js with all other libraries did not save me, cause after updating vue-resource I have a new error:

## TypeScript definitions problems with vue-resource

Besides, to resolve a signature bug, you will face TypeScript definitions problems. Downgrading vue-resource version should help, but then you will get vue-class-component bug #181.

Long story short - just stop using vue-resource.

It does not support TypeScripts well, and some of the developers left the project.

I migrated to Axios, and I do enjoy how it works with TypeScript, final version of signup.vue:

```
 - Vue.http({ url: `${Vue.config.server.user}/signup`, method: 'options' }).then((res) => {
 + axios.request({ url: `${Vue.config.server.user}/signup`, method: 'options' }).then((res: AxiosResponse) => {
```

And at this moment I had a final boss problem:

## Cannot read property 'matched' of undefined && Unknown element "router-link" && Unknown element "router-view"

It was hard to find what causes this problem. At first sight, it looks like you just overlooked something in your routes file. But you did not. While trying to localize a problem, I realize it was either in main.ts or App.vue file.

Digging deeper showed me that App.vue combined with tag wouldn't work. I did not 
find an answer (yet), but I found a workaround: main.ts:

```
-   render(h) {
-    return h(App)
-   }, 
+   template: '<div><router-view></router-view></div>',
```

I hope that will help anyone who is migrating to TypeScript.

As an agenda I note for myself:

- Try not just google error message but to understand where your error came from;
- Isolate your code make sure you know what triggers an error;
- Look at someone else code and check how they build similar functions, as for example this guy really helped me --> [https://github.com/DanielRosenwasser/typescript-vue-todomvc](https://github.com/DanielRosenwasser/typescript-vue-todomvc). Thank you, Daniel!
- Other project that might help you --> [https://github.com/Microsoft/TypeScript-Vue-Starter/](https://github.com/Microsoft/TypeScript-Vue-Starter/) and 
[https://github.com/caleblloyd/dotnet-core-boilerplate/blob/61a4d4420757e1f2445d95fe02e97f5cbfcc153f/ui/](https://github.com/caleblloyd/dotnet-core-boilerplate/blob/61a4d4420757e1f2445d95fe02e97f5cbfcc153f/ui/) (real app example).

Also, for myself, I have decided that Vue.js is not fully ready for TypeScript yet. Sorry to say this out loud, but while TypeScript support based on some 3rd part GitHub repositories, you cannot trust them enough for production use.

To be continued...