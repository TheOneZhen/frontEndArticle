
const resolvePromise = (promise, value, resolve, reject) => {
  if (promise === value) return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  if ((value !== null && typeof value === 'object') || typeof value === 'function') {
    let called = false
    const then = value.then
    try {
      if (typeof then === 'function') then.call(
        value, 
        result => {
          if (called) return
          called = true
          resolvePromise(promise, result, resolve, reject)
        },
        reason => {
          if (called) return
          called = true
          reject(reason)
        }
      )
      else resolve(value)
    } catch (error) {
      if (called) return
      called = true
      reject(error)
    }
  } else resolve(value)
}

class Promise {

  constructor (executor) {
    this.status = 'PENDING'
    this.result = undefined
    this.reason = undefined
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []

    const resolve = result => {
      // if (result instanceof Promise) return result.then(resolve, reject)
      if (this.status !== 'PENDING') return
      this.status = 'FULFILLED'
      this.result = result
      this.onResolvedCallbacks.forEach(fn => fn())
    }
    const reject = reason => {
      if (this.status !== 'PENDING') return
      this.status = 'REJECTED'
      this.reason = reason
      this.onRejectedCallbacks.forEach(fn => fn())
    }

    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  static resolve (executor) { return new Promise(resolve => resolve(executor)) }

  static reject (reason) { return new Promise((_, reject) => reject(reason)) }

  then (onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : error => { throw error }
    const promise = new Promise((resolve, reject) => {
      const fulfilled = () => setTimeout(() => {
        try { resolvePromise(promise, onFulfilled(this.result), resolve, reject) } catch (error) { reject(error) }
      });
      const rejected = () => setTimeout(() => {
        try { resolvePromise(promise, onRejected(this.reason), resolve, reject) } catch (error) { reject(error) }
      });
      
      if (this.status === 'FULFILLED') fulfilled()
      else if (this.status === 'REJECTED') rejected()
      else if (this.status === 'PENDING') {
        this.onResolvedCallbacks.push(fulfilled)
        this.onRejectedCallbacks.push(rejected)
      }
    })

    return promise
  }
}

Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve,reject)=>{
      dfd.resolve = resolve;
      dfd.reject = reject;
  })
  return dfd;
}

module.exports =  Promise


function debounce (fn, wait) {
  let timer
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), wait)
  }
}

function throttle (fn, wait) {
  let timer
  return function (...args) {
    if (timer) return
    timer = setTimeout(() => {
      fn.apply(this, args)
      clearTimeout(timer)
    }, wait)
  }
}

Function.prototype.bind = function (context, ...args) {
  return function (...arg1) {
    return this.apply(context, args.concat(arg1))
  }
}

function sum(...args) {
  const f = (...rest) => sum(...args, ...rest);
  f.valueOf = () => args.reduce((x, y) => x + y, 0);
  return f;
}

// 实现一个异步函数并控制并发数
// instanceOf


/** async-await */

function asyncToGenerator (func) {
  return function (...args) {
    const generator = func.apply(this, args)
    return new Promise((resolve, reject) => {
      (function step(key, arg) {
        let result
        try { result = generator[key](arg) } catch(error) { reject(error) }
        const { value, done } = result
        if (done) resolve(value)
        else {
          return Promise.resolve(value).then(
            val => step('next', val),
            reason => step('throw', reason)
          )
        }
      })('next')
    })
  }
}

function newCall (func, ...args) {
  const instance1 = Object.create(func.prototype)
  const instance2 = func.apply(instance1, args)
  if (typeof instance2 === 'object' && instance2 !== null) return instance2
  return instance1
}

function once (func) {
  return function middle(...args) {
    const result = func.apply(this, args)
    middle = () => result
    return middle()
  }
}

function flatten (arr, level = 1) {
  if (level === 0) return arr
  const result = []
  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flatten(item, level - 1))
    } else result.push(item)
  }
  return result
}


(async function () {
  const sleep = (wait) => new Promise(resolve => {
    setTimeout(() => {
      console.log(10)
    }, wait);
    setTimeout(() => resolve(1), 0)
  })
  await sleep(1000)
})()