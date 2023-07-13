# this和对象原型
<!-- 源码全部采用ESNext写，没关系 -->
## this
1. this和作用域的关系

    this是在运行时进行绑定的，作用域是在编译阶段时构建，俩者没有直接关联，不能通过作用域推断this指向。

2. 当一个函数被调用时，会创建执行上下文，上下文中包含函数调用栈（在哪里被调用），函数的调用方法，传入参数等信息，this也是其中的一个属性。

### this绑定规则：
1. 默认绑定
    
    ES6箭头函数的this指向其宿主所在this：
    ```js
    // scope: global
    const obj = {
      fn: () => this === window
    }
    obj.fn() // true
    ```
    对于非箭头函数，this只和函数被调用的位置有关，全局作用域下会被绑定到全局对象（严格模式下不会绑定到全局对象，而是绑定到`undefined`）：
    ```js
    const obj = {
      fn: function () { return this === obj }
    }
    obj.fn() // true
    ```

2. 隐式绑定
    ```js
    function fn() {}
    const obj = { a: 2, fn }
    obj.fn() // fn的this指向obj
    ```
3. 显式绑定
    使用`Function.prototype.call()`和`Function.prototype.apply()`，需要传入对象和函数执行需要的参数。
    > 1. 如果第一个参数传入的是基本数据类型，会进行**装箱**
    <!-- 下面这条存疑 -->
    > 2. 如果传入参数数量不够，会**currying**

    ES6中加入的`Function.prototype.bind()`是一种显式硬绑定，会将函数执行的this永久绑定到一个对象并**返回新的函数**，基本实现为：
    ```js
    Function.prototype.bind = function (context, ...args) {
      const fn = this
      return function (...rest) {
        return fn.apply(context, args.concat(rest))
      }
    }
    ```
    《你不知道的JS》中提到**软绑定**，但是不是我期望的效果，我期望的软绑定是通过中间变量切换上下文
    ```js
    Function.prototype.softBind = function (context, ...args) {
      const fn = this
      fn._context = context;
      return function (...rest) {
        return fn.apply(fn._context, args.concat(rest))
      }
    }
    ```
    ES6中另一种函数声明方法：**箭头函数**，也能实现硬绑定效果，并常作为回调函数
4. new绑定
    1. new运算符更像是一个语法糖，表示接下来的一个函数会进行**构造函数调用**（区别于普通函数调用）
    2. new一个函数的时候，做了哪些事：
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
    3. 这里整上一段pollfill：
        ```js
        Function.prototype.bind = function (oThis) {
          if (typeof this !== "function") {
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable")
          }
          var aArgs = Array.prototype.slice.call(arguments, 1),
              fToBind = this,
              fNOP = function () {},
              fBound = function () {
                return fToBind.apply(
                  this instanceof fNOP && oThis ? this : oThis || window,
                  aArgs.concat(Array.prototype.slice.call(arguments))
                )
              }
          fNOP.prototype = this.prototype
          fBound.prototype = new fNOP()
          return fBound
        }
        ```

## 对象
ES5之后，属性定义加入了**描述符（descriptor）**：
1. 访问描述符（accessor descriptor）
    1. `getter`
    2. `setter`
2. 属性描述符（data descriptor）
    1. `value`
    2. `writable`
    3. `configurable`
    4. `enumerable`
        1. 值为`true`时该属性可出现在`for...in`循环中
        2. Object.keys也会返回所有可枚举属性
> 当给一个属性定义`getter`或`setter`，属性会被定义为**访问描述符**，随即忽略`value`和`writable`特性，取而代之的是关心`set`、`get`、`configurable` 和`enumerable`特性。

在开发中，我们可以通过修改**属性描述符**或者使用标准内置对象方法来约束数据：
1. 对象常量：**`writable: false` + `configurable: false`**
2. 禁止扩展：**Object.preventExtensions**
3. 密封（seal）：**Object.seal = Object.preventExtensions + `configurable: false`**
4. 冻结（freeze）：**Object.freeze = Object.seal + `writable: false`**

引擎层面，有俩类操作
1. \[[Get]]操作
该操作可在**对象及其原型链上**查找属性，直至null为止，如果找到了，返回属性或方法，没找到返回undefined。即**对象属性访问规则**，区别于**词法作用域规则**
2. \[[Put]]操作
    1. 属性是否是访问描述符？如果是并且存在setter 就调用setter；
    2. 属性的属性描述符中writable是否是false？如果是，在非严格模式下静默失败，在严格模式下抛出TypeError异常；
    3. 如果都不是，将该值设置为属性的值。

