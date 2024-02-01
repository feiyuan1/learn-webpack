```
// 防止意外发布代码，指的是发包？
private: true
```

> 安装一个被用于生产环境的依赖时，使用 --save，安装仅本地使用的依赖时，使用 --save-dev

# bundle、chunk、module、chunk 组

## 测试用的目录结构
为了方便说明，假定当前的目录结构为：
- src
  - index.js
  - Login.js
  - LoginMoudle.js
- dist
  - index.e3421dfdaf2.js
## module
在开发中，引入的组件、工具方法等均可以视为 module

## chunk（块）
打包后生成的文件为 chunk，比如 dist 目录下的 index.xxxx.js 文件为 initial chunk

### 如何确认 chunk 中包含哪些模块
> ps: 在代码未被压缩时，可以在文件中看到以各个模块的名称为标记的注释

- 入口起点中定义的所有导入（详见 entry-多个导入）
- 入口起点中定义的所有导入的依赖中符合以下条件的模块
  - 非动态引入
  - 非 optimization.runtimeChunk 生成的模块
  - 非 optimization.cacheGroup 生成的模块

## chunk 组
包含一个或多个 chunk，按照当前生成的 dist 来说，只生成了 chunk 组（名字叫 main，入口起点的默认名称），并且只包含一个 chunk

ps：splitChunksPlugin 会将一个 chunk 切分为多个 chunk，并合并成一个 chunk 组

## bundle（包）
可以包含多种资源，包括 css 文件、js 文件、媒体资源（图片、音频、视频、...）

### main bundle
默认情况下，将入口起点打包生成 main.js, 这是 main bundle

# manifest
管理模块间的交互.

## Qs

- 动态生成的 bundle（还是 chunk？） 名称，如何在 index.html 内引用的呢？
  - manifest 文件中会存储源文件与 chunk 之间的映射
- 当存在多个入口文件时，比如 MPA 中，访问某条路径所对应的 html 页面，对应的入口起点打包生成的就是 main bundle？不确定
  - 以及 webpack 有明确的 main bundle 的概念吗？
- 如何确认哪些 chunk 分在了一个 bundle 中？或者说 bundle 的分割标准&生成途径？？
- 当使用 content-hash 作为 bundle 文件的名称时：
  - 为何有些内容没有被修改，但是生成的 bundle 文件名称依旧被更新了？
  - 应该怎么避免更新呢？
- manifest 普通开发者可以看到么？是什么结构呢？
  - WebpackManifestPlugin 插件可以提取 manifest 数据为一个 json 文件

# entry
入口起点是 webpack 用于查找开始构建的地方（打包的起点）

## 对 chunk 命名的影响
入口起点的定义形式决定了 chunk 的名称

- 赋值为 string | string[]，chunk 名称为 main
- 赋值为对象，每个起点对应的 chunk 名称为 key
- 赋值为指定了 chunk 名称的对象

## 使用多个导入
一个入口起点可以定义多个导入, 生成的 chunk 有两种情况：
```
entry: ['index.js', 'test.js']
```
- index.js 引入了 test.js
  - 导致最终生成的 chunk 文件中 webpack_exports 相关的逻辑会涉及到所有的导入，其他部分与不定义 test.js 没有区别
  - ps: MultiEntryImportCut.png 是这部分区别的截图
- 两个文件之间不存在引用关系
  - 最终生成的 bundle 会包含所有的导入及其依赖

## 新增 HTML
通过 HtmlWebpackPlugin 新增一个 HTML 文件，默认情况下名为 index.js, 包含所有生成的入口 chunk
```
new HtmlWebpackPlugin({ title: "dev-webpack 学习" })
```
### 构建一个 MPA
1. 新增 test 入口
```
entry: {
  index: "./src/index.js",
  test: "./src/test/testIndex.js",
}
```
存在一个问题：只是新增了 test 入口起点，但是产出的 html 文件只有 index.html

2. 新增 test.html
```
new HtmlWebpackPlugin({ title: "test of webpack 学习" , filename: 'test.html'}),
```
存在一个问题：由于生成的 2 个 html 文件都没有指定包含的 chunk，所以默认情况下，2 个会共享所有 chunk。也就是说，index.html 中包含 test chunk，test.html 中也包含 index.js

