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
10. url变基
11. ESM
    1. 具名导入优点：有效支持TreeShaking
    2. 动态导入
        1. import写在顶部与动态导入的区别
12. URL构造器
13. 工程化
    1. 多页面使用相同组件，如何打包
14. https://developer.chrome.com/blog/inside-browser-part1/
    1. a series knowledge of browser internal architecture that is separed four partition and this is first part
    2. it include many cartoon images funny and detail
15. 事件中执行的函数和普通函数有什么区别，比如a标签中会阻碍href的跳转等，以及为什么非空返回值会导致内存泄漏？

# 进度分析

准备了将近一个半月的时间，其中有半个月用于构建网站。先存在以下问题：

1. 知识点覆盖不够全面：工程化、vue原理为首要问题
2. 简历没有二次核对
3. 个人作品缺乏

【2023/08/15】: 开始投递简历
webpack从0 - 1
vite性能优化并加入到个人网站
所有知识点连接到一起（复习）
~~看能不能今天投出一份简历~~


[2023/08/11 - 12]：完成知识点覆盖
【13】：核对简历，准备个人介绍，梳理个人项目
【14】：开始投简历

面试阶段：面试总结、查缺补漏、深入vue、网站迭代

