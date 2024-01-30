环境变量一般用来区分开发、测试、生产环境，更夸张的还可以用来模块化打包、功能定制化。本篇将介绍Vue在[Vue-CLI][Vue-CLI]、[webpack][webpack]、[Vite][Vite]脚手架或构建工具下如何使用环境变量以及它们的区别。

# Webpack

[Webpack][Webpack]环境变量需要通过指令的方式传递：

```sh
# shell
webpack --env goal=local --env production
```

然后在`webpack.config.js`获取传参，有俩种方式：

- `process.argv`
    
    Nodejs中经常使用这种方式获取传参，`Webpack`环境变量本质也是这个：

    ```js
    // 任意经过Nodejs的js文件
    const process = require('process')

    console.log('Using env-arg by process: ', process.argv)
    // output
    /**
     * Using env-arg by process:  [
     *  '--env',
     *  'goal=local',
     *  '--env',
     *  'production'
     * ]
     */
  
    ```
- `webpack --env`

    `process.argv`中参数输出的是一个数组，`webpack --env`将其转为`key-value`格式：

    ```js
    // webpack.config.js
    // 如果想使用环境变量，`module.exports`必须转换为函数
    module.exports = (env) => {
      console.log('Using env-arg by webpack in functional: ', env)
      return {
        entry: './main.js',
        output: {
        filename: 'main.js',
          path: path.resolve(__dirname, 'dist'),
        }
      }
    };
    // output
    /**
     * Using env-arg by webpack in functional:  {
     *  goal: 'local',
     *  production: true
     * }
     */
    ```


# Vue-CLI

[Vue-CLI][Vue-CLI]是一个脚手架，用来快速初始化Vue项目，是Webpack的sugar。Vue2时官方还是推荐使用Vue-CLI初始化项目，Vue3之后推荐使用`Vite create-vue`来初始化项目。

- [模式(Modes)](https://cli.vuejs.org/guide/mode-and-env.html#modes)

    Vue-CLI使用文件存储变量，比如`.env`、`.env.lolcal`这类环境文件，`模式`是为了指向变量文件：

    ```sh
    # shell
    vue-cli-service build --mode haha
    ```

    上面代码中，`vue-cli-service`会在项目根目录下找`.env`、`.env.local`、`.env.haha`、`.env.haha.local`这四个环境变量文件，然后获取文件中的环境变量。
    
    > `.local`尾缀是为了在本地执行，加上该尾缀后文件会被git忽略

    当然，Vue-CLI默认提供了三种模式，不需要添加环境变量文件和指定模式就能使用（相当于模式sugar）：

    - development：`vue-cli-service serve`
    - test: `vue-cli-service test:unit`
    - production: `vue-cli-service build` | `vue-cli-service test:e2e`
    
    比如构建指令`vue-cli-service build`，等同于指令`vue-cli-service build --mode production`和使用环境变量文件：
    
    ```js
    // .env.production
    NODE_ENV=development
    ```

    环境变量文件优先级：`.env` < `.env.local` < `.env.[mode]` < `.env.[mode].local` < `vue-cli-service启动时就存在的环境变量`

    > `vue-cli-service启动时就存在的环境变量`意思是如果在全局下设置了环境变量，不会被环境文件中的变量覆盖。

- [环境变量](https://cli.vuejs.org/guide/mode-and-env.html#environment-variables)

    `vue-cli-service`默认识别三类环境变量：

    - NODE_ENV：一般用来区分服务环境，是测试环境、生产环境还是测试环境；
    - BASE_URL：项目根目录，同`vue.config.js`中的`publicPath`；
    - VUE_APP_*：开发人员自定义变量

    比如你想在本地开发环境自动登录且不需要license验证，可以这么写：
    ```js
    // .env.dev
    VUE_APP_LOGIN=auto
    // .env.dev.local
    VUE_APP_TOKEN=123456
    ```

    然后使用指令`vue-cli-service serve --mode dev`启动。

# Vite

[Vite][Vite]延续了Vue-CLI风格（模式和环境变量），但是取消了固定前缀限制（VUE_APP_*），并新增了静态替换。比如你想在本地开发环境自动登录且不需要license验证，并且添加一个私密ID用于构建环境，可以这样写（注释代表不同文件）：

```js
// .env
SECRET=1111
// .env.dev
VITE_LOGIN=auto
// .env.dev.local
TOKEN=123456
```

然后使用指令`vite --mode dev`启动。

- 在HTML文件中，可以使用`%ENV_NAME%`获取环境变量名（能获取`import.meta.env`下的所有属性）：

    ```html
    <!-- 获取模式 -->
    <h1>Vite is running in %MODE%</h1>
    <!-- <h1>Vite is running in dev</h1> -->
    <p>Using data from %SECRET%</p>
    <!-- <p>Using data from 1111</p> -->
    <p>Using data from %VITE_LOGIN%</p>
    <!-- <p>Using data from auto</p> -->
    <p>Using data from %VITE_HAHAHA%</p>
    <!-- <p>Using data from %VITE_HAHAHA%</p> -->
    ```

    如果没有匹配上，就不会匹配，不会变成`undefined`。

- 在`<script>`和`<template>`中使用`import.meta.env.env_name`获取环境变量名，并且添加了`VITE_`前缀的环境变量会暴露到源码中，不添加则不暴露。在Vue文件的`<script>`中这么使用：

    ```js
    <script>
      console.log(import.meta.env.SECRET) // undefined
      console.log(import.meta.env.VITE_LOGIN) // auto
      console.log(import.meta.env.TOKEN) // undefined
    </script>
    ```

    `vite.config.js`中无法通过`import.meta.env.env_name`获取环境变量，需要使用`Webpack`中介绍的`process.env`，或者使用Vite函数式配置：

    ```js
    // vite.config.js
    import { defineConfig, loadEnv } from 'vite'

    export default defineConfig(({ command, mode }) => {
    // 根据当前工作目录中的 `mode` 加载 .env 文件
    // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
    const env = loadEnv(mode, process.cwd(), '')
    console.log(env.SECRET) // 1111
    console.log(env.TOKEN) // 123456
    return {}
    })
    ```

结束！哈！


[Vue-CLI]: https://cli.vuejs.org/guide/mode-and-env.html
[webpack]: https://webpack.js.org/guides/environment-variables/
[Vite]: https://v3.vitejs.dev/guide/env-and-mode.html#env-variables-and-modes