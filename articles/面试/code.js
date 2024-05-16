/**
 * 前端代码手写
 */

/**
 * 手写`new`操作符
 * MDN：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new#%E6%8F%8F%E8%BF%B0
 * @param {Function} fn 
 * @returns Object
 */
function newOp (fn, ...args) {
  // 创建一个空对象
  const instance1 = {}
  // 如果构造函数prototype存在，将instance1的原型指向它
  if (isObject(fn.prototype)) Object.setPrototypeOf(instance1, fn.prototype)
  // 以instance1为上下文执行构造函数
  const instance2 = fn.apply(instance1, args)
  // 如果生成的实例是对象，返回，如果不是返回最开始创建的对象
  return isObject(instance2) ? instance2 : instance1
}

function isObject (value) {
  const type = typeof value
  return value !== null && (type === 'object' || type === 'function')
}
/**
 * 扩展
 *  - 为什么不使用obj.__proto__替换原型
 *    
 *    在一些宿主环境控制台输出中会看到`Object.__proto__`属性，这个属性最开始只存在部分宿主环境中，后续才被ES认可，但是不推荐使用：
        1. `[[Prototype]]`是面向JE的数据结构，`Object.__proto__`是在`[[Prototype]]`基础上暴露给用户的**访问器属性**，它的`writable`和`configurable`描述符可能会被修改；
        2. `Object.__proto__`是属性，对于一些特殊对象（比如`Object.create(null)`创建的对象）没有该属性，无法保证其功能的一致性（像`instanceof`一样高不成低不就），对后续ES6中加入的`Proxy`非常不友好；
        3. 修改对象`[[Prototype]]`非常损耗性能，`Object.__proto__`走的是`[[Get]]操作`，不方便性能专项优化。
       
        推荐使用`Object.getPrototypeOf/Reflect.getPrototypeOf`和`Object.setPrototypeOf/Reflect.setPrototypeOf`取代*直接修改`__proto__`*
 */

/**
 * Promise A+
 */

