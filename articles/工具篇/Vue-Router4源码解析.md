# 前言

Vue Router是 Vue 的官方路由，与 Vue.js 核心深度集成。本篇将从 Vue Router 4（for Vue3）的 API 作为入口分析其源码，最后简单探讨其设计。

> - Vue Router版本：4.2.5；
> - 仓库地址：[https://github.com/vuejs/router](https://github.com/vuejs/router)；
> - 官网地址：[https://router.vuejs.org/zh/](https://router.vuejs.org/zh/)；
> - 阅读本篇强烈建议将源代码拉取到本地用于辅助阅读，并且源代码提供了大量的类型注解详细到API RFCS，更易链接到外部知识点；

# API 源码分析

## createRouter

`createRouter()`会返回一个 Router 实例，然后交给`Vue App`使用。

<!-- 先从createrouter option下手 -->