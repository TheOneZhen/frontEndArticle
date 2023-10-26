# CSS原子化

CSS原子化（Atomic CSS）乍一听是一个很高级的话题，究其本质，其实就是全局样式。比如很多项目使用了`SCSS`，那么在项目的样式文件夹下，可能会看到这样的代码：

```css
/* global.scss */
.g-pointer {
  cursor: pointer;
}

@for $i from 1 through 10 {
  .m-#{$i} {
    margin: $i / 4 rem;
  }
}

.g-jc-sb {
  display: flex;
  justify-content: space-between;
}

.g-jc-sa {
  display: flex;
  justify-content: space-around;
}
```

组件开发时，一些CSS组合会被高频使用，如果为每个组件写这么一套样式，会加大代码维护工作量，因此需要将通用样式抽离出去。当然全局样式也有缺点，比如上面代码中flex布局交叉轴不同文本排列方式需要定义多个class。还有类似`@for $i from 1 through 10`这样的代码，它只能生成一个范围内的样式，超出这个范围就无能为力，满满的局限性。

# UnoCSS

好了，主角登场。Anthony Fu的一篇文章：[Reimagine Atomic CSS][Reimagine Atomic CSS]，描述了[Tailwind](https://tailwindcss.com/)这类CSS原子化工具的局限性，然后提出**动态生成样式**，从而解决原子化中代码冗长、定制困难的痛点——[UnoCSS](https://unocss.dev/)。来一段官网示例的代码：

```ts
// uno.config.ts
export default defineConfig({
  rules: [
    [/^m-([\.\d]+)$/, ([_, num]) => ({ margin: `${num}px` })]
  ],
})
```

```html
<div class="m-1">Hello</div>
<div class="m-7.5">World</div>
```

```css
.m-1 { margin: 1px; }
.m-7.5 { margin: 7.5px; }
```

从这里大致可以猜测出UnoCSS的原理。UnoCSS核心是静态替换，它会提取class和带预设前缀的属性，然后抛出钩子函数应用自定义规则（比如上述配置中的`rules`），再将处理结果按不同的`mode`输出。UnoCSS目前没有正式版本发布（截至本blog版本为v0.54.1），现在上手源码属实冒昧，再加上不同构建工具的影响，这里只做指引不做分析，感兴趣可以跳过去看看：

- vite下模式为`mode: 'global'`对应的插件：[GlobalModeBuildPlugin](https://github.com/unocss/unocss/blob/main/packages/vite/src/modes/global/build.ts)
- Uno核心：[UnoGenerator](https://github.com/unocss/unocss/blob/main/packages/core/src/generator/index.ts)

如果你是[Tailwind](https://tailwindcss.com/)或Windi CSS使用者，UnoCSS中也包含一些它们的样式预设，比如

```css
.ma4 { margin: 1rem; }
.ml-3 { margin-left: 0.75rem; }
.ms-2 { margin-inline-start: 0.5rem; }
.mt-10px { margin-top: 10px; }
```

UnoCSS还有一个特色：**将icon作为css的一部分**。Anthony Fu的另一篇文章详细介绍了纯CSS图标：[Icons in Pure CSS][Icons in Pure CSS]。对于前端开发面临大量的静态资源引用，一般要这么做：

1. 从UI库中下载icon
2. 构建icon目录以支持后续UI走查，并放置icon
3. 代码中引用静态资源

总之很繁琐。[UnoCSS-presetIcons](https://unocss.dev/presets/icons)简化了1、2俩步，可直接通过类似上述原子化CSS的方式去引用icon。你可以查看我的[网站](https://zhenisbusy.space)顶部菜单栏里那几个icon，和原子化CSS处理一样，这些icon也可以被重复使用：

```html
<span icon-tabler:brand-juejin></span>
```

UnoCSS-presetIcons原理，Anthony Fu介绍的很详细，即`data-url`。

## Data URL

[data-url][Data URL]不是一个CSS属性，而是前缀为**data:协议**的url，允许向文档中插入小文件：

```js
url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M16.612 2.214a1.01 1.01 0 0 0-1.242 0L1 13.419l1.243 1.572L4 13.621V26a2.004 2.004 0 0 0 2 2h20a2.004 2.004 0 0 0 2-2V13.63L29.757 15L31 13.428ZM18 26h-4v-8h4Zm2 0v-8a2.002 2.002 0 0 0-2-2h-4a2.002 2.002 0 0 0-2 2v8H6V12.062l10-7.79l10 7.8V26Z'/%3E%3C/svg%3E")
```

上可看出插入内容是一个svg元素。UnoCSS-presetIcons在项目打包时会下载或加载静态资源，然后将静态资源的代码组合成属性样式并塞入CSS文件。还有一些其它属性辅助data-url，这里不再介绍。如果你想使用自己的icon库，需要将UI库中的icon转换为module并上传到本地npm库（可以参考iconify-json），然后配置[safelist](https://unocss.dev/guide/extracting#safelist)。如果没有icon库可以使用开源的图标库[icones](https://icones.js.org/)。

# 配置分享

以下分享我个人的配置，不过这个配置最后可能会让你的模板变得很奇怪，请斟酌个人喜好参考。

```ts
/**
 * Vue 3.3.4
 * Vite 4.3.5
 * unocss 0.5
 */
import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'
// https://unocss.dev/
// https://icones.js.org/
// unocss的核心是静态替换
/** 样式属性范围 */
const range = [
  'width',
  'height',
  'line-height',
  'padding',
  'margin',
  'left',
  'top',
  'bottom',
  'right',
  'row-gap',
  'column-gap',
  'max-width',
  'user-select',
  'flex',
  'font-size',
  'text-align',
  'opacity',
  'background',
  'position',
  'min-width',
  'display',
  'align-items',
  'min-height',
  'max-height',
  'cursor'
]

const rangeReg = new RegExp('g-(' + range.join('|') + ')-(.*)')
/** 按分隔符'-'拆分样式字符 */
function generateStyleNew (matched: RegExpMatchArray | null) {
  const result: Record<string, string> = {}
  if (matched !== null && !!matched.input && matched.length === 3) {
    result[matched[1]] = matched[2]
      .split(new RegExp('-', 'g'))
      .filter(Boolean)
      .join(' ')
  }
  return result
}

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      prefix: 'icon-',
      extraProperties: {},
      warn: true,
      cdn: 'https://esm.sh/'
    })
  ],
  rules: [
    [rangeReg, matched => generateStyleNew(matched)]
  ]
})
```

假如你在模板中有这么一段样式：

```html
<!-- template -->
<div class="g-margin-3%-40vw-30rem">/<div>
```

最后会被解析为：

```css
.g-margin-3%-40vw-30rem-20px {
  margin: 3% 40vw 30rem;
}
```

这个配置只负责key-value的拆分，不会影响像`margin`这样的补全规则（如上面代码最后会变成`margin: 3% 40vw 30rem 3%;`）。好了，UnoCSS分享结束。

# 引用
1. [Reimagine Atomic CSS][Reimagine Atomic CSS]
2. [Icons in Pure CSS][Icons in Pure CSS]
3. [Data URL][Data URL]


[Reimagine Atomic CSS]: https://antfu.me/posts/reimagine-atomic-css
[Icons in Pure CSS]: https://antfu.me/posts/icons-in-pure-css
[Data URL]: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/Data_URLs