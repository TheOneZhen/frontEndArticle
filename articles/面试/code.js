/** promise简化版本 */

const PENDING = "PENDING"
const FULFILLED = "FULFILLED"
const REJECTED = "REJECTED"

// class Promise {
//   constructor (execuutor) {
//     this.status = PENDING
//     this.value = undefined
//     this.reason = undefined

//     this.onResolvedCallbacks = []
//     this.onRejectedCallback = []

//     let resolve = (value) => {
//       if (this.status === PENDING) {
//         this.status = FULFILLED
//         this.value = value
//         this.onResolvedCallbacks.forEach(fn => fn())
//       }
//     }

//     let reject = (reason) => {
//       if (this.status === PENDING) {
//         this.status = REJECTED
//         this.reason = reason
//         this.onRejectedCallback.forEach(fn => fn())
//       }
//     }

//     try {
//       execuutor(resolve, reject)
//     } catch (error) {
//       reject(error)
//     }
//   }

//   then (onFulfilled, onRejected) {
//     if (this.status === FULFILLED) onFulfilled(this.value)
//     if (this.status === REJECTED) onRejected(this.reason)
//     if (this.status === PENDING) {
//       this.onResolvedCallbacks.push(() => onFulfilled(this.value))
//       this.onRejectedCallback.push(() => onRejected(this.reason))
//     }
//   }

// }

/** Promise A+版本 */

const resolvePromise = (promise2, x, resolve, reject) => {
  // 自己等待自己完成是错误的实现，用一个类型错误，结束掉 promise  Promise/A+ 2.3.1
  if (promise2 === x) { 
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  // Promise/A+ 2.3.3.3.3 只能调用一次
  let called;
  // 后续的条件要严格判断 保证代码能和别的库一起使用
  if ((typeof x === 'object' && x != null) || typeof x === 'function') { 
    try {
      // 为了判断 resolve 过的就不用再 reject 了（比如 reject 和 resolve 同时调用的时候）  Promise/A+ 2.3.3.1
      let then = x.then;
      if (typeof then === 'function') { 
        // 不要写成 x.then，直接 then.call 就可以了 因为 x.then 会再次取值，Object.defineProperty  Promise/A+ 2.3.3.3
        then.call(x, y => { // 根据 promise 的状态决定是成功还是失败
          if (called) return;
          called = true;
          // 递归解析的过程（因为可能 promise 中还有 promise） Promise/A+ 2.3.3.3.1
          resolvePromise(promise2, y, resolve, reject); 
        }, r => {
          // 只要失败就失败 Promise/A+ 2.3.3.3.2
          if (called) return;
          called = true;
          reject(r);
        });
      } else {
        // 如果 x.then 是个普通值就直接返回 resolve 作为结果  Promise/A+ 2.3.3.4
        resolve(x);
      }
    } catch (e) {
      // Promise/A+ 2.3.3.2
      if (called) return;
      called = true;
      reject(e)
    }
  } else {
    // 如果 x 是个普通值就直接返回 resolve 作为结果  Promise/A+ 2.3.4  
    resolve(x)
  }
}

class Promise {
  constructor (execuutor) {
    this.status = PENDING
    this.value = undefined
    this.reason = undefined

    this.onResolvedCallbacks = []
    this.onRejectedCallback = []

    let resolve = (value) => {
      if (this.status === PENDING) {
        this.status = FULFILLED
        this.value = value
        this.onResolvedCallbacks.forEach(fn => fn())
      }
    }

    let reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason
        this.onRejectedCallback.forEach(fn => fn())
      }
    }

    try {
      execuutor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then (onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value
    onRejected = typeof onRejected === "function" ? onRejected : error => error

    let promise = new Promise((resolve, reject) => {

      const resolveOnFulFilled = () => setTimeout(() => {
        try {
          resolvePromise (promise, onFulfilled(this.value), resolve, reject)
        } catch (error) {
          reject(error)
        }
      })

      const rejectOnRejected = () => setTimeout(() => {
        try {
          resolvePromise (promise, onRejected(this.reason), resolve, reject)
        } catch (error) {
          reject(error)
        }
      })

      if (this.status === FULFILLED) resolveOnFulFilled()
      if (this.status === REJECTED) rejectOnRejected()
      if (this.status === PENDING) {
        this.onResolvedCallbacks.push(resolveOnFulFilled)
        this.onRejectedCallback.push(rejectOnRejected)
      }
    })
  }

}

const promise = new Promise((resolve, reject) => {
  reject('失败');
}).then().then().then(data=>{
  console.log(data);
},err=>{
  console.log('err',err);
})


function _asyncToGenerator(fn) {
  // return一个function，和async保持一致。我们的run直接执行了Generator，其实是不太规范的
  return function(...args) {
    const self = this
    return new Promise(function(resolve, reject) {
      const gen = fn.apply(self, args);

      //相当于我们的_next()
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value);
      }
      //处理异常
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err);
      }
      _next(undefined);
    });
  };
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
