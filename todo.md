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
7. 打包过程中chunk的作用
8. AMD、CommonJS、UMD、ESM
9.  对vite构建的理解
    1. vite使用EsBuild预构建源码
    2. 索引Module依赖
    3. 将CommonJS 或 UMD 转换为ESM
10. ESM
    1. 具名导入优点：有效支持TreeShaking
    2. 动态导入
        1. import写在顶部与动态导入的区别
11. URL构造器
    1. url变基
12. 工程化
    1. 多页面使用相同组件，如何打包
13. https://developer.chrome.com/blog/inside-browser-part1/
    1. a series knowledge of browser internal architecture that is separed four partition and this is first part
    2. it include many cartoon images funny and detail
14. 事件中执行的函数和普通函数有什么区别，比如a标签中会阻碍href的跳转等，以及为什么非空返回值会导致内存泄漏？

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

- 完成Vue设计与实现——响应系统文章（文章）
    - 降低优先级，应该优先篇阅读以备面试所需

- 8/22
    - 完成编译器的阅读
    - 简历内容梳理（最好每天都进行一次）

- 8/21
    - 完成渲染器、组件化（t）

- 8/20
    - 响应系统文章完成一部分，内容太多

- 08/19
    - 完成响应系统阅读（t）

- 2023/08/18

- 2023/08/17
    - 继续串联知识点(T)
    - 微前端篇（文章）(T)

- 2023/08/16
    - 开始串联知识点(T)