3. 指定 html 包含的 chunk
```
new HtmlWebpackPlugin({ title: "dev-webpack 学习", chunks: ['index'] })
new HtmlWebpackPlugin({ title: "test of webpack 学习" , filename: 'test.html', chunks: ['test]}),
```
现在 index.html 中只会包含 index.js

## Qs

- 如何使用多个导入的单入口？
-  "由于生成的 2 个 html 文件都没有指定包含的 chunk，所以默认情况下，2 个会共享所有 chunk。也就是说，index.html 中包含 test chunk，test.html 中也包含 index.js" 这是符合默认行为预期的么？

# 启用本地服务
安装 webpack-dev-server，cli 中执行 npx webpack serve 即可

> 一般提供的根路径为第一个入口起点生成的 html 页面

## 访问本地服务的其他页面
通过访问 localhost:port/webpack-dev-server 可以查看本地服务中所有的目录结构，访问对应文件路径即可
```
// 服务中的目录结构
- index.html
- test.html
- index.js
- test.js
- index.css
```
那么可以通过 localhost:port/test.html 访问 test.html

# 动态引入文件
webpack 会将动态引入的模块单独生成一个 chunk，不与其他代码耦合在一起，可以通过魔法注释 webpackChunkName 指定 chunk 名称，webpack 也可以提供一个默认名称

> 动态引入的模块不属于入口 chunk

## 多次引入同一模块
只会生成一份 chunk，被多次加载而已，chunk.name 使用第一次的赋值（如果存在多次指定 chunk 名称的情况）

## 未添加提示
子模块在执行时进行加载

## prefetch 预获取
父模块加载完毕后，加载子模块

## preload 预加载
父模块与子模块并行加载

## 懒加载

### react 懒加载
详见 有道云笔记-react 基础/react 了解

### script 懒加载
详见 有道云笔记-js 基础


## Qs
- 为什么入口文件添加 预加载/预获取提示无效？
- webpack 新版本是否已经修复，或者是否有修复方案？
- 动态导入和懒加载不同么？？
  - 所以懒加载只是在动态导入的基础上，更精确的控制模块的加载时机？比如在某次交互后？
  - 联想到了图片懒加载

# webpack 缓存
为了更好的利用缓存，相关的一项配置：optimization.moduleIds（模块 id 的生成策略） 由 defaultvalue：natural 更新为了 defaultValue: deterministic

> natural 是根据模块的加载顺序来生成 module.id，意味着，当非动态引入的模块出现增删引入的情况时，会影响模块生成的 contenthash
> deterministic 和 hash 有关，具体怎么算的没明白...

# webpack 环境变量
webpack 环境变量仅 webpack.config.js 生效

## 存在的目的
消除 webpack.config.js 文件中生产环境与开发环境的差异

## 内置环境变量

- WEBPACK_SERVE(终端执行 npx webpack serve 命令，值为 true)
- WEBPACK_BUILD(终端执行 npx webpack build 命令，值为 true)
- WEBPACK_WATCH(终端执行 npx webapck --watch，值为 true)
  
## 自定义环境变量
> 没有为变量赋值时，默认值为 true
```
npx webpack --env ${name}=${value} // name=value

npx webpack --env ${name} // name=true
```

## node-env（node 环境变量）
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
> import.meta 由 Nodejs 提供，用于描述当前引入模块的信息
> webpack 在此基础上，增加了 webpackHot 属性

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

## Qs

- 存储在内存中，在没有手动生成 manifest.json 文件时，从哪里可以看到 webpack 存储的映射？？ 
- module 是 webpack 提供的吗？难道也是 node 提供的?
  - 已知：webpack.config.js 中使用 cjs 语法 module.exports 导出了 webpack 配置
    - 那么，整个 module 是 node 提供的？

# tree shaking
刪除 js 上下文中未引用的代码

webpack 默认支持的 cjs 语法，从 4 开始正式支持 es2015(即 es6，因为 ECMAScript 标准第 6 版正式版本是在 2015 年发布的)模块语法，也叫 harmony modules（中文翻译为 语法糖模块）

ps：es5 中实现模块化的方式：立即执行函数 + 闭包

