# Electron主进程

app module: 控制应用程序生命周期（主进程）
BrowserWindow: 创建和管理应用程序入口（渲染进程）


app.on可以订阅应用程序声明周期，比如Darwin OS上应用程序没有主窗口依旧可以运行，这个时候需要订阅`activate`实践鉴定窗口的创新创建

app（主进程）可以做哪些事情：
1. 管理渲染进程（窗口）
2. 监控app生命周期
3. 提供了一些交互OS的API

# 遇见的问题

1. app入口文件和使用的index.html与Vue应用中的入口文件能不能使用同一个？
2. 如何更好地使用ESM、TS
3. `app.whenReady`是不是就是`app.on('ready')`：https://github.com/electron/electron/pull/21972
4. 预加载脚本和工程化结果文件
    1. preload script优先级高于`<script>`
5. Electron开发的大致方向
    1. 增加渲染进程的网页应用代码复杂度
    2. 深化与操作系统和Nodejs的集成

# 上下文隔离（context isolation）

用来隔离预加载脚本和渲染器

预加载脚本与渲染器进程共享window对象，但是受制于`contentIsolation`，预加载脚本不能更改window，需要通过`contextBridge`实现安全交互。

对于安全的考虑：不应该暴露一等API，在使用`contextBridge`应该限制API等级

# 进程间通信

1. 渲染器 -> 主进程


2. 主进程、渲染器之间双向通信
3. 主进程 -> 渲染器
4. 渲染器 -> 渲染器
    1. 在主进程中设置消息代理，对渲染器中的消息进行转发
    2. 将MessagePort暴露给渲染器，让它们之间直接进行通信

> IPC使用结构化克隆的方法序列化进程之间传递的对象，有些对象不适合传递

# 性能优化

# 安全

# web嵌入

1. iframe：H5支持的标签，拥有sanbox，具有良好的安全性。推荐使用。
2. webview：在单独的进程中渲染，拥有很多自定义方法和事件，只能通过IPC进行通信。嵌入会导致DOM结构变动，渲染也相对较慢
3. BrowserView：

# 测试

# 缺少的知识点：nodejs、require和ESM机制（比如加载模块方面）

1. 深入chrome：https://www.google.com/googlebooks/chrome/big_00.html
2. require加载流程：
    1. 找到需要加载的模块文件，判断是否存在缓存，如果存在加载缓存；如果不存在，加载模块，会依次向目录上方查找模块名（rootDir的重要性，程序开发层级不要太深）
    2. `node:fs`这种写法可以尽可能保证模块引用系统内置而不是被其他模块干扰
