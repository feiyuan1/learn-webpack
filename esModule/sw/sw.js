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

const deleteOldCaches = () => {
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
    }
    
  }
  console.log('clear cache.')
}

// 监听 sw 的 install（安装） 事件
self.addEventListener('install', () => {
  console.log('installing...')
  manageCacheVersion()
})

// 监听 sw 的 activate（激活） 事件
self.addEventListener('activate', () => {
  console.log('activate')
  // 每次 sw 版本更新时清空缓存
  // TODO 可以指定一个过期时间？如果没有新版本的 sw 的话？
  deleteOldCaches()
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

    // 添加缓存
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