tree shaking 有两个方面：针对整个文件、子目录 & 针对文件内容

## sideEffects
在 package.json 文件中设置 sideEffects: true 可以删除未引用的文件、子目录

ps: 可以设置为数组，item 为文件、子目录的路径，将其标记为“有副作用”
ps: 由于 css 文件不会有直接使用的导出，所以默认情况下会将 css 文件删除

## 文件内容 tree shaking
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

## tree shaking 的过程

step1：判断该文件是否被标记为有副作用，是：则直接导入它，否则进入 step2
step2：判断该文件的导出是否有直接的使用，是：则导入它，否则进入 step3
step3：判断该文件重新导出的导出是否有直接的使用，是：则跳过它，否则排除它
> step1~3 依赖 sideEffects 的设置

step4：针对已经导入的文件，进行文件内容副作用分析评估
> step4 依赖 usedExported & #__PURE__ 注释

step5：针对已经导入&跳过的文件，进行依赖分析

## Qs
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

## Qs
- 添加的 DefinePlugin 都处理了哪些变量
  - 是根据使用框架的不同，处理的方式也有区别吗？
  - 要不然为什么会说“如果使用 React 会明显发现生产环境下打包后的体积减小”呢？是因为对于 React 项目来说，开发环境下默认是会有某些日志记录的吗？生产环境下给去掉了？？
  - 为什么生产环境下使用 source-map 对**测试**还有影响？？
  - 官网提到了 css 文件的压缩，但是默认情况下生产环境会将所有代码进行压缩（包括 css），为什么单独拿出来说？？

# 代码分离
将代码分离到不同的 chunk 中，最终目的是分离到不同的 bundle

## 好处
- 控制单个 bundle 体积
- 控制资源加载的优先级

## 分离出的 chunk 如何使用
webpack 会自动根据文件间的依赖关系引用 chunk，譬如：存在一个名为 index 的入口起点，它定义的起点为 index.js，而 index.js 引用了 chunkA.js, 那么在访问 index.html 时，会加载 chunkA.js 文件的

## 途径
- 分割入口起点
- 去重
- 动态导入
也就是说：分离出的 chunk 不一定会放在入口 chunk 中，也就是，最终产出的 chunk 数量 >= 入口起点数量

## 分割入口起点
每个入口起点一定会产出一个 chunk，而这个 chunk 可以不被使用

### 分割标准
什么情况下应该拆分出另一个起点呢？
- MPA
- 公共的组件、工具库、第三方库（webpack 不推荐）
  - 这种应该通过第二种“去重”的方法提取？
- 利用 bundle 分析工具提供建议

> 在 MPA 中，每个 HTML 页面对应一条路由，也会对应一个入口起点产生的 chunk，如果各个入口起点产生的 chunk 互相不存在引用关系时，当访问页面 A 时，其他的入口起点产生的 chunk（B.js/C.js/...）是不会被加载的

## 去重

### 运行时代码
可以通过 optimization.runtimeChunk 将运行时代码抽离，这样可以：
- 减小入口 chunk 的体积，提高页面加载速度
- 减小入口 chunk 的文件名变化
  - webpack 存在一些运行时的代码（包括引导模板等...），这些代码每次在构建后，contenthash 都会更新，如果 chunk 命名规则中包含 contenthash，那么就会引起入口 chunk 的文件名更新，缓存失效，重新加载文件
- 存在多个入口起点时，再次加载 runtimeChunk 所用时间是不是也会少？

> runtime chunk 默认会引用在所有的 html 中

### 第三方工具
通过 optimization.cacheGroup 将某些重复引用的模块提取出来

> 提取时可以指定提取哪些 chunk 中的模块
> ps: 动态导入（没有指定名称）产生的 chunk.name 为 undefined

> 这些模块的特点是更新频率低，单独抽离可以善用缓存

1. node_modules 下的第三方包，将其拆分为一个 chunk
```
optimization: {
  cacheGroup: {
    'vendor': {
      test: /[\\/]node_modules[\\/]/,
      name: 'vendor',
      chunks: 'all' // 将产生的所有 chunk 中包含的 node_modules 下的包抽离到 vendor chunk 中
    }
}}
```
存在一个问题：

假设 A 页面用到了 moduleA，B 页面用到了 moduleB，C 页面用到了 moduleC

