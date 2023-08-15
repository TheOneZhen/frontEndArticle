# 设计选型

## 声明式 + 命令式

声明式更关注结果，命令式更关注过程。Vue暴露给用户的是声明式，内部实现是命令式。

## 虚拟DOM（Virtual DOM， VDOM）

[DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)（Document Object Model，文档对象模型）是JS对象，在解析HTML时生成，它属于Web API而非JS规范。浏览器不能直接渲染HTML和CSS内容，而是先将它们分别转换为DOM和CSSOM再渲染。

> 通常打开浏览器控制台Element窗口，修改HTML内容会导致页面内容改变，造成一种HTML与页面内容一对一映射的错觉。

虚拟DOM不是DOM，


## 框架设计的核心要素

- 控制代码体积
    - 环境变量：定制开发环境包
    - Tree-Shaking：ESM
- TS
- 错误提示和处理

<!-- 渲染器和渲染函数的区别 -->


