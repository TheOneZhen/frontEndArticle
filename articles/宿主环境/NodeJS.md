# REPL(Read Eval Print Loop: 交互式解释器)

比如一般宿主环境提供的控制台都是REPL，可以提供持续的环境。

# 回调函数

Nodejs异步的基础

# 事件循环（这个请详细补充）

Nodejs几乎所有的事件机制都是设计模式——观察者模式实现.

# EventEmitter

# Buffer

js本身没有二进制数据，但是在处理TCP流和文件流是，必须使用二进制数据。所以Nodejs提供Buffer类，用来创建一个专门用于存放二进制数据的缓冲区

## Buffer与字符编码

通过显示字符编码转换，可以实现Buffer实例与普通JS字符串之间的转换

```js
const buffer = Buffer.from('aaaaa', 'ascii')

console.log(buffer.toString('hex')) // 6161616161

```

# Stream

Stream是一个抽象接口，比如http服务器发起的请求的request对象是一个Stream。所有的Stream都是EvenetEmitter的实例。

1. 写入流
2. 管道流
3. 链式流

# 模块系统

require策略：https://www.runoob.com/wp-content/uploads/2014/03/nodejs-require.jpg

使用node:fs这种语法可以保证导入的模块是node原生模块，而不是用户提供的模块

# 服务路由：https://www.runoob.com/nodejs/nodejs-router.html

# 全局对象

Nodejs中没有所谓的最外层作用域，因为所有的文件模块都是在非最外层，所以不能直接定义全局变量。

1. `__filename`、`__dirname`
2. `console.trace`: 输出函数调用栈
3. `process`:https://www.runoob.com/nodejs/nodejs-global-object.html

    `process.exit()`退出状态码需要仔细了解以下，用于bash

    `process.uncaughtException`：用于捕捉全局错误，防止程序崩掉

# util

# fs

`fs.unlink(path, callback)`: 删除文件

# restful：https://www.runoob.com/w3cnote/restful-architecture.html