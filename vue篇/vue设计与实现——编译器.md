Vue编译器的作用是将模板编译成渲染函数

# 编译器核心

之后以此模板字符串为基础进行解析：
```js
const TemplateStr = `
<template>
  <div>
    <p>这是一行文本</p>
  </div>
  <custom-com>这是一个自定义组件</custom-com>
</template>
`
```

## Parse：template-> template AST

解析器（parser）用来将模板字符串解析为模板AST。模板字符串来自Vue-SFC，一般由Loader提供，比如WebPack的[Vue-Loader](https://github.com/vuejs/vue-loader#what-is-vue-loader)和Vite的[plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)。模板AST就是模板字符串的JS对象树形式，以支持之后其他编译函数使用。

```ts
/** parse返回值类型，为了避免代码混乱，没有将注解加进去 */
interface ASTNode {
  type: string
  tag: string
  children: ASTNode[]
  content: string
}

function parse (str) {
  const tokens = tokenize(str)
  const root = { type: 'root', children: [] }
  const stack = [root]
  
  while (tokens.length) {
    const parent = stack[stack.length - 1]
    const t = tokens[0]
    switch (t.type) {
      case 'tag':
        const elementNode = {
          type: 'Element',
          tag: t.name,
          children: []
        }
        parent.children.push(elementNode)
        stack.push(elementNode)
        break
      case 'text':
        const textNode = {
          type: 'Text',
          content: t.content
        }
        parent.children.push(textNode)
        break
      case 'tagEnd':
        stack.pop()
        break
    }
    tokens.shift()
  }

  return root
}

/**
 * 对于普通的HTML元素由三部分组成：开始标签、文本内容和结束标签，tokenize也是围绕它们进行
 * 注：tokenize本质是有限状态机，这里我为了代码简洁使用了正则表达式，有限状态机demo可以参考https://github.com/HcySunYang/code-for-vue-3-book/blob/master/course6-%E7%BC%96%E8%AF%91%E5%99%A8/code-15.2.html 。
 */
function tokenize (str) {
  const result = []
  const re = /<[a-z\-]+>|(?<=\>).*(?=\<)|<\/[a-z\-]+>/g
  const matched = str.match(re)
  if (matched) {
    Array.from(matched).map(token => {
      if (token.startsWith('</')) result.push({ type: 'tagEnd', name: token.replace(/<\/|>/g, '') })  
      else if (token.startsWith('<')) result.push({ type: 'tag', name: token.replace(/<|>/g, '') })
      else result.push({ type: 'text', name: token })
    })
  }
  return result
}
```

> Vue解析场景十分复杂，上述代码只是简单实现，Vue parse源码[地址](https://github.com/vuejs/core/blob/main/packages/compiler-core/src/parse.ts)。

## Transform：template AST -> JS AST

```js
function transform(root, options) {
  const context = createTransformContext(root, options)
  traverseNode(root, context)
  // 对节点进行静态提升：https://cn.vuejs.org/guide/extras/rendering-mechanism.html#static-hoisting
  createRootCodegen(root, context)
  root.hoists = context.hoists
}
/** 创建转换器上下文 */
function createTransformContext (root, option) {
  const context = {
    parent: null,
    replaceNode(node) {
      context.parent.children[context.childIndex] = context.currentNode = node
    },
    removeNode(node) {
      const list = context.parent.children
      const removalIndex = list.indexOf(node)
      list.splice(removalIndex, 1)
    }
  }
  return context
}
/** 深度遍历子节点 */
function traverseNode (root, context) {
  context.currentNode = node
  const { nodeTransforms } = context
  const exitFns = []
  for (let i = 0; i < nodeTransforms.length; i++) {
    const onExit = nodeTransforms[i](node, context)
    if (onExit) {
      if (isArray(onExit)) exitFns.push(...onExit)  
      else exitFns.push(onExit)
    }
    if (!context.currentNode) return  
    else node = context.currentNode
  }
  for (let i = 0; i < parent.children.length; i++) {
    const child = parent.children[i]
    context.parent = parent
    context.childIndex = i
    traverseNode(child, context)
  }
  context.currentNode = node
  let i = exitFns.length
  while (i--) exitFns[i]()
}
/** 进行下一步，生成渲染函数 */
function createRootCodegen()
```
