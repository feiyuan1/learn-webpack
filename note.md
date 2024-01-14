```
// 防止意外发布代码，指的是发包？
private: true
```

> 安装一个被用于生产环境的依赖时，使用 --save，安装仅本地使用的依赖时，使用 --save-dev

# bundle、chunk、module、chunk 组

### 目录结构
为了方便说明，假定当前的目录结构为：
- src
  - index.js
  - Login.js
  - LoginMoudle.js
- dist
  - index.e3421dfdaf2.js
### module
在开发中，引入的组件、工具方法等均可以视为 module

### chunk（块）
打包后生成的文件为 chunk，比如 dist 目录下的 index.xxxx.js 文件为 initial chunk

### chunk 组
包含一个或多个 chunk，按照当前生成的 dist 来说，只生成了 chunk 组（名字叫 main，入口起点的默认名称），并且只包含一个 chunk

ps：splitChunksPlugin 会将一个 chunk 切分为多个 chunk，并合并成一个 chunk 组

### bundle（包）

# manifest

管理模块间的交互.

### Qs

- 动态生成的 bundle（还是 chunk？） 名称，如何在 index.html 内引用的呢？-manifest 文件中会存储源文件与 chunk 之间的映射
- 当使用 content-hash 作为 bundle 文件的名称时：
  - 为何有些内容没有被修改，但是生成的 bundle 文件名称依旧被更新了？
  - 应该怎么避免更新呢？
- manifest 普通开发者可以看到么？是什么结构呢？
  - WebpackManifestPlugin 插件可以提取 manifest 数据为一个 json 文件

# entry

### Qs

- 如何使用多个导入的单入口？

# 动态引入文件

### 未添加提示
子模块在执行时进行加载

### prefetch 预获取
父模块加载完毕后，加载子模块

### preload 预加载
父模块与子模块并行加载

### Qs
- 为什么入口文件添加 预加载/预获取提示无效？
- webpack 新版本是否已经修复，或者是否有修复方案？

# bundle name
- output 中如果以contenthashid 作为包名的话，测试下发现：在不修改文件内容，并重新构建后，contenthash 没有变化（当前 webpack 版本为 5.89.0）
- 当生成的包个数发生变化时，官网文档中表示：其他无关的包 contenthash 也会发生变化（由于解析包的顺序出现差异，导致包的module.id 更新），但是可能由于 webpack 版本不同，目前没有复现这种情况
- 

### Qs
- 为什么有的 webpack 版本下，引导模板会导致不修改文件内容 contenhash 也会更新的情况呢？

# webpack 环境变量
webpack 环境变量仅 webpack.config.js 生效

### 存在的目的
消除 webpack.config.js 文件中生产环境与开发环境的差异

### 内置环境变量

- WEBPACK_SERVE(终端执行 npx webpack serve 命令，值为 true)
- WEBPACK_BUILD(终端执行 npx webpack build 命令，值为 true)
- WEBPACK_WATCH(终端执行 npx webapck --watch，值为 true)
  
### 自定义环境变量
> 没有为变量赋值时，默认值为 true
```
npx webpack --env ${name}=${value} // name=value

npx webpack --env ${name} // name=true
```

### node-env（node 环境变量）
通过 --node-env 来设置 process.env.NODE_ENV
```
npx webpack --node-env production // process.env.NODE_ENV='production'
```
- tips
  - 仅在 webpack config 上下文中生效；在 client 端访问时，值依旧为 development（符合预期，需要通过 webpack 的配置项来设置该变量）

# process.env.NODE_ENV

webpack 中更改该值有几种办法：
- 设置 webpack config 上下文的值
  - 命令行中添加 --node-env 选项
- 设置 client 代码上下文的值
  - 1. webpack config optimization.nodeEnv
  - 2. webpack config mode，但会被 1. 覆盖

# 全局变量
- 上面提到的 node 环境变量
- webpack.DefinePlugin 插件中自定义的变量

# mode
webpack 打包使用的默认优化方案&代码运行环境（开发、生产、其他），默认为生产

