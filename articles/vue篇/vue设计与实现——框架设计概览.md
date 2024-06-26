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

# 第2章 框架设计的核心要素

## 代码管理
### monorepo代码管理

Vue3包含很多模块，比如`compiler-core`、`reactivity`、`compiler-ssr`等，模块被拆分到packages目录下的不同子目录，使模块功能更细化、职责更明确。这些模块如果放置在单独的仓库中，即multirepo，会有以下问题：

1. 依赖变更：多个模块依赖A模块，当A模块更新时，需要在不同的仓库中更新A模块版本，然后打包、发布...，相当繁琐。
2. 工程化重复配置且维护困难：对于Vue3框架，不同模块工程化配置大致相同，不同仓库维护起来困难。
3. 开发启动繁琐：首先需要拉取各个仓库，然后再分别启动...

Vue3使用[pnpm + workspace](https://www.pnpm.cn/workspaces)实现monorepo代码管理，将多个package放在一个仓库中，每个package中都有`package.json`文件用来支持自定义工程化配置。monorepo实现方式很多，可以参考[这篇文章](https://zhuanlan.zhihu.com/p/621073227?utm_id=0)。

### 更好的TypeScript类型支持

TypeScript引入，利于IDE对变量类型的推导，在开发阶段避免一些易错问题。因为使用TypeScript开发在不同用户、不同项目的利与弊存在争议，所以这里不再具体介绍。推荐TypeScript官方提供的[playground](https://www.typescriptlang.org/play)，可以帮助理解TypeScript。

## 提升开发体验

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

### 特性开关

Vue.js基于rollup.js对项目进行构建，比如用于区分开发环境的变量`__DEV__`，构建工具会根据这些变量来划分Dead code并在构建时移除。Vue.js在输出资源时会输出用于开发环境的`vue.global.js`和用于生产环境的`vue.global.prod.js`，在生产环境下不存在警示代码，参见[rollup.config.js](https://github.com/vuejs/core/blob/main/rollup.config.js)。

### Tree-Shaking

Tree-Shaking和上面介绍的优化方式发生在打包阶段，都是通过构建工具实现优化。不过Tree-Shaking依赖[ESM的静态结构](https://rollupjs.org/introduction/#tree-shaking)。比如以下文件结构：

```
- demo
    - package.json
    - input.js
    - utils.js
```

`input.js`和`utils.js`文件内容：

```js
// input.js
imporrt { foo } from './utils.js'
foo()
// utils.js
export function foo (obj) {
    obj && obj.foo
}

export function bar(obj) {
    obj && obj.foo
}
```

将`input.js`做为入口文件打包，输出ESM，得到打包内容`bundle.js`：

```js
// bundle.js
export function foo (obj) {
    obj && obj.foo
}
```

可以看到函数`bar`被移除了。

如果一段代码在运行时没有任何副作用，还可以使用`/*#__PURE__*/`注释标记，告诉构建工具在打包时移除此类代码。JS本身是动态语言，静态分析存在难度，所以注释标记需要手动添加。Vue.js源码中存在大量`/*#__PURE__*/`，对优化Vue.js代码体积有很大帮助。


### 移除部分特性

内容参见[Vue3 迁移指南](https://v3-migration.vuejs.org/zh/)，Vue3一些特性、语法与Vue2不兼容，你可以使用[迁移构建开关](https://v3-migration.vuejs.org/zh/migration-build.html#%E5%85%BC%E5%AE%B9%E6%80%A7%E9%85%8D%E7%BD%AE)来禁用或开启兼容性特性。

## 性能考虑

<img src="https://cn.vuejs.org/assets/render-pipeline.sMZx_5WY.png" alt="渲染管线" />

先了解一下Vue组件渲染流程，**Vue模板**首先会被编译成**渲染函数**，运行时由**渲染器**调用**渲染函数**得到**虚拟DOM**，当依赖更新时，**副作用函数**重新运行得到新的**虚拟DOM**，渲染器会对比新旧虚拟DOM再更新。

### 响应式变更

Vue3响应式基础是`Proxy/Reflect`，相较于Vue2使用的`Object.defineProperty`，可以更好地劫持对象操作，降低开发人员心智负担。

> 这里可能会误导大家认为`Object.defineProperty`性能要比`Proxy/Reflect`差，看下这个用例[https://www.measurethat.net/Benchmarks/Show/26436/0/proxy-vs-defineproperty]()，分别使用`Object.defineProperty`、`Proxy/Reflect`和方法访问数据，结果是`Object.defineProperty`性能最好，`Proxy/Reflect`性能最差。
> 上述用例虽然只是**平面**访问**一层**属性，而非**深度**访问，但可以做为`Proxy/Reflect`性能反例。我没有找到更细节的文章（JS Engine层面），推荐[https://thecodebarbarian.com/thoughts-on-es6-proxies-performance]()，原文中提到`Promise`性能也很差，但是实践中可维护性也是重要一环。

### 渲染优化

Vue2采用双端diff，Vue3采用快速diff。对于Vue中的组件，最终都会变成渲染函数，响应式数据变更时触发渲染函数重新渲染生成新的节点（Nodes）。如果将已经存在的节点销毁再创建新的节点，成本很大。所以需要diff对比出节点差异，然后定向增、删、更新。

### 编译优化

1. [静态提升](https://cn.vuejs.org/guide/extras/rendering-mechanism.html#static-hoisting)
2. [动态节点收集与补丁标志（PatchFlags）](https://cn.vuejs.org/guide/extras/rendering-mechanism.html#patch-flags)
3. block树：官方的[树结构打平](https://cn.vuejs.org/guide/extras/rendering-mechanism.html#tree-flattening)
4. 预字符串化

    对于以下节点
    
    ```html
    <div>
        <p>xxx</p>
        <!-- 很多个静态内容<p>标签 -->
    </div>
    ```

    如果编译会产生如下代码：

    ```js
    const hoist1 = createVNode('p', null, PatchFlags.HOiSTED)
    // ...
    const hoistn = createVNode('p', null, PatchFlags.HOiSTED)
    ```

    预字符串化可以将这些静态节点转换为字符串，通过`innerHTML`进行设置，可以减少创建VNode产生的性能开销，减少内存占用。

5. 缓存内联事件处理函数
6. `v-once`


# 第3章 Vue.js3 的设计思路

## 虚拟DOM（VNode）


## 3.2 渲染器
## 3.3 组件的本质
## 3.4 模板的工作原理
