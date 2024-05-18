const HtmlWebpackPlugin = require("html-webpack-plugin")
const {merge} = require("webpack-merge")
const common = require("./webpack.common.js")
const {NODE_ENV} = require("./env.js")
const {scripts} = require("./scripts/build.js")

module.exports = merge(common(NODE_ENV.PROD), {
  // devtool: false,
  devtool: 'hidden-source-map',
  plugins: [
    new HtmlWebpackPlugin({ title: "webpack 学习", chunks:['index'], template: './public/index.html', inject: 'body', 
    templateParameters: {
      scripts,
      test: 'testing'
    }
  }), 
  ]
})