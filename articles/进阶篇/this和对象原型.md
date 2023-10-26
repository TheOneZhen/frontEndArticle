```zhenisbusy
{ "tagIds": ["前端", "YDKJSY系列"] }
```
# this

`this`是在调用时被绑定的，它的指向取决于函数的调用位置。当一个函数被调用时，会创建执行上下文，上下文中包含函数调用栈（在哪里被调用），函数的调用方法，传入参数等信息，this也是其中的一个属性。

## this绑定规则

1. 默认绑定
    
    ```js
    // global
    function fn () {
      return this === global
    }
    fn() // true
    ```

    默认绑定是直接调用，没有使用任何隐式或显示规则去查找函数或调用函数。但是有一点需要注意，上述代码中函数执行在全局对象下，但是在严格模式下，全局对象无法使用默认绑定，会导致`this`指向`undefined`：

    ```js
    "use strict"
    function fn () {
      return this
    }
    fn() // undefined
    ```

2. 隐式绑定

    隐式绑定一般是通过中间对象执行函数，这个时候函数`this`指向中间对象：

    
    ```js
    const obj = {
      fn: function () { return this === obj }
    }
    obj.fn() // true
    ```

    对于ES6箭头函数，`this`指向其宿主所在对象：

    ```js
    // global
    const obj = {
      fn: () => this === global // this指向obj所在对象，即global
    }
    obj.fn() // true
    ```

3. 显式绑定
    
    使用`Function.prototype.call()`和`Function.prototype.apply()`可以明确`this`指向。`call`的简单实现：

    ```js
    Function.prototype.call = function (context, ...args) {
      const fn = this // 执行显示绑定的函数
      const middle = Object.create(context, {
        fn: { value: fn }
      })
      middle.fn(...args)
    }
    ```
    
    `Function.prototype.bind()`是一种显式硬绑定，会将函数执行的this永久绑定到一个对象并**返回新的函数**，基本实现为：

    ```js
    Function.prototype.bind = function (context, ...args) {
      const fn = this
      return function (...rest) {
        return fn.apply(context, args.concat(rest))
      }
    }
    ```

    《你不知道的JS》中提到**软绑定**，可以显式切换`this`指向：

    ```js
    Function.prototype.softBind = function (context, ...args) {
      const fn = this
      fn._context = context;
      return function (...rest) {
        return fn.apply(fn._context, args.concat(rest))
      }
    }
    ```

    ES6中另一种函数声明方法：**箭头函数**，也能实现硬绑定效果，常作为回调函数，隐式绑定中有介绍，这里不再赘述。

4. new绑定
    
    new运算符更像是一个语法糖，表示接下来的一个函数会进行**构造函数调用**（区别于普通函数调用）：
    
        ```js
        function newCall (fn, ...args) {
          // 1. 创建一个**空的**js新对象
          const instance1 = Object.create(null)
          // 2. 将步骤1新创建的对象链接至构造函数的原型
          Object.setPrototypeOf(instance1, fn.prototype)
          /**
           * 1、2俩步其实就是做这件事
           * `const instance1 = Object.create(fn.prototype)`
           */
          // 3. 调用传入函数，如果函数创建了新对象，则返回新对象（注意调用fn的上下文是instance1而不是newCall所在的上下文，这点如果困惑可以从实例化对象的角度理解）
          const instance2 = fn.apply(instance1, args)
          if (typeof instance2 === 'object' && instance2 !== null) return instance2
          // 4. 否则返回开始创建的实例
          return instance1
        }
        ```

# 对象

ES5之后，属性定义加入了**描述符（descriptor）**：

1. 访问描述符（accessor descriptor）
    1. `getter`
    2. `setter`
2. 属性描述符（data descriptor）
    1. `value`：属性值
    2. `writable`：可读性
    3. `configurable`：可配置性
    4. `enumerable`：可枚举性
        1. 值为`true`时该属性可出现在`for...in`循环中
        2. Object.keys也会返回所有可枚举属性

> 当给一个属性定义`getter`或`setter`，属性会被定义为**访问描述符**，随即忽略`value`和`writable`特性，取而代之的是关心`setter`、`getter`、`configurable` 和`enumerable`特性。

开发中，可以通过修改**属性描述符**或者使用标准内置对象方法来约束数据（严格模式修改这些修饰后的属性会报错，这里没有示例，仅表示非严格模式）：

1. 对象常量：`writable: false` + `configurable: false`
    
    ```js
    const a = { b : 1 }
    Object.defineProperty(a, 'b', { writable: false, configurable: false })
    a.b = 2
    a.b // 1
    ```

2. 禁止扩展：`Object.preventExtensions`

    ```js
    const a = { b: 1 }
    Object.preventExtensions(a)
    a.c = 2
    a.c // undefined
    ```
    
