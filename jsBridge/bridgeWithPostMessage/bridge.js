const callbacks = []
const shouldKeepAlive = [
  'pageShow',
  'sayhi'
]

// listen response from native
const listenFromNative = event => {
  const {name, data, shouldResponse} = event.data
  if(typeof data === 'object' && data && data.result === 'error'){
    console.error(data.error)
    return
  }
  let result = null
  callbacks[name] && callbacks[name].forEach(cb => {
    result = cb(typeof data === 'object' ? data?.data : data)
  })
  if(shouldResponse){
    jsBridge.dispatchNative({name, data: result})
  }
  if(!shouldKeepAlive.includes(name)){
    delete callbacks[name]
  }
  console.log('messagechannel-message: ', event, event.data)
}

// listen event from native
const registerHandler = (event, callback) => {
  const eventName = event.name || event
  if(!callbacks[eventName]){
    callbacks[eventName] = []
  }
  if(typeof callback === 'function'){
    callbacks[eventName].push(callback)
  }
}

// h5 -> native send back sth by listenFromNative
const dispatchNative = (event, callback) => {
  registerHandler(event, callback)
  h5Port.postMessage(event)
}

const initWithMessageChannel = () => {
  if(!window.h5Port){
    return
  }
  h5Port.onmessage = listenFromNative
}

const init = () => {
  if(window.jsBridge){
    return
  }
  window.jsBridge = {
    listenNative: registerHandler,
    dispatchNative,
  }

  initWithMessageChannel()
}

init()