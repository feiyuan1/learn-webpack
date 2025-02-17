/**
 * 检测页面卡死无法响应的情况
 * 
 * 阈值：1s 无法响应
 * 
 * testcase: longTask.js
 * 
 * 预期：longTask.js 持续 4s 占用主线程，导致 worker.onmessage 事件无法响应，web worker 检测到丢失心跳，上报异常并终止检测 
 * 
 * 参考文章：https://ysom.github.io/posts/46402/
 */
const worker = new Worker('./src/memory/webWorker.js')
let shouldStop = false
let started = false

worker.onmessage = (e) => {
  if(e.data?.type !== 'checkHealth' || shouldStop){
    return
  }
  worker.postMessage({type: 'active' , message: 'ok'})
}

const startMonitor = function(){
  if(started){
    return
  }
  started = true
  worker.postMessage({type: 'start'})
}

const stopMonitor = function(){
  if(shouldStop){
    return
  }
  shouldStop = true
  // 这里由于通信需要时间，终止检测也是有一定的延迟
  worker.postMessage({type: 'stop'})
}

const startBtn = document.getElementById('start-crash')
const endBtn = document.getElementById('end-crash')
startBtn.onclick = startMonitor
endBtn.onclick = stopMonitor

document.addEventListener("visibilitychange", function () {
  console.log(document.visibilityState);
})

window.addEventListener("beforeunload", function (e) {
  // e.preventDefault()
  // fetch('http://localhost:3000/test', {
  //   method: 'put',
  //   keepalive: true
  // })
  fetch('http://localhost:3000/test', {
    method: 'put',
    keepalive: true
  })
  fetch('http://localhost:3000/baidu', {
    method: 'put',
    keepalive: true
  })
})

const url = 'https://www.baidu.com'
fetch(url).catch(console.log).finally(() => {console.log(url)})
fetch('http://localhost:3000/baidu')

window.addEventListener("pagehide", function () {
  console.log('pagehide');
  fetch('http://localhost:3000/hide')
})

const prepareForFreeze = () => {
  console.log('prepareForFreeze')
  // Close any open IndexedDB connections.
  // Release any web locks.
  // Stop timers or polling.
};

const reInitializeApp = () => {
  console.log('reinit')
  // Restore IndexedDB connections.
  // Re-acquire any needed web locks.
  // Restart timers or polling.
};

document.addEventListener('freeze', prepareForFreeze);
document.addEventListener('resume', reInitializeApp);