一般地，可以通过操作符`in`来判断一个属性是否在**某个对象及其原型链**上，或者通过`Object.hasOwnProperty`判断属性是否在**当前对象**上（不包含原型链）。
> 如果一个对象的原型没有`hasOwnProperty`属性（比如`Object.create(null)`），会报错，可以`Object.prototype.hasOwnProperty.call(context, 'property name')`显示绑定

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
或者通过下面这种方式定义，计算属性中如果使用`Symbol`会默认`enumerable: false`
```js
const obj = {
  [Symbol.iterator]: function () { ... }
}
```

## \[[Prototype]]
> `\[[Prototype]]`是一种特性，JS中所有对象都具备这种特性，因为是特性所以更靠近引擎；`Object.prototype`是可以由用户操作的属性；

上述\[[Get]]操作让我们了解JE是如何在原型链上查找属性，然后我们再来了解\[[Put]]以及属性屏蔽，对于`myObject.foo = "bar"`：
1. 如果在\[[Prototype]] 链上层存在名为foo的普通数据访问属性并且没有被标记为只读（`writable: false`），那就会直接在myObject中添加一个名为foo的新属性，它是屏蔽属性。
2. 如果在\[[Prototype]] 链上层存在foo，但是它被标记为只读（`writable:false`），那么无法修改已有属性或者在myObject 上创建屏蔽属性。如果运行在严格模式下，代码会抛出一个错误。否则，这条赋值语句会被忽略。总之，不会发生屏蔽。
3. 如果在\[[Prototype]] 链上层存在foo 并且它是一个`setter`，那就一定会调用这个`setter`。foo不会被添加到（或者说屏蔽于）myObject，也不会重新定义foo这个`setter`。

> 《你不知道的JS》一书中，将“原型继承”改称为“委托”，感觉很合理。继承意味着复制，但是JS中原型只是引用关系，不能叫“继承”

## 修改函数原型方式
1. `A.prototype = B.prototype`：建立的是引用，会相互影响
2. `A.prototype = new B()`：**构造函数调用**。使用这种方式会调用函数从而造成副作用，比如构造函数内部可能会日志打印、修改数据。
3. `A.prototype = Object.create(B.prototype)`：可以完美替代，但是会新建一个对象并丢弃
    1. `Object.create`简单实现：
        ```js
          Object.create = function (obj) {
            function _fn() {} // 这个函数相当于一个中间件，最后会被回收掉（也是与Object.setPrototypeOf产生性能差的原因）
            _fn.prototype = obj
            return new _fn()
          }
        ```
    2. `Object.create`可以通过描述符设置属性，因为描述符是ES5规范，所以这个方法不能向下兼容
4. ES6`Object.setPrototypeOf(A.prototype, B.prototype)`：新规范下最优方案

### 判断对象间委托关系
1. `[Object A] instanceof [Function B]`：`instanceof`操作符左侧是对象，右侧是函数，可以判断对象A对`[[Prototype]]`链中是否有指向`B.prototype`；
    > `instanceof`只能判断对象与函数是否存在委托关系，不能判断对象与对象
    > 对于1.**硬绑定函数**、2.ES6`箭头函数`、一些js内置函数和3.不带`function`声明符（ES6语法糖）的函数声明，没有`prototype`属性。1和2是因为函数的`this`是固定的，相当于没有执行该函数（假设A是满足1或2条件的函数，那么`new A()`相当于`A()`）。按规范来说，这类函数没必要成为构造函数。但是对于3可能是bug，因为`Object.defineProperty`定义的函数具有`prototype`属性，并且没有不成为构造函数的理由
2. `Object.prototype.isPrototypeOf`：检查对象是否在另一个对象的`[[Prototype]]`中
3. ES5中静态方法`Object.isPrototypeOf`：获取对象`[[Prototype]]`

## `Object.__proto__`弃用原因
1. \[[Prototype]]是面向JE的数据结构，`Object.__proto__`是在\[[Prototype]]基础上暴露给用户的**访问器属性**，伴随的是`writable`和`configurable`描述符被修改的风险
2. 但是`Object.__proto__`终究是`Object.prototype`的属性，对于一些特殊对象（比如`Object.create(null)`创建的对象）没有该属性，无法保证其功能的一致性（像`instanceof`一样高不成低不就），同样地，对后续ES6中加入的`Proxy`非常不友好
3. 修改对象`[[Prototype]]`非常损耗性能，`Object.__proto__`走的是`[[Get]]操作`，不方便性能专项优化

## [`class`(ES6)](https://developer.mozilla.org/en-US/docs/Glossary/Class)

```js
A // ReferenceError
class A {
  constructor (...args) {
    this.args = args
  }
  static method1 () { ... }
  method2 () { 
    console.log(1)
  }
}
```

### 特点

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
    A.prototype.method2() // 1
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

当函数被构造调用时，`new.target`才有效：
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

