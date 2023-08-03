# 如何判断俩个浮点数相等
[Number.EPSILON](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number)
二进制向十进制转换时会丢失精度
```js
equal = Math.abs(a + b - c) < Number.EPSILON
```
https://juejin.cn/post/7210614375290863673

# 知识点留白
  1. 性能优化相关
     1. props更新时会导致组件的刷新，对于容器来说，单个容器元素的更新会导致容器内全部组件重新渲染
        1. 可以加入状态转换props，使组件在必要的时候更新或者卸载
        2. 或者使用v-once或v-memo指令
     2. 虚拟列表
     3. shallowRef与shallowReactive斩断深层响应式
     4. 避免组件树超功能多次调用（VNode是性能优化关键）
  3. ts类型检查理解
     1. 开发过程中的类型检查
        1. vscode内置ts语言服务实例
        2. volar（外部插件）ts语言服务实例
     2. 编译过程中的类型检查
        1. webpack：只是单文件的检查，不能介入全局
        2. vite
  4. vue类型检查
     1. vue编译器不会抓取导入的文件进行分析源类型，所以导入的module不能做为props泛型（defineProps<{}>()）
     2. props使用基于类型的声明时，不能赋默认值，需要调用额外的方法widthDefault
     3. provide/inject类型标注需要借助InjectionKey（继承自Symbol的泛型类型）
     4. 如何获取组件返回值类型（defineExpose1）：<InstanceType<typeof Component>>
     5. 扩展全局属性

# 学习疑问点
  1. postCss
  2. 对打包工具的认知
     1. 前端经过多年迭代产生了版本断层与技术变更，于是有了各类兼容插件来处理这些问题，随着插件越来越多越不适合手动调用，便有了工程化工具来自动处理这些问题
     2. webpack、rollup、parcel的发展极大改善了前端开发
     3. 
  3. CSS Modules：导入这样的文件会返回一个模块对象
      ```js
        /** example.module.css */
        .red {
          color: red;
        }
        /** .js */
        import styleObj from './example.module.css'
        dom.className = styleObj.red
      ```
  4. Web Worker
  5. ESM具名导入优点
     1. 有效支持TreeShaking
  6. ESM文件动态导入（懒加载）
     1. import写在顶部与动态导入的区别
  7. WebAssembly
  8. 打包过程中chunk的作用
  9. AMD、CommonJS、UMD、ESM
  10. 对vite构建的理解
     1. vite使用EsBuild预构建源码
        1. 索引Module依赖
        2. 将CommonJS 或 UMD 转换为ESM
  11. url变基
  12. ESM
  13. URL构造器
  14. different page using same components what the packing doing in mpa
      1. inject 1: both building
      2. inject 2: building in main?
  15. https://developer.chrome.com/blog/inside-browser-part1/
      1. a series knowledge of browser internal architecture that is separed four partition and this is first part
      2. it include many cartoon images funny and detail
   16. 事件中执行的函数和普通函数有什么区别，比如a标签中会阻碍href的跳转等，以及为什么非空返回值会导致内存泄漏？

## 文章目录结构设计

- 列表引出（：）、标题(`#`)、列表(`1.`)、块(`>`)、文本结束后需要隔一行
- tab是四个空格
- 对于标题
    - 范围`# - ###`再多网页和vscode表现不明显
    - 文章标题、标签、描述使用`#`，这个是对markdown特殊解析使用的
- 内容
    - 背景区块：正常文本介绍，引出以下内容
        - 特点、特征
        - ...特殊API介绍
            - 场景分析（介绍） + 源码（polyfill）
        - 其他

## 基本规则

- 所有知识必须与简历完美绑定
    - 熟悉：知道原理、细节、绝大部分的基础问题
    - 了解：知道一点点原理、绝大部分的基础问题
    - 接触：知道部分API是做什么的
- 分阶段学习
    - 面试前优先简历中熟悉的内容，然后是了解的内容，最后是接触过的内容
    - 面试后记录未能解答的问题
- 所有的学习必须有文章产出，然后更新到个人博客

## 面试内容

1. js（熟悉）
    1. 进阶
        1. 微前端篇
        2. 作用域与闭包
        3. this和原型
        4. 类型与语法
        5. 异步与性能
    2. 手撕
2. 宿主环境
    1. 浏览器
        1. css、html（熟悉）
        2. webworker
        3. 路由原理
        4. 渲染
    2. NodeJS
        1. 多进程
    3. Electron
3. Vue生态
    1. Vue（熟悉）
        1. 响应式实现
        2. 源码
    2. Vite
    3. Pinia或Vuex4
    4. Vue-Router（熟悉）
        1. 路由原理（熟悉）
    5. Vue-use
4. 工程化相关
    1. 构建工具
        1. Webpack
        2. Vite
    2. 打包工具
    3. 微前端
        1. iframe（熟悉）
        2. microApp（了解）
    4. 项目管理
        1. monorepo
        2. 本地npm仓库
    5. loader
        1. css loader
    6. ts（熟悉）
        1. 手撕实现（部分） 
5. 计算机基础知识
    1. 计算机网络
        1. http、https、ssl、websocket等协议
        2. tcp/ip和udp
    2. 操作系统
        1. 并行、并发
        2. 进程、线程
        3. 协程
6. 算法
7. Python
    1. Django
        1. ORM
        2. 中间件
8.  个人网站
    1. 用户系统实现
    2. 简历弄上去：验证码，SSR渲染
    3. 微前端





毕业后参加工作已有俩年时间，期间学习到了很多东西，结识了很多朋友，但技术的一尘不变、无意义业务无意义的叠加、产品性质模糊等带来的多余工作，让我无法对自己的方向产生有效的思考，于是2023年6月中旬，我毅然决然辞去自己第一份正式工作，试图给自己加压，从而产生学习动力再以此`跳级`。所以我待业了俩个月吗？好像是的，又好像不是，因为我压根没去找工作。

离职前一周，我和朋友去了桐庐大奇山，说实话很无聊，是一个朋友推荐的，我好想告诉那个朋友这鬼地方不值这个票价。离职后我一人去了江西武功山，景色不错，而且迎面而来、相向而去的都是大学生，在看见他们时一直假装自己是同龄人或者同类人，但是上山后，满是雾和雨。看见那些结群的学生，我意识到自己的失落，我已经老了，或许这样再模模糊糊个几年，走进30岁，美名的青春已经煮熟，鸿鹄无终又让它夹生。第二天，我瘫了，然后临时改变计划，湖南长沙。长沙是个好地方，茶颜很好喝，黑色经典很好吃，火灾也是很高频。