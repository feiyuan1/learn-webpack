const callbacks = []
const shouldKeepAlive = [
  'pageShow',
  'sayhi'
]

const dispatch = (n, e) => {
  const event = new Event(n)
  const info = {}
  info.name = e.name || e
  e.data && (info.data = e.data)
  event.info = info
  jsBridgeIframe.dispatchEvent(event)
}

// listen event from native
const listenNative = (event, callback) => {
  const eventName = event.name || event
  if(!callbacks[eventName]){
    callbacks[eventName] = []
  }
  if(typeof callback === 'function'){
    callbacks[eventName].push(callback)
  }
}

// dispatch native event
const dispatchNative = (event, callback) => {
  const eventName = event.name || event
  if(!callbacks[eventName]){
    callbacks[eventName] = []
  }
  if(typeof callback === 'function'){
    callbacks[eventName].push(callback)
  }

  dispatch('dispatchNative', event)
}

// for native
const listenFromNative = (event, data, shouldResponse) => {
  if(data && data.result === 'error'){
    throw data.error
  }
  if(!callbacks[event]){
    return
  }

  let result = null
  // 理论上来讲：如果 native 需要 h5 返回值，那么 callbacks[event].length <= 1
  callbacks[event].forEach(callback => {
    result = callback(typeof data === 'object' ? data?.data : data)
  })
  if(shouldResponse){
    dispatchNative({name: event, data: result})
  }

  if(!shouldKeepAlive.includes(event)){
    delete callbacks[event]
  }
}

const initFrame = () => {
  if(!jsBridgeIframe){
    throw 'bridge in native inited error'
  }
  document.body.appendChild(jsBridgeIframe)
  return true
}

const init = () => {
  if(window.jsBridge){
    return
  }
  if(!initFrame()) {
    return
  }

  window.jsBridge = {
    listenNative,
    dispatchNative,
    listenFromNative
  }
}

init()