```
// 防止意外发布代码，指的是发包？
private: true
```

> 安装一个被用于生产环境的依赖时，使用 --save，安装仅本地使用的依赖时，使用 --save-dev

# manifest

管理模块间的交互.

### Qs

- 动态生成的 bundle 名称，如何在 index.html 内引用的呢？
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
尝试后发现，命令行中添加 --node-env 并不会影响 mode 的值，与文档所说的不符？

# source map
webpack.config.js 中通过 devtool 选项配置 sourceMap 风格，开发环境下默认值是 eval

- 在源文件与打包后的文件末尾都添加加了若干行注释
  - sourceURL
  - sourceMappingURL
- 不同的 source map 风格打包生成的辅助文件也不同
  - 比如，devtool: source-map 会生成 .js .js.map 两个文件；devtool: eval-cheap-module-source-map 只会生成 .js 文件
- 有些风格，比如 hidden-source-map 适用于生产环境，生成 source map，但不会在打包后的文件末尾添加注释映射到源文件，避免被普通用户看到源码，这种可以将生成的 source map 文件提供给错误报告工具辅助排查线上问题，比如 sentry