```
// 防止意外发布代码，指的是发包？
private: true
```

> 安装一个被用于生产环境的依赖时，使用 --save，安装仅本地使用的依赖时，使用 --save-dev

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

> html 文件引入 script 标签时，script 标签定义了 defer 属性，避免阻塞 html 文件解析（减少白屏事件 FCP first content paint）

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
- "由于生成的 2 个 html 文件都没有指定包含的 chunk，所以默认情况下，2 个会共享所有 chunk。也就是说，index.html 中包含 test chunk，test.html 中也包含 index.js" 这是符合默认行为预期的么？

# webpack-dev-server

## 用处

- 实时页面预览
- 启动本地服务
- 启动代理，解决本地开发中的跨域

## 实时页面预览

> 输出资源的位置：
>
> 编译后的文件存放在内存，所以无法在项目目录中看到 dist
>
> 而构建（build 命令）生成的文件放在磁盘中

### 页面自动刷新

本质是调用 window.location.reload API

当没有开启 HMR 或者 HMR 失败时，都会进行自动刷新

> 会有问题：页面中的状态信息无法保留，所以出现了 HMR

### HMR

只更新改变的模块，其他模块的信息和状态保留

webpack.HotModuleReplacementPlugin 将接口暴露在 module.hot 以及 import.meta.webpackHot 中

> import.meta 是 es6 新增的属性（伴随 esm 的出现产生的），用于描述当前引入模块的信息
> webpack 在此基础上，增加了 webpackHot 属性

- 各个框架也都有对应的工具
  - react-hot-loader（ps: 在 RN 中，新版本推荐使用 react fast refresh）
  - Angular HMR
  - Vue-loader
  - ...

> webpack-dev-server 新版本默认开启，webpack.config devServer.hot
>
> 发现 css 文件可以触发 HMR，js 文件不可以
>
> 是因为添加的 style-loader & css-mini-extract-plugin.loader 内置了 css 文件热更新的逻辑
>
> 而 js 需要注册模块的热更新回调，否则会自动刷新页面，浏览器会加载新的模块，但其中导出的方法需要根据使用情况重新调用

```
// index.js
// 使用 module.hot API 监听需要支持热替换的文件

module.hot.accept(moduleName, callback)
```

### 原理

分为客户端和服务端两部分

服务端：

- 启动 websocket 服务器
  - 与 websocket 客户端通信
- 创建 webserver 服务
  - 开始监听请求，响应请求，从内存读取内容并发送
  - 监听事件，当编译完毕时，调度 websocket 服务器通知浏览器
  - 创建 client.js 并将其编译到 chunk 中
- 使用 webpack-dev-middleware
  - 监听文件更新
  - 输出编译后的静态资源
  - 监听编译完毕
  - 通知 webserver 服务

客户端 client.js 分两部分：

- 启动 websocket 客户端
  - 收到消息，通知 HMRPlugin
- HMRPlugin
  - 判断需要热更新还是页面刷新
    - 若是前者，通过 jsonp 加载模块（拉取新代码）
    - 删除旧模块
    - 执行新的模块代码
    - 调用 accept 注册的回调

其中，HMRPlugin 会在需要浏览器更新时生成两个文件：json，包括本次编译 hash 以及有变更的 chunk name；js，编译后生成的新代码

## 启用本地服务

安装 webpack-dev-server，cli 中执行 npx webpack serve 即可

> 一般提供的根路径为第一个入口起点生成的 html 页面

### 访问本地服务的其他页面

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

## 解决本地开发跨域

主要通过 webpack-dev-server 来解决本地的跨域问题

### 原理

- 在本地启动服务器，让应用运行在 localhost 下的某个端口上
- 利用 http-proxy-middleware(http 代理中间件)，将客户端的请求转发到后端服务器上

> 服务端之间不存在同源策略的限制
>
> 请求由谁发出？浏览器发出，则受限制，服务端发出，则不受限制

### 配置方式

```
// webpack.config.json

devServer.proxy: {
  '/path': {
    secure: bool, // true（默认值）为不接收发送到 https 服务器上的请求
    'pathRewrite': {'/path': ''}, // 用 '' 替换 '/path'
    changeOrigin: bool, // Request Header 中的 Origin 是否替换(但是被替换为什么？)
    target: 'https://xxx.xx.xx' // target url
  }
}
```

## Qs

