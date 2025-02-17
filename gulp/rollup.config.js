const commonjs = require('@rollup/plugin-commonjs')
// 将 css 样式放入 style 标签并插入 head 中
const css = require('rollup-plugin-import-css')
const resolve = require('@rollup/plugin-node-resolve')
const babel = require('@rollup/plugin-babel')
// 将 css 混入 js 文件中，并提供 runtime 工具，将 css 样式放入 style 标签并插入 head 中（也就是在打包后的文件中引入了 node_modules 下的文件）
// const styles = require('rollup-plugin-styles')
const clear = require('rollup-plugin-clear')

// 可以返回数组，根据不同的入口有不同的配置
module.exports = {
  input: {
    hybrid: './src/esmHybridCjs.js',
    // index: './src/index.js', // 涉及样式，不需要 cjs
    // testForEsm: './src/testForEsm.js',
    // testForCjs: './src/testForCjs.js',
  },
  output: [
    {
      dir: 'dist/rollup/umd',
      format: 'umd',
      name: 'testUmd'
    },
    // {
    //   dir: 'dist/rollup/es',
    // },
    // {
    //   dir: 'dist/rollup',
    //   format: 'cjs'
    // }
  ],
  external: /node_modules/,
  plugins: [
  // clear old output
    clear({targets: ['dist/rollup']}),
    resolve(),
    babel({
      presets: ['@babel/preset-react'],
      exclude: 'node_modules/**',
    }),
    commonjs(),
    css({inject: true}),
    // styles()
  ],
  watch: {
    include: 'src/**'
  }
}