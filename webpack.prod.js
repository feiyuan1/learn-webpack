const HtmlWebpackPlugin = require("html-webpack-plugin")
const {merge} = require("webpack-merge")
const common = require("./webpack.common.js")

module.exports = merge(common, {
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({ title: "webpack 学习" }), 
  ]
})