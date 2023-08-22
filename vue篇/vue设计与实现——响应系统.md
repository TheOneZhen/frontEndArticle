# 响应系统的作用与实现

```ts
type Bucket = WeakMap<any, Map<string, Set<Function>>>
const bucket: Bucket = new WeakMap()
```

## track



```js
function track (target, key) {
  if (activeEffect) {
    let depsMap = bucket.get(target)
    if (!depsMap) {
      bucket.set(target, (depsMap = new Map()))
    }
    let deps = depsMap.get(key)
    if (!deps) {
      depsMap.set(key, (deps = new Set()))
    }
    deps.add(activeEffect)
    activeEffect.deps.push(deps)
    activeEffect.options.onTrack && activeEffect.options.onTrack({
      effect: activeEffect,
      target,
      key
    })
  }
}
```

## trigger

```js
function trigger(target, key, newValue, oldValue) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)
  effects && effects.forEach(fn => {
    if (fn !== activeEffect) {
      fn()
      if (fn.options.onTrigger) {
        fn.options.onTrigger({
          effect: activeEffect,
          target,
          key,
          newValue,
          oldValue
        })
      }
    }
  })
}
```

<!-- 这里的总结需要不断补充 -->
响应式数据`data`改变会触发副作用函数`effect`，`effect`是一些功能的封装，用来更新视图或者更新其他响应式数据等。在触发`effect`之前，需要进行`data`与`effect`关系建立，即`track`；关系建立后触发`effect`称为`trigger`。响应系统设计主要任务就是解决它们之间边界问题。

# 非原始值的响应式方案

对于非原始值的代理，Vue3聚类数据相关操作，对应`Proxy Handler`中5个`trap`函数：`get`、`set`、`deleteProperty`、`has`、`ownKeys`，[源码-mutableHandlers](https://github.com/vuejs/core/blob/main/packages/reactivity/src/baseHandlers.ts)。

## Proxy和Reflect

`Proxy`和`Reflect`是Vue3响应式基础，`Proxy`代理对象并通过`handler`参数中的`trap`函数拦截对象操作A，`Reflect`代替对象执行操作A。问题：

1. **访问器属性**中`this`指向

    当访问的属性是**访问器属性**时，需要在访问器执行时为其指定`this`，使用`Reflect`可以简化了很多步。


代码：

```js
const obj = {
  foo: 1,
  get bar () { return this.foo }
}
const p = new Proxy(obj, {
  get (target, key, receiver) {
    console.log('trapped object getter!')
    track(target, null, key)
    return Reflect.get(target, key, receiver) 
  },
  set (target, key, value, receiver) {
    return Reflect.set(target, key, value, receiver)
  }
})

console.log(p.foo) 
// trapped object getter!
// 1
```

## 代理Object

```js
const obj = { a: 1, b: undefined }

obj.a || obj["a"] // get
obj.a // set
delete obj.b // deleteProperty
"a" in obj // has
for (const key in obj) {} // ownKeys
```

原始对象Object
- `get`：
- `set`
- `deleteProperty`
- `has`
- `ownKeys`



# 原始值的响应式方案



# 响应系统的作用与实现

## effect：副作用函数

响应式数据变更会使引用该数据的内容变更，后这就是副作用函数。

## 调度执行
> Vue3有更完整的调度算法，建议查看源码

```js
const queue = new Set()
const p = Promise.resolve()
let isFlushing = false
function flush () {
  if (isFlushing) return
  isFlushing = true
  p.then(() => queue.forEach(fn => fn()))
    .finally(() => isFlushing = false)
}
```

## watch
### 读取操作封装（traverse）
### options.immediate
### options.flush
### 副作用过期
### onCleanup


# Q&A

- 如何更改Vue3的响应系统（比如响应getter，而非getter + setter）？