import './bridgeWithPostMessage/bridgeForNative.js' // 利用 postMessage 进行通信
// import './bridgeWithIframe/bridgeForNative.js' // 利用 custom native 进行通信

const sayhi = document.getElementById('sayhi')
const pageShow = document.getElementById('pageShow')
const getState = document.getElementById('getState')
const {events, EVENT_NAME, registerHandler} = native

// case3 native trigger sayhi event
sayhi.onclick = () => {
  const event = events[EVENT_NAME.SAY_HI]
  event.dispatch(123)
}

pageShow.onclick = () => {
  const event = events[EVENT_NAME.PAGE_SHOW]
  event.dispatch()
}

getState.onclick = () => {
  const event = events[EVENT_NAME.GET_STATE]
  registerHandler(EVENT_NAME.GET_STATE, console.log)
  event.dispatch()
}
