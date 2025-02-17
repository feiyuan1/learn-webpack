const h5Window = window.open('http://localhost:8000/jsBridge/h5.html', '_blank')
let nativePort = null
const events = {}
const EVENT_NAME = {
  SAY_HI: 'sayhi',
  CAPTURE_PIC: 'capturePic',
  GET_STATE: 'getState',
  PAGE_SHOW: 'pageShow'
}

const dispatch = function(data){
  nativePort.postMessage({name: this.name, data, shouldResponse: Boolean(this.callback)})
}

// 这里还是遵循：一个 nativeEvent 只有一个 callback
const registerHandler = (event, handler) => {
  const nativeEvent = events[event]
  if(!nativeEvent){
    throw 'the event to be registerred handler is not extist, u a registerring event: ' + event
  }
  nativeEvent.callback = handler
}
/**
 * 对于 native 主动触发的事件来说，不需要记录 handler
 * 对于 h5 主动触发的事件来说，只会存在一个 handler
 * 所以，不存在一个事件对应多个 handler 的情况
 */
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

const listenFromH5 = (event) => {
  const {data} = event
  let eventName = data
  if(typeof data !== 'string'){
    eventName = data.name
  }
  const e = events[eventName]
  if(!e){
    nativePort.postMessage({name: eventName, data: {result: 'error', error: 'there is no event named ' + eventName}})
    return
  }
  if(e.callback && typeof e.callback === 'function'){
    e.callback(data.data)
    return
  }
  let result = null
  if(e.handler && typeof e.handler === 'function'){
    result = e.handler(data.data)
  }
  e.dispatch(result)
  
  console.log('listen - event：', eventName, data)
}

const initWithMessageChannel = () => {
  const channel = new MessageChannel()
  h5Window.h5Port = channel.port1
  nativePort = channel.port2
}

const init = () => {
  window.native = {
    events,
    EVENT_NAME,
    dispatch,
    createEvent,
    registerHandler
  }
  
  initWithMessageChannel()
  initEvents()
  nativePort.onmessage = listenFromH5
}

init()