在 A、B、C 三个页面中都会引入 vendor.js，对于 A 来说，引入了不必要的 moduleB&moduleC

2. 以入口起点为单位抽离 node_modules 下的第三方包

将起点 index 依赖的第三方包抽离到 index-vendor chunk 中，将起点 test 依赖的第三方包抽离到 test-vendor chunk 中
```
optimization: {
  cacheGroup: {
    'test-vendor': {
      test: /[\\/]node_modules[\\/]/,
      name: 'test-vendor',
      chunks(chunk){
        return chunk.name === 'test'
      }
    },
    'index-vendor': {
      test: /[\\/]node_modules[\\/]/,
      name: 'index-vendor',
      chunks(chunk){
        return chunk.name === 'index'
      }
    },
}}
```
### css 文件分离
webpack 提供了 mini-css-extract-plugin 将 css 从主应用程序中分离

#### mini-css-extract-plugin 与 css-loader 区别
- 前者是将 css 抽离为 .css 文件，通过 link 标签将 css 文件引入 html 中；后者是利用 js 将 css 内容插入 style 标签中，插入 DOM
- 前者更适用于生产环境，可以是 .css&.js 文件并行加载

## 动态引入
- 减小部分 bundle 体积
- 减小带宽占用？？不必同时加载多个模块？
- 控制资源加载的优先级

## react code splitting
- 懒加载
- 加载模块过程中搭配 fallback UI，提升用户体验
 
详见 有道云笔记-react 基础/react 了解

## Qs
- 公共组件、工具是以什么办法分离的？以及如何判断是否需要分离？
  - 和 node_modules 一样的问题，全部分离，意味着每次都要加载一个非常大的文件
  - 是否需要再切割？如何切割呢？
  - 像是成型的工具库，比如 lodash，人家会提供子包 lodash/xxx，减小引入的包体积，这里可以参考么？
  - 像 heifetz，分割成了很多的子应用，是否也是考虑到了包体积呢？
- Chrome devtool 中的 network 面板下的 size 是带宽吗？还是流量？
  - 使用 webpack-dev-server & 使用浏览器缓存后，发现 size 小于原本资源的大小
  - 使用 build，加载资源时对应的 size 大小无论是否使用浏览器缓存，没有区别

# webpack 中的模块系统
支持两种：cjs esm

## 设置模块系统
> 默认情况下，webpack 会自动检测文件使用哪种模块系统，然后通过 Babel 转换为目标环境支持的形式

package.json 文件中，type: "module" | "commonjs"

type 值决定了所有文件使用的模块系统

## esm（首选的、推荐的）
> 模块引入时的扩展名
> 当指定 type 为 module 的前提下，webpackConfig.rule.resolve.fullySpecified 设置为 true 表示 esm 模块引入时不能省略扩展名

### 严格模式
使用 esm 会默认进入严格模式

### esm 生效前提
- 在脱离 webpack 的环境下，在引用 script 时指定 type 为 module，即可使用 esm，否则会报错
- 在 webpack 环境下
  - 指定文件扩展名为 .mjs（这得益于 Node）
  - DataURI 中指定 mime 类型为 text/javascript、application/javascript

## cjs
CommonJs 下不支持 require、module、exports 等

所以 HMR 中使用 import.meta.webpackHot 替代 module.hot

## webpack 下的模块语法转换
> 参考文章：https://cloud.tencent.com/developer/article/1643103

通过 babel 的能力来完成
1. babel/parser 将代码转换为 AST
2. babel/traverse　从　AST　中间模块间依赖关系解析出来
   1. 如果没有依赖关系，可能只能转换最外层的模块
   2. 需要根据依赖关系，递归的转换所有模块直到叶子模块为止
3. ｂabel/core 将原始代码转为浏览器可识别的语法
4. ｂabel/preset-env 预置的一些语法转换规则

## Qs
- fullySpecified 属性只针对 esm 模块有效？
- 哪些场景会使用 text/javascript、application/javascript 这两种 mime 类型的 DataURI？
- webpack 解析出来的依赖关系
  - 联想到了 webpack 编译后的文件中导出的东西：
  - > webpack_exports 相关的逻辑会涉及到所有的导入，其他部分与不定义 test.js 没有区别,
  - > ps: MultiEntryImportCut.png 是这部分区别的截图

