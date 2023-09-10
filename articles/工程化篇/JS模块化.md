# ES6之前

## 浏览器`<script>`标签

`<script>`标签导入代码，其中的变量会被用户修改，并且变量被注入到全局作用域中，维护困难。通过将所有模块封装到一个IIFE中，可以缓解上述问题：

```html
<script>
  const module = (function () {
    let middle = 0
    return {
      module1: () => {
        return middle + 1
      },
      module2: () => {
        return middle + 2
      }
    }
  })()
</script>
```

## CommonJS

CommonJS常用于Node.js，示例：

```js
/** 使用`module.require`导入模块 */
const { readFileSync, writeFileSync } = require('fs')

function main (filePath) {
  return readFileSync(filePath).toString()
}
/** 使用`module.exports`导出模块 */
exports.main = main
```

> Node.js中`require`和`exports`被暴露为全局属性，调用时可以不加上`module`

类型注解：

```ts
/** TS4.7 */
interface Module {
  /** 如果是`true`，代表module正在Node.js预加载阶段运行 */
  isPreloading: boolean;
  /** 当前模块对外导出的内容 */
  exports: any;
  /** 内容导入 */
  require: Require;
  /** module标识符 */
  id: string;
  /** module文件名，包含绝对路径 */
  filename: string;
  /** 如果是`true`，代表module已加载 */
  loaded: boolean;
  /** @deprecated since v14.6.0 Please use `require.main` and `module.children` instead.
   * 不推荐使用这个指令
   */
  parent: Module | null | undefined;
  /** 返回一个数组，代表当前module中使用到的modules */
  children: Module[];
  /** module目录名，通常等同于`path.dirname()` */
  path: string;
  /** 模块搜索路径，require会在这些目录下搜索你要导入的module */
  paths: string[];
}
```

## AMD（Asynchronous Module Definition，异步模块定义）

AMD出现的目的是为了将CommonJS应用到浏览器端，并且实现俩者兼容。Node.js中CommonJS是同步加载模块，但是在浏览器中必须等到模块下载完毕后才可以加载，所以AMD使用异步加载模块。相关库有[require.js](https://requirejs.org/)。示例：

```ts
/**
 * @param id 唯一标识符
 * @param dependencies 模块依赖
 * @param factory 模块加载完毕时的回调函数
 */
function define (factory: Function)
function define (id?: string, factory: Function)
function define (id?: string, dependencies?: string[], factory: Function)

define(
  id: uid(),
  [
    'require',
    'dependency'
  ],
  function(require, factory) {
    'use strict';
    // do somthing
  }
)
```

> 上述举例不能代表特定库API，相关API请跳转到目标库

## CMD（Common Module Definition，通用模块定义）

CMD与AMD类似，但是省略了手动输入依赖。相关库有[sea.js](https://seajs.github.io/seajs/docs/)。示例：

```ts
/**
 * @param factory 模块加载完毕时的回调函数
 */
function define (factory: Function)

define(
  function () {
    const fs = require('fs')
    // do somthing
  }
)
```

损耗了一些性能，但是相较于AMD方便了一点。

> 上述举例不能代表特定库API，相关API请跳转到目标库

# ES6

## ESM（ES Module）

ES6规范中，Module成为标准。现阶段各大浏览器厂商、Node.js都支持ESM。文件中使用：

```js
// 导入模块
import { uniqueId } from 'loadsh.js'

const middle = function () {
  return uniqueId('z-')
}
// 导出模块
export middle
// 默认导出模块
export default middle
```

> 现阶段import、export使用频繁，这里不再介绍其具体用法和细节，仅作导览

在浏览器中使用：

```html
<script type="module">
  /** 导入的模块需要支持ESM */
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10.4.0/+esm'
  mermaid.initialize({ startOnLoad: false })
</script>
```

> 浏览器中module默认script是defer执行，即脚本下载完全后不会立即执行，而是当DOM解析完毕后（domcontentLoaded事件）再执行

## UMD（Universal Module Definition，通用模块定义）

UMD出现目的和CMD类似，为了统一AMD、CommonJS和ESM，在webpack、vite等构建工具中使用广泛，但是并未暴露细节，这里简单实现一个`loadsh`模块导入：

```js
(function (root, factory) {
  if (typeof define === 'function' && define.amd) { // 如果是AMD
    define(['loadsh'], factory)
  } else if (typeof exports === 'object') { // 如果是CommonJS
    module.exports = factory(require('loadsh'))
  } else { // 如果是ESM
    root.returnExports = factory(root.loadsh)
  }
})(this, function () { /** do somthing */ })
```

# 总结

没有总结，完事！