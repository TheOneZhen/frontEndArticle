# 前言

Vue Router是 Vue 的官方路由，与 Vue.js 核心深度集成。本篇将从 Vue Router 4（for Vue3）的 API 作为入口分析其源码，最后简单探讨其设计。

> - Vue Router版本：4.2.5；
> - 仓库地址：[https://github.com/vuejs/router](https://github.com/vuejs/router)；
> - 官网地址：[https://router.vuejs.org/zh/](https://router.vuejs.org/zh/)；
> - 阅读本篇强烈建议将源代码拉取到本地用于辅助阅读，并且源代码提供了大量的类型注解详细到API RFCS，更易链接到外部知识点；

## 为什么要阅读源码

本篇不是将读者引入router业务开发，而是带领读者更深入的了解Vue-Router的局限，方便在之后的工作中解决更加棘手的问题。
**官方提供的能力是一种过于抽象，没有提供功能的局限性**

1. 秀技术，可以让自己萌生一种**优质程序员**的感觉，就是高其他**低质量程序员**一等；
2. 

## 本篇如何进行源码阅读

从俩个角度入手源码：
1. API
2. 一个正常的业务流程，Vue-Router做了哪些事情

# API

从API去了解框架可能无法帮助我们熟悉框架的整体结构、关联，但是可以让我们对各个API的细节变得清晰。我们先看下Vue-Router的基本使用。

```ts
// main.ts
import { createApp } from 'vue'
import { createRouter } from 'vue-router'

const routes = [
    { path: '/', component: Home }
]

const router = createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
}) 

createApp()
    .use(router)
    .mount('#app')
```

## RouterOptions

