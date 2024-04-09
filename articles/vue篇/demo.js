const obj = { a: 1 }

// 基本响应系统
const proxy = new Proxy(obj, {
  get (target, key, receiver) {
    track(target, key)
    return Reflect.get(target, key, receiver)
  },
  set (target, key, value, receiver) {
    trigger(target, key)
    Reflect.set(target, key, value, receiver)
  }
})
const bucket = new WeakMap()
const effectStack = []
let activeEffect = undefined

function track (target, key) {
  if (activeEffect === undefined) return

  const depsMap = bucket.get(target) || new Map()
  let effects = depsMap.get(key) || new Set()
  
  bucket.set(target, depsMap)
  depsMap.set(key, effects)
  effects.add(activeEffect)
}

function trigger (target, key) {
  const depsMap = bucket.get(target)
  
  if (depsMap === undefined) return

  const effects = depsMap.get(key)
  
  effects && effects.forEach(fn => fn())
}

// 分支切换和cleanup
function effect (fn) {
  const effectFn = () => {
    cleanup(effectFn)
    effectStack.push(effectFn)
    fn()
  }
  effectFn.deps = []
  effectFn()
}

function cleanup (effectFn) {
  for (const effects of effectFn.deps) effects.delete(effectFn)
  effectFn.deps.length = 0
}
// effect嵌套

// 避免无限递归

// 调度执行

// computed

// watch