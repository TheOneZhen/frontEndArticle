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
 * DS: WeakMap<object, Map<string, Function>>
 */
const bucket = new WeakMap()

function track () {}

function trigger (target, key) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)

  const effectsToRun = new Set()
  effects && effects.forEach(effectFn => {
    /**
     * ## 避免无限递归
     * activeEffect执行的时候，会触发所有的activeEffect执行，应该将其过滤掉，避免无限递归执行
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
    fn()
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
  }

  effectFn.options = options
  effectFn.deps = []
  effectFn()
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