# 文章目录结构设计

- 列表引出（：）、标题(`#`)、列表(`1.`)、块(`>`)、文本结束后需要隔一行
- tab是四个空格
- 对于标题
    - 范围`# - ###`再多网页和vscode表现不明显
- 内容
    - 背景区块：正常文本介绍，引出以下内容
        - 特点、特征
        - ...特殊API介绍
            - 场景分析（介绍） + 源码（polyfill）
        - 其他

# 留白

1. 性能优化相关
    1. props更新时会导致组件的刷新，对于容器来说，单个容器元素的更新会导致容器内全部组件重新渲染
    2. 可以加入状态转换props，使组件在必要的时候更新或者卸载
    3. 或者使用v-once或v-memo指令
    4. 虚拟列表
    5. shallowRef与shallowReactive斩断深层响应式
    6. 避免组件树超功能多次调用（VNode是性能优化关键）
2. ts类型检查理解
    1. 开发过程中的类型检查
    2. vscode内置ts语言服务实例
    3. volar（外部插件）ts语言服务实例
    4. 编译过程中的类型检查
    5. webpack：只是单文件的检查，不能介入全局
    6. vite
3. vue类型检查
    1. vue编译器不会抓取导入的文件进行分析源类型，所以导入的module不能做为props泛型（defineProps<{}>()）
    2. props使用基于类型的声明时，不能赋默认值，需要调用额外的方法widthDefault
    3. provide/inject类型标注需要借助InjectionKey（继承自Symbol的泛型类型）
    4. 如何获取组件返回值类型（defineExpose1）：<InstanceType<typeof Component>>
    5. 扩展全局属性
4. postCss
5. Web Worker
6. WebAssembly
9.  URL构造器
    1. url变基
10. https://developer.chrome.com/blog/inside-browser-part1/
    1. a series knowledge of browser internal architecture that is separed four partition and this is first part
    2. it include many cartoon images funny and detail
11. 事件中执行的函数和普通函数有什么区别，比如a标签中会阻碍href的跳转等，以及为什么非空返回值会导致内存泄漏？

# list

- 简历内容梳理（最好每天都进行一次）
- 不同宿主环境下的事件循环（文章）
- 网站博客内容结构调整（非面试内容）
    - 二级域名（t）
    - 工程化相关实践
        - 资源结构调用优化
            - 文章编写的时候可以直接通过文章名链接文章，打包的时候替换成domain + article name
            - 打包的时候把所有的静态文件收纳到静态服务器中，并替换路径
        - 打包
            - 捕捉引用的资源到单独目录
            - 捕捉文章到单独目录
        - 更新
            - 文章前面添加标识，拥有标识的才打包（探索一下有什么办法能知道每次更新了哪些文件，减少不必要的更新）


- vite插件
- webpack loader
    - 文章工程化打包
    - 最后生成俩个目录，静态资源文件（图片等）上传到服务端static.。
    - 文章相关内容重新构建，生成动态内容，触发脚本执行内容插入。

# 面试内容参解

1. 项目复盘（基本内容整理完毕，开始每日复读）
2. 八股文（基本内容整理完毕，开始每日复读）
3. 工程化实践 + 网站优化：vite插件、loader；webpack插件、loader；Jest；Vue插件；TS；微前端
4. Electron
5. Nodejs + Nestjs
6. Python + Django
7.  V8
    1. 垃圾回收机制
    2. 缓存更新策略

# 其他内容

1. todo内部积累问题分解

# 网站后续设计以及优化

- 优化数据库结构，专一化userAction
- 处理文章中对自己资源的引用
- 思考：如何对一个算法进行测试，或者说有效的产生测试用例
- static.存在的问题


# 今日内容

1. 知识点复习
2. 网站bug修复，更新一个demo上去
3. 找内推