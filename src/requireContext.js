// 匹配多个模块，每个模块有唯一的模块 id，可用于 module.hot.accept
export function getMultModuleKey(require){
  // resolve 方法返回模块 id
  return require.keys().map(require.resolve);
}

export function getMultModule(require){
  // require 本身接收 request 参数，即 id
  return require.keys().map(require)
}
