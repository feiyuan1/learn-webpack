const path = require("path")

// 这里有个细节：平常使用的模块语法（引入、导出）是 es6 语法；这里用到的是 CommonJS
module.exports = {
  entry: "./src/index.js", // 入口文件路径
  output: {
    // 打包后的文件地址（我猜 dist/main 这个路径也是 webpack 的默认值）
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
}
