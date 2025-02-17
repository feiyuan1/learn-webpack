import './bridgeWithPostMessage/bridge.js' // 利用 postMessage 实现通信
// import './bridgeWithIframe/bridge.js' // 利用 custom event 实现通信

const openModalBtn = document.getElementById('openModal')
const capturePic = document.getElementById('capturePic')
const selectPic = document.getElementById('selectPic')
const start = document.getElementById('start')

// case1: dispatch without callback
openModalBtn.onclick = () => {
  jsBridge.dispatchNative('openModal')
}

// case2: dispatch with callback which has some data and data bind event
capturePic.onclick = () => {
  jsBridge.dispatchNative({
    name: 'capturePic',
    data: {
      type: 1 // camera
    }
  }, data => {
    console.log('caputrepic-url: ', data)
  })
}

// case2.1: redispatch same event
selectPic.onclick = () => {
  jsBridge.dispatchNative({
    name: 'capturePic',
    data: {
      type: 2 // column
    }
  }, data => {
    console.log('selectpic-url: ', data)
  })
}

// case3 listen event from native with response which has some data
start.onclick = () => {
  jsBridge.listenNative('sayhi', data => {
    console.log('listen native sayhi: ', data)
  })
}

// pageshow 事件，希望每次事件触发都能调用该回调
jsBridge.listenNative('pageShow', () => {
  console.log('pageshow')
})

// case4：listen event from native with transferring data
jsBridge.listenNative('getState', () => {
  return 'isWorking'
})