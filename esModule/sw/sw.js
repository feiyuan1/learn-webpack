// service worker 脚本

// 监听 sw 的 install（安装） 事件
self.addEventListener('install', () => {
  console.log('installing...')
})

// 监听 sw 的 activate（激活） 事件
self.addEventListener('activate', () => {
  console.log('activate')
})

const customFetch = async request => {
  console.log('custom fetch.')
  return fetch(request)
}

self.addEventListener('fetch', e => {
  console.log('request: ', e.request)

  e.respondWith(customFetch(e.request))
})