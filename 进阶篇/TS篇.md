Ts
	执行原理
		通过在js上添加静态类型定义构建而成
		ts会通过ts编译器（TSC）或者Babel转译为js代码，可运行在各平台和浏览器
	主要特性
	泛型
	重载
		基于js的缺陷，TS实际上是不能实现重载的（重载是函数特性），ts的重载实际是同名函数，不同参数。同名函数可以定义多个，但是最终函数实现只能是一个（基于函数特性，注意区分继承覆盖），然后在此函数体中区别参数（依靠参数特性）以达到函数重载的目的
	interface与type
		概念
			type：类型别名，可以给一个或多个数据类型取别名；
interface：接口
		相同点
			都可以描述一个对象或者函数
			都可以扩展，且能相互扩展
				interface使用extends扩展type
				type使用&扩展interface
		不同点
			type可用单一类型，interface不可以
			interface可以定义多次，后定义类型会覆盖已定义类型，type不可以
			type可使用in关键字生成映射类型，interface不可以
				type a = {[key in keys]: string}
			默认导出，interface可边声明边导出，type必须声明后再导出。
		参考
			https://blog.csdn.net/TIAN20121221/article/details/120085998
	枚举
		实现
			let enumObj;
(function (par) {
  par['apple'] = 'apple'
})(enumObj || (enumObj = {}))

	.d.ts声明文件
		declare
			将类型定义到全局，只能在尾缀为.d.ts的文件中使用
		文件顶部不可以使用import、export否则会被认为是module文件，如果需要使用文件中定义的类型，可以使用import或require动态导入
		子主题 3