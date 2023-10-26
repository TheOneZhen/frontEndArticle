#### 优化源码体积

1. 数据劫持改变
   Vue2中通过Object.defineProperty劫持数据的getter和setter，
   1. 必须指定拦截的key，所以不能拦截对象中属性的添加和删除（Vue2提供了$set和$delete方法）
   2. 对于深层数据有较大的性能负担


	响应式原理
		深层响应如何实现
		基于proxy的响应式局限性
			对基本数据类型无效，基本数据类型需要额外封装
			vue响应式系统通过属性访问进行追踪，地址改变时响应式链接会丢失（引用改变，结构赋值会使原响应式对象无效）
		ref与reactive
			对于此，vue为结构赋值提供了额外的方法
			ref会包装基础数据类型，对于对象则适用reactive包装
		问题记录
			watch加上deep描述之后可以监听到容器内元素的变化吗？
	组件基础
		DOM解析
			Vue模板解析器只支持部分标签的自闭（<tem />）解析，所以对于所有的自定义标签，闭合尽量采用<tem></tem>的方式闭合，不然会被解析器判定为标签未结束
		生命周期
			setup
				setup中可以直接await（第一个await会让组件成为异步依赖），还可以通过suspense或者生命周期钩子函数实现异步
				setup是一个composition API，在它内部可以调用各种生命周期钩子
		组合式与选项式
			选项式基于组合式开发而成，且选项式是一种语法糖
			<script setup>对应组合式
	深入组件
		组件注册
			全局注册
				全局注册的组件在子组件内不需要引入即可使用，但是对于未使用的全局组件，在生产打包时Tree-Shaking不会将其自动移除
				全局组测和全局变量一样，多了会导致项目后期维护复杂化
			局部注册
		props
			类型注解
				首字母大写的js默认类型与小写的有什么区别
		插槽（slot）
			问题总结
				如何判断slot中是否传入组件
					一般建议利用slot默认组件特性去判断
					如果是在父组件中进行监听，还是建议数据的监听，这样逻辑也会更通顺一些
		依赖注入（provide/inject）
		异步组件
	逻辑复用
		组合式函数（VUE3模块化最佳体现，也是组被叫做组合式的原因）
			函数应该是一个同步函数（或者异步不会破坏返回值的响应式），可以使VUE能够确定当前正在执行的是哪个组件，以致于：
3. 将声明周期钩子注册到该组件实例
4. 将计算属性和监听器注册到该组件实例，并在卸载时移除监，避免内存泄漏
			mixin缺点
				数据源不清晰
				命名空间冲突
				隐式的跨mixin交流
			和无渲染组件的对比
			和React Hooks的对比
		自定义指令
			相较于组合式函数对逻辑的复用，自定义指令侧重于对DOM操作逻辑的复用，而且更深入DOM的生命周期（指令钩子）
			在setup中，任何以v开头的驼峰式变量都可以被用作一个自定义指令（语法糖）。在选项式中，需要通过directives选项注册（注册不需要v）
			指令钩子
				created
				beforeMount
				mounted
					在绑定元素以及其全部子组件挂载之后
				beforeUpdate
				updated
				beforeUnmount
				unMounted
			钩子参数
				el
					指令绑定的元素（DOM）
				binding(v-directive: arg.modifiers = value)
					value
						传给指令的值（等于号后面），可以是表达式（表达式被传入后会自定执行，实际传进来的也是基础数据类型或引用类型）
					oldValue
						之前的值（只适用于更新）
					arg
						传递给指令的参数（可以基于参数的响应式做相应的改变，参考组合式函数中的unref）
					modifiers
						传过来的修饰符
					instance
						使用此指令的组件实例（component）
					dir
						指令的定义对象
				vnode
				prevNode
			问题记录
				指令内存泄漏风险（指令中监听事件卸载时机以及引用存储）
					在指令所在的module中维护一个记录指令事件的表结构
					通过元素的dataset attribute实现
				vue3支持多根节点，但指令应用到多根节点组件时会被忽略且抛出警告
					不推荐在封闭组件上使用自定义指令
					对封闭组件进行包装
			除了el外，其它参数都是只读的（或者不建议修改）
		插件
	内置组件
		transition
		teleport
			与vue2种portal的比较
	应用规模化
		单文件组件（SFC）
			使用SFC必须使用构建工具
			SFC的优势
				可以编写模块化的组件，使强相关的关注点内聚到一起
				预编译模版，避免运行时编译开销
				作用域CSS，防止污染
				在使用组合式API时语法更简单
				通过交叉分析模版和洛基代码能进行更多编译时优化
				开箱即用的模块热更新（HMR）支持
			SFC是如何工作的
				编译时，.vue文件交由@vue/compiler-sfc编译成js和css文件
				SFC编译后的js是一个标准的ES模块，可以在其他js文件中被导入
				SFC中的<style>在开发时会注入成原生的H5标签以支持热更新，生产环境下它们会被抽取成一个单独的css文件
			集成了SFC的编译工具
				vite
				vue-cli
				vue
		工具链（推荐在项目搭建初期时详细阅读，方便环境搭建）
		前端路由
			与服务端路由区别
				路由代表资源，服务端的路由对应前端的一些资源，比如一个html、css、js文件
				前端路由改变不会向后端发送资源请求
		服务端渲染（SSR）
			用户访问的时候，服务端动态打包静态资源给用户
			优点
				快，尤其是对重视首屏加载这类资源来说
				更好的SEO
			缺点
				需要更高的服务器负载
				开发与构建需要nodejs支持
				一些特定的生命周期钩子无效
			静态站点生成（SSG）
				预渲染，给所有用户的都是统一的静态资源（类似SPA的index）
				当数据变化时，需要重新生成页面
	最佳实践
	TS支持
	VUE3进阶
	provide、inject实现原理
	diff算法
	问题记录
		emit事件向上多层传递
		ts文件导出的defineComponent在开发环境可以正常使用，生产环境不能渲染
		defineComponent在组件中使用时是局部组件，局部组件的渲染受其所在组件影响