3. 密封（seal）：`Object.seal` = `Object.preventExtensions` + `configurable: false`
4. 冻结（freeze）：`Object.freeze` = `Object.seal` + `writable: false`

JE（js引擎）层面，有俩类操作：

1. `[[Get]]`操作：

    该操作可在**对象及其原型链上**查找属性，直至null为止，如果找到了，返回属性或方法，没找到返回undefined。即**对象属性访问规则**，区别于**词法作用域规则**。
    
2. `[[Put]]`操作：

    1. 如果属性是访问描述符且存在`setter`，调用`setter`；
    2. 如果属性是属性描述符且`writable: false`，在非严格模式下静默失败，在严格模式下抛出TypeError异常；
    3. 如果都不是，将该值设置为属性的值。

一般地，可以通过操作符`in`来判断一个属性是否在**目标对象及其原型链**上，或者通过`Object.hasOwnProperty`判断属性是否在**当前对象**上（不包含原型链）。

> 如果一个对象的原型没有`hasOwnProperty`属性（比如`Object.create(null)`创建的空对象），会报错，可以使用`Object.prototype.hasOwnProperty.call(context, 'property name')`显示绑定。

ES6添加了`for...of`循环，可直接应用到数组上。以下是对象迭代器：

```js
Object.defineProperty(obj, Symbol.iterator, {
  enumerable: false,
  writable: false,
  configurable: true,
  value: function () {
    const self = this
    let index = 0
    const keys = Object.keys(this) // 注意，`Object.keys`的顺序是不可靠的
    return {
        next: function () {
            return {
                value: self[keys[index++]],
                done: index > keys.length
            }
        }
    }
  }
})
```

或者通过下面这种方式定义（计算属性中如果使用`Symbol`会默认`enumerable: false`）：

```js
const obj = {
  [Symbol.iterator]: function () { ... }
}
```

## `[[Prototype]]`

> `[[Prototype]]`是一种特性，JS中所有对象都具备这种特性，特性更靠近引擎；而`Object.prototype`是可以由用户操作的属性，俩者注意区分；

上述`[[Get]]`操作让我们了解JE是如何在原型链上查找属性，然后我们再来了解`[[Put]]`以及属性屏蔽，对于`myObject.foo = "bar"`：

1. 如果在`[[Prototype]]` 链上层存在名为foo的普通数据访问属性并且没有被标记为只读（`writable: false`），那就会直接在myObject中添加一个名为foo的新属性，它是屏蔽属性。
2. 如果在`[[Prototype]]` 链上层存在foo，但是它被标记为只读（`writable:false`），那么无法修改已有属性或者在myObject上创建屏蔽属性。如果运行在严格模式下，代码会抛出一个错误。否则，这条赋值语句会被忽略。总之，不会发生屏蔽。
3. 如果在`[[Prototype]]` 链上层存在foo 并且它是一个`setter`，那就一定会调用这个`setter`。foo不会被添加到（或者说屏蔽于）myObject，也不会重新定义foo这个`setter`。

> 《你不知道的JS》一书中，将“原型继承”改称为“委托”。继承意味着复制，但是JS中原型只是引用关系，“继承”有些歧义。

## 原型的作用

在`this`绑定规则中介绍的new绑定对原型的应用很深刻，当一个函数进行**构造函数调用**会返回一个对象，这个对象的原型会绑定到构造函数上，为的是实现一种“伪继承”。

## 修改函数原型方式

1. `A.prototype = B.prototype`：建立的是引用，会相互影响；
2. `A.prototype = new B()`：**构造函数调用**。这种方式会调用函数造成副作用，比如构造函数内部可能会日志打印、修改数据；
3. `A.prototype = Object.create(B.prototype)`：可以完美替代；
    1. `Object.create`简单实现：
        ```js
          Object.create = function (obj) {
            function _fn() {} // 这个函数相当于一个中间件，最后会被回收掉（也是与Object.setPrototypeOf产生性能差的原因）
            _fn.prototype = obj
            return new _fn()
          }
        ```
    2. 上述简单实现不能向下兼容，因为`Object.create`第二个参数和`Object.defineProperties`描述符设置参数类似，属于ES5规范，参见[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create)。
4. `Object.setPrototypeOf(A.prototype, B.prototype)`：ES6规范最优方案。

## 判断对象间委托关系

1. `[Object A] instanceof [Function B]`：`instanceof`操作符左侧是对象，右侧是函数，可以判断对象A的原型链中是否存在原型指向`B.prototype`；
    
    > `instanceof`只能判断对象与函数是否存在委托关系，不能判断对象与对象之间的联系
    > 对于1.**硬绑定函数**、2.ES6`箭头函数`、一些js内置函数和3.不带`function`声明符（ES6语法糖）的函数声明，没有`prototype`属性。1和2是因为函数的`this`是固定的，相当于没有执行该函数（假设A是满足1或2条件的函数，那么`new A()`相当于`A()`）。按规范来说，这类函数没必要成为构造函数。但是对于3可能是bug，因为`Object.defineProperty`定义的函数具有`prototype`属性，并且没有不成为构造函数的理由（可能在不同宿主环境存在偏差）；

