### 盒子模型
- IE盒（怪异盒）
  - box-sizing: border-box
  - width = border + padding + content
- 标准盒（W3C）
  - box-sizing: content-box
  - width = content

### 选择器

### 布局模型
- flex
  > 之前的归纳没有对模型适用范围做介绍，对其他布局也不是很清晰，需要深究
  - felx是一种一维布局模型，只能支持行或者列的布局（常被用来比较grid-二维布局）。通过display：flex创建flex容器，容器下的元素被称为flex元素（注意区分flex容器属性和flex元素属性）
    > 一下俩点存疑，单文件组件中，一般组件宽度是flex布局，包裹组件的容器宽度可能会直接写死或者支持响应式，下面这俩点需要深究
    - 如果容器宽度是100%，如块元素，建议设置flex
    - 如果容器宽度不是100%，或者不用、不能显示设置宽度，如行内元素、行内块元素，建议设置inline-flex
  - 主轴和交叉轴
    - 主轴必然与交叉轴垂直
    - flex-direction
      - 用来设置主轴方向
    - 除了flex-direction，还会受到writing-mode、direction和HTML的dir影响
  - 容器属性
    - flex-warp
      - 控制超出元素的换行。
    - flex-flow = (flex-direction flex-warp)
    - align-items
      - 交叉轴方向元素布局
    - justify-content
      - 主轴方向元素布局。只能控制单行文本的对齐
      - space-between: {item  item  item}
      - space-around: {  item    item    item  }
      - space-evenly: {  item  item  item  }
    - align-content
      - 之前归纳的不是很清晰
    - align-self
      - 可以对元素个体做对齐处理
  - 容器内元素属性
    - flex-basis：定义了元素基本尺寸
      - height | width也可以定义元素基本尺寸，但是优先级低于flex-basis，且当其它元素属性作用时，width就会无效。
      - min-*，max-*会影响flex-basis
      - flex-basis定义了元素基本尺寸，flex元素默认尺寸为auto。
    - flex-grow
      - 容器多与空间分配
    - flex-shrink
      - 容器缩小时收回的尺寸
    - flex = (flex-grow flex-shrink flex-basis)
  - BFC上一些布局属性在FFC上无法适用
    > 之前归纳太混乱
- grid
  - 一种二维布局模型
  - 容器属性
    - grid-template-columns
    - grid-template-rows
    - 隐式网格
    - 网格间距
      - grid-column-gap
      - grid-row-gap
  - 元素属性
  - 特殊单位
    - minmax(min, max)
    - fr
      - fraction
- 不同布局属性如何选择
### inline, block, inline-block
- inline
  - 一个行内元素只占据它对应标签的边框所包含的空间，且仅能向俩侧扩展
    - 设置宽高无效
    - margin只能设置左右（margin: auto不能居中的原因）
    - 不会自动进行换行
    - b, big, i, small, tt, abbr, acronym, cite, code, dfn, em, kbd, strong, samp, var, a, bdo, br, img, map, object, q, script, span, sub, sup, button, input, label, select, textarea
- block
  - 块级元素占据其父元素（容器）的整个水平空间，垂直空间等于其内容高度，因此创建了一个“块”
  - 块状元素只能出现在<body>元素中
  - 默认换行
  - 可以调整宽高、margin、padding
  - 多个块状元素排列默认从上至下
- inline-block
  - 前俩优势结合
  - 不自动换行
  - 可以调整宽高、margin、padding
  - 默认从左向右排列
- 一般情况下，行内元素只能包含其它行内元素。而块级元素都能包含。（这种结构上的包含继承可以使块级元素创建比行内元素更大型的结构）
- 再来考虑文本换行
- 字体宽高问题
  - 如何解决数字的不等宽
    - font-variant-numeric: 'tabular-nums'
    - font-feature-settings: "tnum"
### css repeat
### animation
- animation
- transition
  - 局限性
    - 没有办法在网页加载后自动触发
    - 只能定义起始和终止状态，不能定义中间状态
    - 变化只能触发一次
- transform
### filter
### pointer-events
### 面向内核的属性
1. chromium
   1. content-visibility


resize: horizontal;