2 种显示指定途径：
- 配置文件中，指定配置项 mode
- cli 指定选项 --mode
  - 可以在配置文件中以函数的形式将配置导出，该函数可以接受 cli 指定的 mode 选项值
- ps: 前者优先级更高

1 中间接影响 mode 值的途径：
- 命令行中添加 --node-env 且没有显示指定 mode，mode 会取自 --node-env 选项的值
  - ps: 如果以函数形式导出配置项，那么函数中接收到的 mode 值仍为空


# source map
webpack.config.js 中通过 devtool 选项配置 sourceMap 风格，开发环境下默认值是 eval

- 在源文件与打包后的文件末尾都添加加了若干行注释
  - sourceURL
  - sourceMappingURL
- 不同的 source map 风格打包生成的辅助文件也不同
  - 比如，devtool: source-map 会生成 .js .js.map 两个文件；devtool: eval-cheap-module-source-map 只会生成 .js 文件
- 有些风格，比如 hidden-source-map 适用于生产环境，生成 source map，但不会在打包后的文件末尾添加注释映射到源文件，避免被普通用户看到源码，这种可以将生成的 source map 文件提供给错误报告工具辅助排查线上问题，比如 sentry

# 模块热替换
webpack.HotModuleReplacementPlugin 将接口暴露在 module.hot 以及 import.meta.webpackHot 中

- webpack-dev-server 较新版本默认支持热更新
  - 本质利用的是插件：webpack.HotModuleReplacementPlugin
  - 所以是怎么实现的，这个插件应该只提供了 API？
- 手动操作模块热替换：
  - 使用 module.hot API 监听需要支持热替换的文件，当文件发生变化时，会触发 API 提供的回调，在回调中手动更新，比如删掉原来元素，重新执行更新后的文件内容，生成新的元素，并添加到文档中
- 各个框架也都有对应的工具
  - react-hot-loader（ps: 在 RN 中，新版本推荐使用 react fast refresh）
  - Angular HMR
  - Vue-loader
  - ...

### Qs

- 存储在内存中，在没有手动生成 manifest.json 文件时，从哪里可以看到 webpack 存储的映射？？ 
- module 是 webpack 提供的吗？难道也是 node 提供的?
  - 已知：webpack.config.js 中使用 cjs 语法 module.exports 导出了 webpack 配置
    - 那么，整个 module 是 node 提供的？

# tree shaking
刪除 js 上下文中未引用的代码

webpack 默认支持的 cjs 语法，从 4 开始正式支持 es2015(即 es6，因为 ECMAScript 标准第 6 版正式版本是在 2015 年发布的)模块语法，也叫 harmony modules（中文翻译为 语法糖模块）

ps：es5 中实现模块化的方式：立即执行函数 + 闭包

tree shaking 有两个方面：针对整个文件、子目录 & 针对文件内容

### sideEffects
在 package.json 文件中设置 sideEffects: true 可以删除未引用的文件、子目录

ps: 可以设置为数组，item 为文件、子目录的路径，将其标记为“有副作用”
ps: 由于 css 文件不会有直接使用的导出，所以默认情况下会将 css 文件删除

### 文件内容 tree shaking
要使 tree shaking 生效有几个步骤：

step1：webpack 配置中增加选项 usedExports

将文件中未直接使用的导出 & 导出的实现 标记出来，比如：unused harmony export cube；

该选项默认依赖的是 terser

step2：添加 #__PURE__ 注释

并不是所有文件中的内容都可以被 terser 明智的分析出来是否可以被删掉，所以需要手动添加注释，表明这块代码在没有用时是不会产生副作用的，可以被删掉；

通过 optimization.innerGraph: true 启用该功能

使用场景：函数调用（比如 react HOC）、变量的初始值、...

step3: 使用压缩工具移除 dead-code

涉及到两项配置：
- webpack.config.optimization.minimize: true
- webpack.config.optimization.minimizer 为数组，指定压缩的工具
  - 在生产环境下，默认的压缩工具为 TerserPlugin（minimize 默认也是开启的）；开发环境未开启
  - webpack 官网还提供了 ClosureWebpackPlugin
  - 或者指定其他的压缩工具：需要提供移除 dead-code 的能力 

