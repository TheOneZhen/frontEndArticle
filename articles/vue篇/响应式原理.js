let activeEffect = undefined
/**
 * ## effect嵌套
 * 当effect出现嵌套调用时，无法确定activeEffect，所以需要栈结构支持
 *  - 真实函数执行之前，入栈
 *  - 真实函数执行完毕后，出栈，并将栈顶函数赋值给activeEffect
 */
const effectStack = []
/**
 * ## 响应式数据存储结构
 * DS: WeakMap<object, Map<string, Set<Function>>>
 */
const bucket = new WeakMap()

function track (target, key) {
  if (!activeEffect) return

  let depsMap = bucket.get(target)
  if (!depsMap) bucket.set(target, depsMap = new Map())

  let deps = depsMap.get(key)
  if (!deps) depsMap.set(key, deps = new Set())
  deps.add(activeEffect)
  activeEffect.deps.push(deps)

}

function trigger (target, key) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)

  const effectsToRun = new Set()
  effects && effects.forEach(effectFn => {
    /**
     * ## 避免无限递归
     * 副作用函数还在执行，又有相同的副作用函数要执行，导致无限递归。
     */
    if (effectFn !== activeEffect) effectsToRun.add(effectFn)
  })

  effectsToRun.forEach(effectFn => {
    if (effectFn.options.scheduler) effectFn.options.scheduler(effectFn) // 如果一个函数存在调度器，调用调度器，并将副作用函数作为参数
    else effectFn() // 否则直接执行
  })
}

function cleanup (effectFn) {
  for (const deps of effectFn.deps) deps.delete(effectFn)
  effectFn.deps.length = 0 // 重置依赖集合
}

function effect (fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    effectStack.push(effectFn)
    const res = fn()
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]

    return res
  }

  effectFn.options = options
  effectFn.deps = []
  if (!options.lazy) effectFn() 
  return effectFn
}
/**
 * ## 调度执行
 * 定义一个任务队列
 */
const jobQueue = new Set()
const p = Promise.resolve()
let isFlushing = false // 是否正在刷新队列

function flushJob () {
  if (isFlushing) reutrn
  isFlushing = true
  p
    .then(() => jobQueue.forEach(job => job()))
    .finally(() => isFlushing = false)
}

function scheduler (fn) {
  jobQueue.add(fn)
  flushJob()
}

function computed (getter) {
  let value
  let dirty = true

  const effectFn = effect(getter, {
    lazy: true,
    scheduler () {
      if (!dirty) {
        dirty = true
        trigger(obj, 'value')
      }
    }
  })

  const obj = {
    get value () {
      if (dirty) {
        value = effectFn()
        dirty = false
      }
      track(obj, 'value')
      return value
    }
  }

  return obj
}

function watch (source, cb, options = {}) {
  let getter
  if (typeof source === 'function') getter = source
  else getter = () => traverse(source)

  let oldValue, newValue
  let cleanup

  function onInvalidate (fn) {
    cleanup = fn
  }

  const job = () => {
    newValue = effectFn()
    if (cleanup) cleanup()
    cb(oldValue, newValue, onInvalidate)
    oldValue = newValue
  }

  const effectFn = effct(
    () => getter(),
    {
      lazy: true,
      scheduler: () => {
        if (options.flush === 'post') {
          const p = Promise.resolve()
          p.then(job)
        } else job()
      }
    }
  )

  if (options.immediate) job()
  else oldValue = effectFn()
}

function traverse (value, seen = new Set()) {
  if (typeof value !== 'object' || value === null || seen.has(value)) return
  seen.add(value)
  for (const k in value) traverse(value[k], seen)
  return value
}