- module 是 webpack 提供的吗？难道也是 node 提供的?（这应该在 node 全局对象里可以看到答案）
  - 已知：webpack.config.js 中使用 cjs 语法 module.exports 导出了 webpack 配置
    - 那么，整个 module 是 node 提供的？

# webpack 中的 require

## require

- 本身是一个方法，用于加载模块
- 带有 context 属性

影响：

- 创建上下文
- 创建上下文模块

## 自定义上下文

调用 require.context 可以创建自定义上下文，返回的是一个 require 方法，它同样可以：

- 加载模块，接收参数 request
- 携带 resolve 属性，该属性也是一个函数，返回模块 id
  - 可能是模块的相对 url，相对于执行 resolve 方法所在文件路径

## 模块 id

可以用于 module.hot.accept

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

# webpack 中的模块系统

支持两种：cjs esm

> 所以 Webpack 支持所有符合 es5 标准的浏览器

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

# SSR

devServer.devMiddleware.serverSideRender 选项可以开启 SSR

# PWA（Service Worker 使用）

Progressive Web Application 渐进式网络应用（可以离线访问的应用）

Workbox-webpack-plugin 是一个可以产生 service-worker.js 脚本的插件，通过脚本利用缓存使应用可以离线访问

> 如何产生 sw 脚本？构建，输出到 /dist（output 目录）

webpack-dev-server 不是 serve 应用程序到 dist 的，而 sw 脚本通过 Workbox 是输出在 dist 路径下的，所以需要找一个 serve 工具，比如 http-serve，serve 到 dist 路径

> 因为离线效果是通过 sw + 缓存实现的，可以从 devtool 中看到：
>
> 1 sw 信息（比如版本号、脚本，只不过脚本是被 uglify 过的）
>
> 2 cache Storage 中的内容（也就是 build 产出的内容被缓存了下来）

## Qs

- 为什么要等到 load（页面加载完毕）再注册 sw？
- 是否会自动拉取新版本，什么时机产生新的版本？
  - 这可能需要查看 Workbox 官方文档了。。

# 资源模块

是 webpack5 新提出的一种模块类型，又分为 4 种模块类型，来替换之前引入不同资源使用的 loader

## asset/resource

> 替代 file-loader

1 输出单独的文件到 dist 目录（指定的 output 路径）
2 导出 url
3 可以通过配置，指定该模块类型打包时不输出文件

```
// 源文件
import mainImage from './images/main.png';

img.src = mainImage; // '/dist/151cfcfa1bd74779aadb.png'
```

```
// 打包后
mainImage = '/dist/151cfcfa1bd74779aadb.png'

// 打包后的目录结构
- dist
  - index.js
  - 151cfcfa1bd74779aadb.png
```

## asset/inline

> 替代 url-loader

将文件替换为 data URI

## asset/source

> 替代 raw-loader

引入文件内容（string 类型）

### 资源查询条件

比扩展名更精细的指定引入的模块类型，也就是通过正则匹配

```
// webpack.js
{
  resourceQuery: /react/,
  type: 'asset/source'
}

// src/index.js
import A from 'a.png?react'
```

## asset（通用资源类型）

> 替代之前的 url-loader + 资源大小配置

1 默认策略是：根据指定的资源大小临界值，大于临界值处理为 asset/resource，小于临界值处理为 asset/inline
2 默认临界值为 8kb（可以更改）
3 可以指定策略，即 generator 赋值为 function，返回值为 true 处理为 asset/inline

## Qs

- 在公司有使用 import A from 'a.png?react'
  - <A /> A 可以直接作为一个 React 组件使用
  - 这是如何实现的？？？

# Loader

转换模块内容，辅助 webpack 完成构建

默认情况下，webpack 支持的模块类型有：es5 模块、资源模块、CommonJS 模块、AMD 模块、WebAssembly 模块（支持在 Web 平台运行，for C/C++/Rust 等语言）

所以对一些其他类型的模块无法编译：css、ts

> loader 本身也是模块，可以是一个单独的包，也可以是项目中的一个文件

## 特点

- 可异步
- 可在 node 中运行
- 链式调用
- 需要兼容 node（所以通常会提供两个文件：index.js cjs.js）
- 能够产生任意的额外文件
- plugin 可以为 loader 带来更多特性（提供一些功能支持）

## 开发

1 导出函数

接收参数：模块内容，两种类型：string | Buffter(Object)、sourcemap、metadata（辅助信息）

返回值：类型为 string（且最后一个 loader 返回值必须符合符合 js 语法？）

