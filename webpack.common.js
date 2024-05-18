const path = require("path")
const webpack = require("webpack")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const {NODE_ENV} = require("./env.js")
const WorkboxPlugin = require("workbox-webpack-plugin")

// 先这样临时删除 dist 目录
const rimraf = require('rimraf');
rimraf('./dist', ()=>{})

// 这里有个细节：平常使用的模块语法（引入、导出）是 es6 语法；这里用到的是 CommonJS
module.exports = (mode) => {
  const devMode = mode === NODE_ENV.DEV
  return {
  // 如何使用多个导入的单入口？
  entry: {
    index: {import: "./src/index.js"},
    test: {import: "./src/test/testIndex.js"},
  }, // 入口文件路径
  // 准确来说是「代码分离」：将代码分离到不同的 bundle 中
  output: {
    // 打包后的文件地址（我猜 dist/main 这个路径也是 webpack 的默认值）
    // 我应该可以指定 name 的生成规则？？
    filename: "[name].[contenthash].js", // 动态生成 bundle 名称
    path: path.resolve(__dirname, "dist"),
    // 清除 output 目录无用的文件
    clean: true,
  },
  optimization: {
    // 设置 client 代码上下文中的 NODE_ENV 的值
    // nodeEnv: process.env.NODE_ENV,
    // 将 webpack 运行时代码提出为一个包
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
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
      }
    },
  },
  devServer: {
    devMiddleware: {
      // 这里还能开启服务端渲染呢
      // wroteToDisk: true
    }
  },
  plugins: [
    new HtmlWebpackPlugin({ title: "test of webpack 学习" , filename: 'test.html', chunks: ['test']}), 
    // 设置 client 代码上下文中的 NODE_ENV 的值
    // '1+1' 被当作代码片段来使用
    new webpack.DefinePlugin({  TWO: '1+1', TEST: JSON.stringify(process.env.NODE_ENV)}),
    new MiniCssExtractPlugin({
      filename: devMode ? "[name].css" : "[name].[contenthash].css",
      chunkFilename: devMode ? "[id].css" : "[id].[contenthash].css",
    }),
    // new WorkboxPlugin.GenerateSW({
    //   // 这看起来会总是使用新版本
    //   skipWaiting: true,
    //   clientsClaim: true
    // })
  ],
  module: {
    rules: [
      {
        test: /\.ts$/i,
        use:['ts-loader']
      },
      {
        test: /\.css$/i, // 处理 css 文件，先安装依赖，再配置
        use: [{
          loader: MiniCssExtractPlugin.loader, // 将 css 抽离到文件中，通过 link 标签将文件引入 html 中
          options: {},
        }, "css-loader"], // 逆序执行
        // use: [path.resolve('./css-loader/dist/index.js')], // 逆序执行
        // use: ["style-loader", "css-loader"], // 将 css 内容以 style 标签的形式插入 DOM
      },
      {
        test: /\.(|jpg|gif)$/i, // 处理图片，先安装依赖，再配置
        type: "asset/resource",
        generator: {
          // 不输出文件，当然运行 html 会导致报错
          // emit: false
        }
      },
      {
        test: /\.png$/i,
        type: "asset/inline"
      },
      {
        test: /\.(jpeg|svg)/,
        type: "asset/source"
      },
      // {
      //   test: /testForLoader.*\.js$/,
      //   use: ['test-loader']
      // }
    ],
  },
}}