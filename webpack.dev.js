// 所以这个插件具体做了哪些事情？
// 1. 动态生成 index.html（感觉主要是动态引入生成的 bundle？）
// 2. 替换 output 目录中已存在的 index.html
const HtmlWebpackPlugin = require("html-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin");
const { merge } = require("webpack-merge")
const common = require("./webpack.common.js")
const {NODE_ENV} = require("./env.js")


module.exports = merge(common(NODE_ENV.DEV), {
  // devtool: 'eval-cheap-module-source-map',
  // devtool: 'eval',
  devtool: 'inline-source-map',
  // devtool: false,
  optimization: {
    usedExports: true,
    // minimize: true,
    concatenateModules: false,
    minimizer: [
      // 注意：下面使用到的文件路径均为打包后的 chunk 文件路径
      new TerserPlugin({ 
        // Terser 使用说明：https://github.com/terser/terser
        terserOptions: {
          // compress: false, // 是否处理压缩（似乎该配置也可以删掉 dead-code）
          // mangle: false // 是否更换变量、方法名称
          // toplevel: false // 是否删除 dead-code&更换变量名称
        },
        // extractComments: true, // 剥离符合要求的注释到新的文件中
        // exclude: /index/, // 排除掉不需要压缩处理的 chunk
        // test: /index.*\.js(\?.*)?$/i, // 指定需要进行压缩的 chunk
      })
],
  },
  plugins: [
    new HtmlWebpackPlugin({ title: "dev-webpack 学习", chunks:['index'] }), 
    // new webpack.optimize.ModuleConcatenationPlugin()
  ],
})