## `Object.prototype`与`Object.__proto__`（存疑）
俩者本质没有区别，但是prototype是ES标准，__proto__是浏览器厂商的杰作
> ES6将__proto__纳入规范
> prototype只有函数有
可以通过obj.__proto__去修改对象的原型链，但是会存在很多问题
1. 原型的修改开销极大，因为需要修改所有继承来自该[[Prototype]]的对象
2. 会导致原型链的污染
3. __proto__显示在浏览器控制台中，实际是浏览器渲染出来的假节点，真正__proto__是get和set结合
4. 推荐使用Object.getPrototypeOf/Reflect.getPrototypeOf和Object.setPrototypeOf/Reflect.setPrototypeOf取代*直接修改__proto__*

类
	ES6新引入
	类内部所有方法都是不可枚举的
	继承
		原型链继承
			function parent() {
        this.name = 1
      }
      parent.prototype.getName = function () {
        return this.name
      }
      function child() {}
      child.prototype = new parent()
      let child1 = new child()
			优点：父构造方法的方法只需要创建一次
			缺点：1、实例会继承所有引用属性；2、创建实例时不能向parent传参
		通过构造函数继承（经典继承）
			function parent() {
  this.name = [1,2]
}
function child() {
  parent.call(this)
}
let child1 = new child()
let child2 = new child()
child.name.push(3)
console.log(child1.name) // [1, 2, 3]
console.log(child2.name) // [1, 2]
			优点：1、子实例避免了属性共享；2、child实例化时可以向parent传参
			缺点：方法在构造函数中定义，每次子实例化都需要创建一次方法
		组合继承（原型链 + 构造函数）
			function Parent (name) {
    this.name = name
    this.colors = ['red', 'blue', 'green']
}
Parent.prototype.getName = function () {
    console.log(this.name)
}
function Child (name, age) {
    Parent.call(this, name) // 1
    this.age = age
}
Child.prototype = new Parent() // 2
Child.prototype.constructor = Child
var child1 = new Child('kevin', '18')
			优点：1、子实例避免了属性共享；2、child实例化时可以向parent传参
			缺点：实例化过程中调用了2次父构造函数
		原型式继承
			function createObj(constructor) {
  function F() {}
  F.prototype = constructor
  return new F()
}
			优点：1、可以传参数（示例中没有体现出来）；2、父构造方法只调用一次
			缺点：引用类型属性会共享
		寄生式继承
			function createObj(constructor)  {
  let clone = Object.create(constructor)
  clone.sayName = function() {
    console.log("run here")
  }
  return clone
}
			优点：1、可以传参；2、引用类型属性不会共享
			缺点：方法在构造函数中定义，每次子实例化都需要创建一次方法
		寄生组合式继承
			function parent() {
  this.name = 1
  this.colors = ['blue', 'red']
}
parent.prototype.sayName = function() {
  console.log(this.name)
}
function child() {
  parent.call(this)
  this.age = 2
}
let F = function () {}
F.prototype = parent.prototype
child.prototype = new F()
			优点：1、可以传参；2、父构造函数的方法只需要创建一次；3、引用类型属性不会共享；4、子实例化过程中只调用父构造函数一次
	ES5实现
		constructor
			class Person {
    constructor(name) {
        this.name = name
    }
    say() {
        return this.name
    }
}
				function Person(name) {
    this.name = name
}
Object.defineProperty(Person1.prototype, 'say', {
    enumerable: false,
    writable: true,
    get () {
        return this.name
    }
})
		静态方法
			...
Person.staticFn = function() {}

this
	箭头函数的this
		this指向不会改变
	类中的this
		类this默认指向此类实例
			如何使类的this总是指向这个类的实例？（私有属性、方法的实现）
				class {
  constructor(){
    this.fn = this.fn.bind(this)
  }
  fn() {}
}
		如果类中存在构造函数，且构造函数返回的是新的类，则this会指向新类，如果返回的是类的实例或者基础数据类型，this都会指向类的实例
		类内部总是“use strict”模式，调用一个this值为undefined的方法会抛出错误
			这个错误不知道怎么抛出
	面试题
		function foo() {
    getName = function() { console.log (1) }
    return this
}
foo.getName = function() { console.log(2) }
foo.prototype.getName = function() { console.log(3) }
var getName = function() { console.log(4) }
function getName() { console.log(5) }
 
1. foo.getName() // 2
2. getName() // 4
3. foo().getName() // 1
4. getName() // 1
5. new foo.getName() // 2
6. new foo().getName() // 3
7. new new foo().getName() // 3
			1. 略
8. 函数式声明在变量式声明之前，log5会被覆盖
9. foo()执行后，foo内getName变量提升至全局
10. 受3影响
11. new会实例化距离其最近的函数
12. 实例化foo，会从其原型链上拉属性方法放到一个新对象上
13. 5、6结合
	this对bind、call、apply的思考
		这些函数执行过程中到底对this及其相关做了什么
			预计原型链相关


## reference
1. https://segmentfault.com/a/1190000018270750