压缩工具可以生效的前提是：文件内容使用的 es6 模块语法没有被编译为其他的语法
> 比如 @babel/preset-env 会默认将 es6 转为 cjs？

一般压缩工具的工作包括：
- 变量、方法名称的简化、压缩
- 移除 dead-code
- 去除文件的空格、换行等空字符

step4：合并模块
> 默认生产环境是开启的，开发环境未开启

在未开启该功能的情况下，可以在 chunk 中看到，在 chunk 中包含了多个模块，并且每个都会添加模块原名称作为注释，方便分割；在开启后，chunk 中移除了子模块的分割&信息标注，真正的融合为了一个模块

涉及到的配置（二选其一即可）
- webpack.config.optimization.concatenateModules: true
- 添加插件 webpack.optimize.ModuleConcatenationPlugin

### tree shaking 的过程

step1：判断该文件是否被标记为有副作用，是：则直接导入它，否则进入 step2
step2：判断该文件的导出是否有直接的使用，是：则导入它，否则进入 step3
step3：判断该文件重新导出的导出是否有直接的使用，是：则跳过它，否则排除它
> step1~3 依赖 sideEffects 的设置

step4：针对已经导入的文件，进行文件内容副作用分析评估
> step4 依赖 usedExported & #__PURE__ 注释

step5：针对已经导入&跳过的文件，进行依赖分析

### Qs
- 依赖分析是会做什么呢？总不能纯分析吧？
- 使用了 webpack+babel+node 的前端项目，打包后的文件都使用的什么模块化语法呢？
- 官网中提到可以在 build 时添加选项 --optimize-minimize 来启用 TerserPlugin，但尝试后，发现会报错：不是可用的选项
- 在压缩时遇到一个问题：
  - 问题描述：开发环境下，按照上述步骤配置完毕后，发现代码并没有完全被压缩，而且 dead-code 没有被移除
  - 线索：devtool: false （之前是 eval）后，问题解决
  - 继续排查，发现将 devtool 设置为任何 eval 相关的风格都会导致同样的问题 & chunk 中的内容与映射的转换后的代码内容相同
    - ps: 内容相同，但结构不同，区别主要在：一个 chunk 文件包含所有引用的模块（每个模块都有模块名作为注释）；而转换后的代码中，每个模块单独放在了一个文件中
  - 原因猜测：是否由于 eval 风格的 sourcemap 没有保留源码&生成 .map 文件，又需要满足开发者查看源码的需求，所以必须保证转换后的代码是完整的，而 chunk 内容和转换后的代码内容是同源（同一个引用），导致了该问题？？

# 生产环境的特殊点

- 默认会启用 tree shaking
- 默认会将代码压缩
- 默认添加 DefinePlugin
- source-map 默认值为 none

### Qs
- 添加的 DefinePlugin 都处理了哪些变量
  - 是根据使用框架的不同，处理的方式也有区别吗？
  - 要不然为什么会说“如果使用 React 会明显发现生产环境下打包后的体积减小”呢？是因为对于 React 项目来说，开发环境下默认是会有某些日志记录的吗？生产环境下给去掉了？？
  - 为什么生产环境下使用 source-map 对**测试**还有影响？？
  - 官网提到了 css 文件的压缩，但是默认情况下生产环境会将所有代码进行压缩（包括 css），为什么单独拿出来说？？

# TODO
- 更新配置后，打包生成的文件并没有更新或者是没有重新打包？
  - 需要删掉 dist 目录，重新打包后，文件才被更新
- webpack-dev-middleware 尝试
- 如何单独将 css 文件打包为一个文件？？
- 我在某次打包后的文件（chunk）中看到了 module.hot.accept(...)，可以具体看下 webpack-dev-server做了什么？

# webpack 的竞争者们

## Bun
到目前为止，github star 数量高于 webpack，说明大家还挺支持的，使用率呢？

- 不支持 windows
- 支持运行时？但是 webpack 不支持么？为啥要用它？
- 不支持 Vue、Angular 