// service worker 脚本

// 监听 sw 的 install（安装） 事件
self.addEventListener('install', () => {
  console.log('installing...')
})

// 监听 sw 的 activate（激活） 事件
self.addEventListener('activate', () => {
  console.log('activate')
})