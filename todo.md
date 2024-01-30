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

# 自动化部署相关

`update.json` example:

```json
{
  "articles": [
    {
      "type": "delete", // OP type
      "title": "articleName", // maybe old title
      "data": { // data S insert into DB straightly
        "title": "xxx", // maybe new title
        "update_time": ""
      }
    }
  ],
  "tags": []
}
```

# todo list
1. 静态资源更新优化
    1. 不要全量替换，会破环站点缓存
2. postCss
3. WebAssembly
4. URL构造器
    1. url变基
5. https://developer.chrome.com/blog/inside-browser-part1/
    1. a series knowledge of browser internal architecture that is separed four partition and this is first part
    2. it include many cartoon images funny and detail
6. this site record some used GPU CSS Property(https://csstriggers.com/)
7. vue源码https://github.com/ygs-code/vue
8. 考虑CSS media的能力范围

# articles to do list
1. 《WebKit技术内幕》
2. animated signature 浅尝（该文目的是快速获得star）
3. Vue-Router
4. redux源码解析(待定，类状态管理应该改为对Vue3状态管理的思考)
5. theme模块构建
6. Vue原理与设计
    1. effectScope
7. 迭代、如何设计程序以及如何实现优雅的代码
8. https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API#%E5%BA%93
    1. canvas有很多库可以参考

# 学习方向规划
1. 巩固现有学习内容
    首要资料来自自己的内容总结，然后是别人的面经。但是更需要系统性学习，建议每天上午系统学习。
2. 向跨端扩展（PC）
    flutter可以优先放进简历里。首先是学习PC端跨端框架：
    1. 框架架构
    2. 核心原理：主要的原理，类似Vue-Router中路由事件监听

    目前主要学习electron和Flutter框架PC部分，并且向移动端拓展（只了解能力 ，不会涉及API）

    面试期间不断完善memore设计，不限制照抄别人的代码。


# 梦幻星辉石分解

| 等级 | 成本 | 星辉石售价 | 装备溢价 |
| ---- | ---- | ---------- | -------- |
| 5    | 6    | 80         | 100      |
| 6    | 20   | 240        | 300      |
| 7    | 60   | 760        | 900      |
| 8    | 200  | 2300       | 3000     |
| 9    | 600  | 7500       | 9000     |
| 10   | 2000 | 22000      | 30000    |


梦醒后，我简单流下一滴眼泪，然后忘却梦中涌于身体四面八方那难扼的涩感