> 比如：css-loader 虽然处理的 css 文件，但返回的也是 js 内容

2 runtime

> 应该避免对每个处理的模块都生成同样的通用代码，把这部分代码抽离到单独的文件（甚至文件夹）中，也就是共享模块
>
> 再在 loader 的主逻辑中引用这些模块

原因？

好处：

- 逻辑清晰
- 可能占用空间不同？构建速度不同？

## 类型

- preLoader
- normal loader
- inline loader
- postLoader

其中：

- preLoader 和 postLoader 可以通过 Rule.enforce（'pre' | 'post'）来指定;
- 内联/行内 loader 是在引用（import/require）模块时指定的 loader（存在多个 loader 时通过 ！来分割）
  - 不推荐，后续可能会被废弃
- 其他的都是 normal loader

## loader 的不同阶段

### pitch（预处理）

不同类型的 loader 执行顺序：post -> inline -> normal -> pre

同类型的 loader 执行顺序（use 中数组）：从左到右

在此期间调用的是 loader 导出的 pitch 方法，当该方法返回值时，剩余的 loader 不管是 pitch 还是 normal 阶段都不会执行，且开始逆向执行 loader 的 normal 阶段

> 比如：存在 3 个 loader（按照 normal 执行顺序）：A -> B -> C
>
> 其中 B 导出的 pitch 方法返回了内容，那么执行路径是：
> C pitch -> B pitch -> B normal -> C normal

> loader 上下文中存在 data 是在 pitch 和normal 阶段共享的

### normal（正常代码执行）

不同类型的 loader 执行顺序： pre -> normal -> inline -> post

同类型的 loader 执行顺序（use 中数组）：从右到左

这就是 loader 转换模块内容的执行过程

## loader 自测

1 Rule.use

可以通过 path.resolve() 解析相对路径

```
{
  test: /\.css$/i,
  use: [path.resolve('./css-loader/dist/index.js')]
}
```

2 resolveLoader.modules

可以使用多个 loader

3 npm link package-url

到目标项目（使用 loader 的项目）的根路径下执行命令，其中 package-url 是相对于该路径的相对路径

> 不管是通过相对路径还是软链，即使 loader 依赖的包在使用方中没有安装，也不会有问题：module not found

## 常用的 loader

### css-loader & style-loader & less-loader

- css-loader
  - 识别并解析 css 语法
  - 所以如果只添加了 css-loader，样式可以被解析但不会在页面生效
- style-loader
  - 将 css 插入到 style 标签，再插入 head
- 像 less-loader 这种，应该最先执行，将其他语法转为 css，再由 css-loader 解析

## Qs

- style-loader 将 css 插入 style 标签？还做了其他的吗？
- 为什么要把通用代码抽离出来（runtime）
- loader 什么时候接收 buffer 什么时候接收 string
- 为什么在官网找不到 default function&pitch 的 API 说明？

# Stats Data

构建完成后的概括信息，可以看到模块统计信息与模块间的依赖关系图

有两种形式：输出 json 文件 | stats object

> 两种形式的数据结构不一定相同，但是信息是一致的

## json 文件

1 命令行

在 CLI 中执行 webpack --profile --json=compilation-stats.json

> 常用于分析输出结果

## stats object

1 作为回调参数

是 compiler.run 提供的回调的第二个参数，包含 module 和 chunk 信息

2 webpack config option

stats，可以配置输出哪些信息（这似乎是输出到控制台的？）

## 具体内容

- chunk 信息
  - chunk-id
  - 包含的模块
  - chunk name
- bundle（output 目录中的文件）信息
  - 包含的 chunk
  - bundle name
  - 大小
- entry 信息
  - entry name
  - 对应的 output 信息
  - 涉及的 chunk
- module 信息
  - 涉及的 chunk
  - module 对应的原始文件的路径

## Qs

- webpack config stats option 是控制输出到控制台的信息还是 json 文件还是回调中参数的？

# plugin

首先补充些前情提要：

## compiler 实例

包含 webpack 环境的配置信息，比如 webpack 模块实例、compilation 实例、生命周期钩子

> 实例本身的作用只是维持生命周期运行，其他的功能都委托到了已经注册的插件上完成（比如输出资源、打包、加载）
>
> 一般来说，只会创建一个主要 compiler 实例，可以配合创建多个字 compiler 实例来代理特定任务

### 一些属性

