# 前言
<!-- 最后文章内部代码的换行更换为2，如果感觉不适的话 -->
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
<!-- 先从输入输出的视角去看 -->
先看下Vue-Router的基本使用。

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
}/** type `RouterOptions` */)

createApp()
    .use(router)
    .mount('#app')
```

## RouterOptions

`createRouter`内部关联太多，上来就看属实冒昧，我们先看下传入的参数类型`RouterOptions`：

```ts
interface RouterOptions extends PathParserOptions {
    history: RouterHistory
    routes: Readonly<RouteRecordRaw[]>
    scrollBehavior?: RouterScrollBehavior
    parseQuery?: typeof originalParseQuery
    stringifyQuery?: typeof originalStringifyQuery
    linkActiveClass?: string
    linkExactActiveClass?: string
}
```

### history

`history`配置允许用户选择不同的历史记录模式，对于浏览器环境，提供了**Hash模式**和**HTML5模式**；对于Node和SSR环境，提供了**Memory模式**；为了方便操作路由，不同模式返回的数据结构同是`RouterHistory`。



```
### routes

### scrollBehavior
https://router.vuejs.org/zh/guide/advanced/scroll-behavior.html#%E6%BB%9A%E5%8A%A8%E8%A1%8C%E4%B8%BA
