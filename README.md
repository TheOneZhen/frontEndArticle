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
      "type": "delete | add | update", // OP type, not null
      "title": "articleName", // maybe old title, not null
      "data": { // data S insert into DB straightly
        "title": "xxx", // maybe new title
        "update_time": ""
      }
    }
  ],
  "tags": [
    {
      "type": "delete, add, update",
      "title": "",
      "data": {}
    }
  ]
}
```