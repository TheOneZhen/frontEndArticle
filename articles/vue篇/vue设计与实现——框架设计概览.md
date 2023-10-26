最近在看Vue3源码，因为直接阅读源码存在一定的困难，所以借助《Vue设计与实现》这本书逐步加深对框架源码的理解。《Vue设计与实现》由Vue3团队成员霍春阳编写，目前没有开源，需要在一些平台上购买。该书共6篇：框架设计概览、响应系统、渲染器、组件化、编译器和服务端渲染，基本覆盖了核心内容。每篇内容由简入繁，渐进式帮助读者了解框架内部。

渐进式内容适合初次阅读但不适合回顾，再者此书编写时间较长，后续一些API没有覆盖，而且一些API的介绍穿插在书中，没有在目录上展示不利于查找。

本人在此书基础上总结内容，目录结构同原书，每篇内容结构如下：

``` js
/**
 * # 源码简单实现
 * # 场景介绍 + 关键业务 + 源码指向（GitHub）
 * # 关联API介绍 + 源码指向（GitHub）
 */
```

# Vue3的优化

## 代码管理
### monorepo代码管理

Vue3包含很多模块，比如`compiler-core`、`reactivity`、`compiler-ssr`等，这些模块被拆分到packages目录下的不同子目录，使模块功能更细化、职责更明确。这些模块如果放置在单独的仓库中，即multirepo，会有以下问题：

1. 依赖变更：多个模块依赖A模块，当A模块更新时，需要在不同的仓库中更新A模块版本，然后打包、发布...，相当繁琐。
2. 工程化重复配置且维护困难：对于Vue3框架，不同模块工程化配置大致相同，不同仓库维护起来困难。
3. 开发启动繁琐：首先需要拉取各个仓库，然后再分别启动...

Vue3使用[pnpm + workspace](https://www.pnpm.cn/workspaces)实现monorepo代码管理，将多个package放在一个仓库中，每个package中都有`package.json`文件用来支持自定义工程化配置。monorepo实现方式很多，可以参考[这篇文章](https://zhuanlan.zhihu.com/p/621073227?utm_id=0)。

### 更好的TypeScript类型支持

TypeScript引入，利于IDE对变量类型的推导，在开发阶段避免一些易错问题。因为使用TypeScript开发在不同用户、不同项目的利与弊存在争议，所以这里不再具体介绍。推荐TypeScript官方提供的[playground](https://www.typescriptlang.org/play)，可以帮助理解TypeScript。

## 提升用户开发体验

使用js开发遇见问题时，控制台抛出的错误有限，导致开发阶段问题排查困难。在Vue3中存在很多类似下面的代码：

```js
if (__DEV__) {
  warn('xxxx')
}
```

这类代码用来告诉开发者程序运行时出现了何种错误，帮助问题的定位。除此之外，Vue3还提供全局错误处理API：[app.config.errorhandler](https://cn.vuejs.org/api/application.html#app-config-errorhandler)、[app.config.warnhandler](https://cn.vuejs.org/api/application.html#app-config-warnhandler)，进一步提升开发bug追踪，`app.config.errorhandler`还可用于生产阶段错误的捕捉。

除了更全面的错误处理机制，Vue3组合式语法也显著提升了开发体验，参见[组合式API](https://cn.vuejs.org/guide/introduction.html#api-styles)。

## 优化源码体积

Vue3中优化源码体积的方式有很多种：

1. 打包工具 + 特性开关（参见`rollup.config.js`文件）

    比如用于区分开发环境的变量`__DEV__`、控制选项式API是否开启的变量`__FEATURE_OPTIONS_API__`等，构建工具会根据这些变量来划分Dead code并在构建时移除。

2. Tree-Shaking

Tree-Shaking和上面介绍的优化方式发生在打包阶段，它们都是通过构建工具实现优化。不过Tree-Shaking基于ESM的静态结构，参见[rollup Tree-Shaking](https://rollupjs.org/introduction/#tree-shaking)。

3. 移除部分API

这里的内容有些多，参见[Vue3 迁移指南](https://v3-migration.vuejs.org/zh/)，**移除的APIs**一栏。

## 性能优化

### 响应式变更

Vue3响应式基础是`Proxy/Reflect`，相较于Vue2使用的`Object.defineProperty`，可以更好地劫持属性设置

### 渲染优化

    Vue2采用双端diff，Vue3采用快速diff。渲染器一篇中会对diff算法详细介绍，这里不再详述。

### 编译优化

1. Fagment
2. 静态提升


# 问题

    4. 框架打包输出内容

        -bundle：用于构建工具使用
        -global/esm-browser：用于浏览器使用，后者支持ESM




# 可能是其他章节的内容

1. 渲染器的渲染是有目的的渲染，还是统一进行全量diff（从root出发的diff）