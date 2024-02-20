import { shouldUpdate } from "../../constants/key.js"
import {DB_NAME, storeMap} from '../../constants/db.js'

const UPDATE_KEY = 'update'

// 更新数据库存储的【强制更新 sw 版本】
const changeUpdateStatus = (resolve) => {
  const request = indexedDB.open(DB_NAME, 1)

  request.onsuccess = event => {
    const db = event.target.result
    const transaction = db.transaction([storeMap.esModule], 'readwrite')
    const objectStore = transaction.objectStore(storeMap.esModule)
    objectStore.put(shouldUpdate, UPDATE_KEY).onsuccess = () => {
      resolve()
    }
  }
}

const registerServiceWorker = async() => {
    if('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.register('./sw.js')

    if(registration.installing){
      console.log('installing')
    }

    if(registration.waiting){
      console.log('installed and waiting')
    }

    if(registration.active){
      console.log('active')
    }
  }
}

const addScript = (url) => {
  const script = document.createElement('script')
  script.src = url
  // defer async?
  script.type = 'module'
  document.body.appendChild(script)
}

// 这里也会导致时序问题：sw 未注册完成（甚至未开始注册），后面的逻辑就被执行
changeUpdateStatus(registerServiceWorker)

// 测试 404 fallback
addScript('./module')