# webpack 下的 ts

## ts-loader

识别 ts/js 文件

> ts-loader 要放置在所有处理 js 文件的其他 loader 之前

## tsconfig.json

该文件需要是用来配合 ts-loader 工作的，决定了 ts-loader 的输出内容（和 ts 部分的编译配置选项是一样的）

## source map

tsconfig.json 中启用 source map，并将 devtools：inline-source-map，将内联的 source map 输出到编译后的 js 文件中

## 引入其他资源

默认情况下，ts 支持引入的模块为 ts/js/ets/ejs 等 script 类型，如果引入其他类型，比如图片 png，会报错：cannot find module，可以在 .d.ts 文件中对 png 类型进行声明

```
// anyName.d.ts
declare module '*.png'
```

> .d.ts 文件的路径要求：在 ts-loader 与 tsconfig include 要求的范围内

## Qs

- 可以看到 ts-loader 的输出内容吗？
  - ts-loader 做了什么？
- 如果 ts-loader 大于 include 要求的范围可能会导致类型定义无法生效

> 举个例子：
>
> include：src/\*
>
> ts-loader test: src/\*\*/\*.ts
>
> 此时，src/dir1/xxx.ts 可以进行类型校验，src/dir1/xxx.d.ts 声明没有生效（修正 include 为 src/\*\*/\* 两个文件都可以生效）
>
> 为什么 ts 文件可以进行类型校验？按照 include 的要求来说，ts 不应该也不生效吗？如果是以 ts-loader 为主，那为什么 d.ts 文件声明没有生效？
>
> 难道他们两个有分工：ts-loader 主要负责类型校验，include 负责所有 ts 相关的处理？？？

# webpack 下的 Web Worker

> 注意：仅限于 esm，commonJS 中不可用
>
> node 下也提供了可以多线程运行 js 的工具：worker-threads（仅限 esm）

## 使用

webpack 5：与原生相同，通过 Worker 构造器（为了在不使用 bundler 的情况下也可以运行代码），但是 scriptURL 只能接收 URL 生成的字符串

webpack 4：使用 worker-loader

# Loader
对代码的翻译

## style-loader
常见的是将 style-loader 与 css-loader 搭配使用，那么两者的作用分别是什么？

## Qs
- style-loader 将 css 插入 style 标签？还做了其他的吗？
- css-loader 将 css 文件内容转为了什么？
  - 因为它既可以将结果给 style-loader，又可以给 mini-css-extract-plugin，单独生成 css 文件
- 那么如果只引入 css-loader，通过 css 文件形式定义的样式还能生效吗？又是以什么形式生效的呢？

# plugin
对功能的扩展

# TODO
- 更新配置后，打包生成的文件并没有更新或者是没有重新打包？
  - 需要删掉 dist 目录，重新打包后，文件才被更新
- webpack-dev-middleware 尝试
- 如何单独将 css 文件打包为一个文件？？
- 我在某次打包后的文件（chunk）中看到了 module.hot.accept(...)，可以具体看下 webpack-dev-server做了什么？
- 自定义构建、启动或者其他命令下的引导模板？？
- React code splitting 做了什么？有哪些好的建议和 react 相关的代码分离的注意事项
- webpack server&client 同构？所以同构是哪里提出的概念？webpack 的同构又是有什么作用？
- MPA 的路由是怎么配置的（本地/线上）
  - 有两种路由：页面根路由，切换不同的入口；子路由，切换子页面
    - 利用 location.history?
  - 看到有一种实现是根据 hash 来的：监听 onhashchange
  - 本地的话，需要借助 webpack 的能力吧，毕竟本地服务时通过 webpack-dev-server 启动的
  - 主要是不清楚：如何将路由与文件相关联？
  - 所以 import.meta.webpackHot 中
    - import.meta 是 Node 提供而非 webpack 提供？

# webpack 的竞争者们

## Bun
到目前为止，github star 数量高于 webpack，说明大家还挺支持的，使用率呢？

- 不支持 windows
- 支持运行时？但是 webpack 不支持么？为啥要用它？
- 不支持 Vue、Angular 