首先了解大部分API，然后去了解它们的原理，再将原理串联起来。

props

基于数组、对象、类型的声明方式，基于类型的声明方式编译之后会尽可能向基于对象的声明方式对齐。

1. 什么场景下，core需要区分props、attribute、事件，如何区分
2. props单向数据流原理
3. 对象形声明type原理是instanceof，所以null不好应该用undefined

v-model

还可以通过计算属性的方式在自组件中使用v-model
// parent
<Som v-model="haha" />

// son

```js
<script setup>
const haha = computed({
	get () {
		return props.haha	
	},
	set (value) {
		emit ('update:haha', value)
	}
})
```

透传

透传会默认将内容绑定到组件的根元素上，可以通过
defineOptions({ inheritAttrs: false })禁用
可以通过v-bind="$attrs"的方式绑定，如果attrs没有绑定会抛出错误

1. 透传原理。续props 1中的问题


插槽

1. 插槽带来的父子组件生命周期问题
2. 无渲染组件：包含插槽的组件只包含逻辑，然后将逻辑通过<slot>抛出，当前组件中不进行渲染。
	
		这种模式的复用相对于组合式函数会产生额外的开销（需要进行属性传递）。

依赖注入

1. 原理
2. 为什么可以保持响应式

异步组件

1. 原理
2. 和<suspense>的组合

组合式函数

1. toValue()与unref()区别：显式的在watch中监听ref，或者在watchEffect中使用toValue()出发监听
2. ref与reactive在组合式函数中的权衡：后者不太适合作为组合式函数的返回值，因为结构可能导致响应式的丢失
3. 组合式函数的事件监听在组件销毁中要及时销毁
4. mixin（https://cn.vuejs.org/guide/reusability/composables.html#comparisons-with-other-techniques）
    1. 用来组合功能，达到内容的复用
5. extends：（只适用选项式，组合式请使用组合式函数）
    1. 继承

自定义指令
1. 生命周期（https://cn.vuejs.org/guide/reusability/custom-directives.html#directive-hooks）

内置组件
1. transition组件
2. keep-alive
    1. 组件原理
    2. 更新算法：LRU
    3. 生命周期：onActivated和onDeactivated在组件挂载和卸载阶段都会被使用
3. teleport
    1. 原理
4. suspense
5. 还有一些内置指令的原理

# 单文件组件

@vue/compiler-sfc 开发环境下，style注入为原生的标签。打包后会被抽取合并到一个文件中


# 性能优化

1. 如何进行性能分析

    chrome performance

2. 指标
    1. 
3. 如果对象层级非常深或者在监听DOM变化时，建议使用shallowRef和shallowReactive()声明响应式数据
4. https://web.dev/explore/fast?hl=zh-cn

# 安全问题

1. vue解析安全：HTML内容使用textContent、Attribute使用setAttribute，类似WEB API完成，只有当浏览器出现问题的时候才有可能导致安全问题

# 调试

vue在使用时如何进行调试

# 思考一下项目中的状态

1. 场景介入：比如MD这种大型系统，是否适合使用常规的Pinia，或者使用其他类似的状态库