- hooks 管理钩子
- run 开始编译
  - 接收回调，且该回调的参数：error stats
  - 其中第二个参数是 stats object，包含了编译后的 module 和 chunk 信息，见 stats data
- watch 开始监听变更

### 生命周期钩子

这些钩子都在 compiler.hooks 下

```
compiler.hooks.entryOption
```

只是列出来其中一些：

entryOption -> beforeRun -> run -> compile -> thisCompilation -> compilation -> make -> shouldEmit -> emit -> afterEmit

从左到右的调用时机分别是：

- entryOption - webpack config entry 被处理后
- beforeRun - 开始构建时，立刻调用
- run - 意味着开始一次构建
- compile - 开始创建 compilation
- thisCompilation - 在 compilation 事件触发之前（这个阶段主要是 初始化 compilation）
- compilation - 创建 compilation 实例完毕
- make - compilation 创建结束之前（这个阶段主要是 从 entry 开始递归分析依赖，准备对每个模块进行构建）
- shouldEmit - 在资源输出之前（告知是否需要输出资源）
- emit - 输出资源到 output 路径之前
- afterEmit - 输出资源之后

> 对于异步 hook 来说，在当前阶段执行完毕后，应该调用回调中的 callback 方法，告知 webpack 进入下一阶段
>
> 或者使用 tabPromise 的话，调用 resolve 或 reject 结束当前阶段

## compilation 实例

作为 compiler 事件回调的参数，包括当前模块资源、编译生成的资源、生命周期钩子，会对依赖图中的所有模块进行编译

> 每一次文件的变更，都会创建新的 compilation 实例

在编译阶段，模块会经历：加载 load -> 封存 seal -> 优化 optimization -> 分块 chunk -> 哈希 hash -> 重新创建 restore

### 一些属性

- compilation.modules 变异后的模块数组
- module.fileDependecies 模块中引入的源文件路径的数组
- compilation.chunks 输出的 chunk 集合
- chunk.getModules chunk 中引入的模块
- chunk.files 该 chunk 生成的 output 中的文件的集合

### 生命周期钩子

挂在 compilation.hooks 下，下面列了一些：

> records: 是一块数据片段，用于放置跨多次构建的模块标识符，可以从中看出每次构建之间的模块变化

- record
  - 将 compilation 相关信息存到 record 中
- seal
  - 该 compilation 实例不再接收新的模块
- hash
  - 为该 compilation 实例添加 hash
- moduleHash
  - 为模块添加 hash
- buildModule
  - 构建模块开始之前调用

## 是什么

在功能上的扩展，本身是一个对象，必须声明 apply 方法（该方法会在插件安装时被 compiler 调用）

## 如何工作

webpack 在运行生命周期过程中，广播事件，插件可以在对应阶段下注册回调，以此在特定阶段执行自己的插件任务

> 也就是说，插件可以在 webpack 整个生命周期中生效，而 loader 只能在打包之前运行

## 使用

webpack config plugins option，通过 new 创建插件实例并插入数组

## 功能

- 资源管理
  - MiniCssExtractPlugin 将 css 单独抽离为一个文件
  - HtmlWbpackPlugin 生成 html 文件，并且引入 output 下的资源（css、js 等）
- 环境变量注入
  - DefinePlugin 创建全局变量/对象
- ...

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
- webpack 在编译时想要忽视某些文件怎么做（就像 package.json sideEffects 那样可以在没有引用时，忽视对某些文件的引入；就像 tsconfig 中的 include、exclude）
  - 我以为默认只会处理 src 下的文件
- buffer 是啥？

# webpack 了解

> webpack 5 要求 node 版本在 10.13.0+

## 构建进度百分比

[参考](https://dev.to/smelukov/webpack-5-progress-percentage-calculation-345o)

在大型项目构建中可能会发现问题：进度（百分比）可能会错乱、抖动

> 百分比的计算：构建好的模块数量 / 总模块数量

原因是无法在构建之前知晓准确的模块，随着构建，可能产生的模块会越来越多

解决历程：

1 ProgressPlugin 支持指定总的模块数量（不一定非常准确，大概的就可）

比如，在一次构建时，拿到总的模块数量，再赋值给插件

2 ProgressPlugin 插件指定 entry points 代替模块，也就是计算方式为：构建好的入口数量 / 总入口数量

3 webpack 内部，在一次构建完成后，存储总模块数量

## 底层代码

### 导入

同步导入会被转为 -> **webpack_require**
异步导入 -> **webpack_require**.e
