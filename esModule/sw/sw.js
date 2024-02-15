/** service worker 脚本 */ 
// TODO 使用模块
// import {DB_NAME, storeMap} from '../../constants.js'

// fetch error fallbacks
const fallbacks = {
  404: './fallback/404.js',
  500: './fallback/500.js',
  default: './fallback/default.js'
}
// 用于本地调试，正常来讲，线上不会出现这种 case
const syntaxFallbacks = {
  TypeError: './fallback/typeerror.js',
}
// 缓存白名单
const includes = [/\.\/.*/, /sw\/.*/]
// 数据库名称
const DB_NAME = 'webpack-db'
// objectStore 的 name 与 key 的映射
const storeMap = {
  esModule: 'esmodule'
}
// 管理版本的键参数
const VERSION_KEY = 'version'
// 当前缓存版本
let curVersion;
// 获取缓存版本
const getVersion = (value) => `version${value}`
// 缓存有效期，以 ms 为 单位
const validDuration = 5000

// 处理缓存版本号
const manageCacheVersion = () => {
  // 此时，视为数据库已经创建好
  const request = indexedDB.open(DB_NAME, 1)

  request.onsuccess = event => {
    const db = event.target.result
    console.log('opened-db: ', db)
    const transaction = db.transaction([storeMap.esModule], 'readwrite')
    const objectStore = transaction.objectStore(storeMap.esModule)
    objectStore.get(VERSION_KEY).onsuccess = (event) => {
      console.log('get-key: ', event.target)
      const {curVersion: version, oldVersions = [], usingVersion: usedVersion} = event.target.result || {}
      curVersion = (version || 0) + 1
      oldVersions.push(version)
      objectStore.put({curVersion, oldVersions, usingVersion: usedVersion || curVersion}, VERSION_KEY)
    }
  }
}

const deleteOldCaches = (then) => {
  // db 中 oldVersions 清掉
  const request = indexedDB.open(DB_NAME, 1)

  request.onsuccess = event => {
    const db = event.target.result
    console.log('delte-opened-db: ', db)
    const transaction = db.transaction([storeMap.esModule], 'readwrite')
    const objectStore = transaction.objectStore(storeMap.esModule)
    objectStore.get(VERSION_KEY).onsuccess = (event) => {
      console.log('get-key: ', event.target)
      const {result} = event.target
      // cachestorage 清理
      result.oldVersions.map(async version => {
        await caches.delete(getVersion(version))
      })
      result.oldVersions = []
      result.usingVersion = curVersion
      objectStore.put(result, VERSION_KEY)
      then(result.usingVersion)
    }
    
  }
  console.log('clear cache.')
}

const delayClearCache = (version) => {
  // 暂时处理整个版本，比较简单（按理来说，处理某个文件可以最大程度的利用缓存）
  // 在产生新的 timer 时，清空旧的 timer，保证仅会存在一个 timer
  const request = indexedDB.open(DB_NAME, 1)

  request.onsuccess = event => {
    const db = event.target.result
    console.log('opened-db: ', db)
    const transaction = db.transaction([storeMap.esModule], 'readwrite')
    const objectStore = transaction.objectStore(storeMap.esModule)
    objectStore.get(VERSION_KEY).onsuccess = (event) => {
      const {timer: oldTimer} = event.target.result
      // 初始化时，可能不存在旧的 timer
      oldTimer && clearInterval(oldTimer)
      console.log('oldTimer: ', oldTimer)
      objectStore.put({...event.target.result, timer: setInterval(() => {
        caches.delete(getVersion(version))
        console.log('version expired: ', version)
      }, validDuration)}, VERSION_KEY)
    }
  }
}

// 监听 sw 的 install（安装） 事件
self.addEventListener('install', () => {
  console.log('installing...')
  manageCacheVersion()
})

// 监听 sw 的 activate（激活） 事件
self.addEventListener('activate', () => {
  console.log('activate: ', curVersion)
  // 清空缓存时机：1. sw 版本迭代 2. 缓存版本过期
  deleteOldCaches(delayClearCache)
})

const fetchWithFallback = async request => {
  console.log('custom fetch.')
  const cache = await caches.match(request)

  // 优先使用缓存
  if(cache) {
    console.log('use cache.')
    return cache
  }

  try{
    const response = await fetch(request)
    if(response.status !== 200){
      throw response.status
    }
    
    // 添加缓存(此时，curVersion 即为 usingVersion)
    const cache = await caches.open(getVersion(curVersion))
    cache.put(request, response.clone())
    console.log('put in cache.')

    return response
  }catch(e) {
    console.log('request error: ', e)
    if(fallbacks[e]){
      return fetch(fallbacks[e])
    }

    const syntaxError = Object.keys(syntaxFallbacks).find(type => {
      return e.toString().indexOf(type) !== -1
    })

    if(syntaxError){
      return fetch(syntaxFallbacks[syntaxError])
    }
    
    return fetch(fallbacks.default)
  }
}

self.addEventListener('fetch', e => {
  console.log('request: ', e.request)

  if(includes.some(reg => reg.test(e.request.url))){
    e.respondWith(fetchWithFallback(e.request))
  } else {
    e.respondWith(fetch(e.request))
  }
})