2. `Object.prototype.isPrototypeOf`：检查对象是否在另一个对象的`[[Prototype]]`中；
3. `Object.isPrototypeOf`：ES5提供的静态方法，获取对象`[[Prototype]]`。

## `Object.__proto__`

在一些宿主环境控制台输出中会看到`Object.__proto__`属性，这个属性最开始只存在部分宿主环境中，后续才被ES认可，但是不推荐使用：

1. `[[Prototype]]`是面向JE的数据结构，`Object.__proto__`是在`[[Prototype]]`基础上暴露给用户的**访问器属性**，它的`writable`和`configurable`描述符可能会被修改；
2. `Object.__proto__`是属性，对于一些特殊对象（比如`Object.create(null)`创建的对象）没有该属性，无法保证其功能的一致性（像`instanceof`一样高不成低不就），对后续ES6中加入的`Proxy`非常不友好；
3. 修改对象`[[Prototype]]`非常损耗性能，`Object.__proto__`走的是`[[Get]]操作`，不方便性能专项优化。

推荐使用`Object.getPrototypeOf/Reflect.getPrototypeOf`和`Object.setPrototypeOf/Reflect.setPrototypeOf`取代*直接修改`__proto__`*

## `class`(ES6)

JS中[class](https://developer.mozilla.org/en-US/docs/Glossary/Class)的本质是原型链委托，它的表现更偏向于语法糖，很多操作都可以用上面介绍的原型链、this绑定规则来解释。

```js
A // ReferenceError
class A {
  constructor (...args) {
    this.args = args
  }
  static method1 () { console.log(1) }
  method2 () { console.log(this.args) }
}
A.method1() // 1
const instance = new A(1)
instance.method2 // [1]
```

结合上面代码，可以大致得出以下几点：

- `class`的声明不会提升，声明之前调用会抛出`ReferenceError`，表现和`let`、`const`一致；
- `class A`创建了一个名为`A`的函数，而且这个函数只能通过new调用（构造函数调用）；
    
    ```js
    A instanceof Function // true
    A() // TypeError
    const a = new A()
    ```

- 普通方法（静态方法、构造器不会，会在下面的API中介绍）会被放到类原型中，比如示例代码中的`method2`：
    
    ```js
    A.prototype.method2() // [1]
    A.prototype.method2.propertyIsEnumerable() // false
    ```

- `class`的表现和构造函数相似，只不过语法方面特殊点，比如方法声明不需要加`function`

### extends

一个语法糖，设置`class`的原型，可以使用`Object.setPrototypeOf`实现：

```js
class B extends A {}
function C () {}
// 等同于
Object.setPrototypeOf(C, A)

Object.getPrototypeOf(B) === A // true
Object.getPrototypeOf(C) === A // true
```

### super

```js
class A {
  constructor () {
    console.log('run here A CC')
  }
  log () { console.log('run here A log') }
  do () { return this }
}
class B extends A {
  constructor () {
    // 构造器中，super指向A.constructor，这里相当于实例化一个A实例
    const a = super() // run here A CC
    console.log('a instanceof A: ', a instanceof A) // a instanceof A: true
  }
  log () {
    // 方法中super指向A对象
    super.log() // run here A log
    console.log('run here B log')
  }
}
```

> `class super`很难兼容ES6之前的规范，除了上述原因（`super`在不同类型方法中表现不同），如果调用`super`的方法`this`被修改，可能会导致未知错误。

### new.target

当函数被构造调用时，`new.target`才有效并返回构造函数上下文：

```js
class A {
  constructor () {
    console.log('run here A: ', new.target.name)
  }
}
class B extends A {
  constructor () {
    super() // run here A: B
    console.log('run here B: ', new.target.name) // run here B: B
  }
  log () {
    // 非构造函数，new.target无效
    console.log('new.target is invaild: ', new.target) // new.target is invaild: undefined
  }
}
```

### static

作用是将一个属性直接添加到类上（普通方法是添加到`[[prototype]]`上）：

```js
class A {
  static fn1 () { console.log('run here fn1') }
  fn2 () {}
}
Object.getOwnPropertyNames(A) // ['length', 'name', 'prototype', 'fn1']
A.fn1() // run here fn1
```
 
# 引用

1. [You-Dont-Know-JS: this & object prototypes](https://github.com/getify/You-Dont-Know-JS/tree/1ed-zh-CN/this%20%26%20object%20prototypes)