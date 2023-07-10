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