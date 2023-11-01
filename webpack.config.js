const path = require("path")

// 这里有个细节：平常使用的模块语法（引入、导出）是 es6 语法；这里用到的是 CommonJS
module.exports = {
  entry: "./src/index.js", // 入口文件路径
  // 分包是指有多个 output？
  output: {
    // 打包后的文件地址（我猜 dist/main 这个路径也是 webpack 的默认值）
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
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
