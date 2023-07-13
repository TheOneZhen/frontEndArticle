# ES Next

## 语法

### 块作用域声明

ES之前，变量作用域的基本单元是`function`，不过可以通过函数表达式（IIFE）实现块作用域。

#### let声明
`var`声明的变量会沿着作用域链不断向上查找，直至全局作用域下，如果在此期间没有找到变量的声明，会在全局作用域下默认声明变量，导致作用域无效的情况。使用let声明后，JE会将let所在的作用域


### [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)

```js
const sign = Symbol('this is a Symbol')
```

### 模块

ES6模块概念：
1. 一个文件对应一个模块；
2. API是静态的；
3. 模块内部API不仅仅是引用，而是类似指针；
4. 模块是单例模式，外部导入不能修改模块API；
5. 模块导入等同于静态请求加载，会阻塞宿主环境的一些资源。比如如果是浏览器环境，通过网络阻塞加载，如果是Nodejs，通过文件系统阻塞加载。一般地，在宿主环境会有预加载措施。

普通模块、AMD、UMD、CommonJS、ESModule

import和export必须放置到模块中顶层作用域