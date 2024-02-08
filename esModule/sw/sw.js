// service worker 脚本

// 监听 sw 的 install（安装） 事件
self.addEventListener('install', () => {
  console.log('installing...')
})

// 监听 sw 的 activate（激活） 事件
self.addEventListener('activate', () => {
  console.log('activate')
})

const fetchWithFallback = async request => {
  console.log('custom fetch.')
  try{
    const response = await fetch(request)
    if(response.status !== 200){
      throw response.status
    }
    return response
  }catch(e) {
    console.log('request error: ', e)
    return fetch('./fallback.js')
  }
}

self.addEventListener('fetch', e => {
  console.log('request: ', e.request)

  e.respondWith(fetchWithFallback(e.request))
})