const HtmlWebpackPlugin = require("html-webpack-plugin")
const {merge} = require("webpack-merge")
const common = require("./webpack.common.js")
const {NODE_ENV} = require("./env.js")

module.exports = merge(common(NODE_ENV.PROD), {
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({ title: "webpack 学习" }), 
  ]
})