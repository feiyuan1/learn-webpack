const h5Window = window.open('http://localhost:8000/jsBridge/h5.html', '_blank')
const iframe = h5Window.document.createElement('iframe')
iframe.style.display = 'none'
iframe.id = 'jsBridge'
h5Window.jsBridgeIframe = iframe
const events = {}
const EVENT_NAME = {
  SAY_HI: 'sayhi',
  CAPTURE_PIC: 'capturePic',
  PAGE_SHOW: 'pageShow',
  GET_STATE: 'getState'
}

const dispatch = function(data) {
  h5Window.jsBridge.listenFromNative(this.name, data, Boolean(this.callback))
}

const createEvent = (name, handler) => {
  const event = {
    name,
    dispatch,
    handler
  }
  events[name] = event

  return event
}


const initEvents = () => {
  /**
   * native 主动触发的事件
   */
  native.createEvent(EVENT_NAME.SAY_HI)
  native.createEvent(EVENT_NAME.PAGE_SHOW)
  native.createEvent(EVENT_NAME.GET_STATE)
  
  /**
   * h5 触发的事件
   */
  // case2
  native.createEvent(EVENT_NAME.CAPTURE_PIC, (data) => {
    const {type} = data
    console.log('should capture picture with type ', type)
    return {data: 'https://test/img', result: 'ok'}
  })
}

// 这里还是遵循：一个 nativeEvent 只有一个 callback
const registerHandler = (event, handler) => {
  const nativeEvent = events[event]
  if(!nativeEvent){
    throw 'the event to be registerred handler is not extist, u a registerring event: ' + event
  }
  nativeEvent.callback = handler
}

const listenFromH5 = (event) => {
  const {name, data} = event.info
  const nativeEvent = events[name]
  if(!nativeEvent){
    h5Window.jsBridge.listenFromNative(name, {result: 'error', error: 'there is no event named ' + name})
    return
  }
  if(nativeEvent.callback && typeof nativeEvent.callback === 'function'){
    nativeEvent.callback(data)
    return
  }
  const handler = nativeEvent.handler
  let result = null
  if(handler && typeof handler === 'function'){
    result = handler(data)
  }
  nativeEvent.dispatch(result)
}

const init = () => {
  window.native = {
    events,
    EVENT_NAME,
    dispatch,
    createEvent,
    registerHandler
  }
  initEvents()
  iframe.addEventListener('dispatchNative', listenFromH5)

  const jsBridge = h5Window
}

init()
