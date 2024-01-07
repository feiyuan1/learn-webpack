const requireLogin = require('./Login.js')
console.log(requireLogin.default) // 类似于 import
// 匹配多个模块，每个模块有唯一的模块 id，可用于 module.hot.accept
function importMultModule(requireContext){
  // resolve 方法返回模块 id
  return requireContext.keys().map(requireContext.resolve);
}
console.log('require-context: ', importMultModule(require.context('./', false, /\.js$/)))
