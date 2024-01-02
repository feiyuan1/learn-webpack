const path = require("path")
// 所以这个插件具体做了哪些事情？
// 1. 动态生成 index.html（感觉主要是动态引入生成的 bundle？）
// 2. 替换 output 目录中已存在的 index.html
const HtmlWebpackPlugin = require("html-webpack-plugin")

// 这里有个细节：平常使用的模块语法（引入、导出）是 es6 语法；这里用到的是 CommonJS
module.exports = {
  mode: "development",
  // 如何使用多个导入的单入口？
  entry: {
    index: "./src/index.js",
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
  plugins: [new HtmlWebpackPlugin({ title: "管理输出" })],
  // module: {
  //   rules: [
  //     {
  //       test: /\.css$/i, // 处理 css 文件，先安装依赖，再配置
  //       use: ["style-loader", "css-loader"], // 逆序执行
  //     },
  //     {
  //       test: /\.(png|svg|jpg|jpeg|gif)$/i, // 处理 css 文件，先安装依赖，再配置
  //       type: "asset/resource",
  //     },
  //   ],
  // },
}
