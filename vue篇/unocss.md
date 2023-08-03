## preset-icons原理

### data-url

前缀为data:协议的url，允许向文档中插入小文件
```js
function encodeSvg(svg: string) {
  return svg.replace('<svg', (~svg.indexOf('xmlns') ? '<svg' : '<svg xmlns="http://www.w3.org/2000/svg"'))
    .replace(/"/g, '\'')
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/{/g, '%7B')
    .replace(/}/g, '%7D')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
}

const dataUri = `data:image/svg+xml;utf8,${encodeSvg(svg)}`
```
### 打包时加载图片内容



## reference

https://antfu.me/posts/reimagine-atomic-css
https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs