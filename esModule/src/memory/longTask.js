import { start, stop } from "./heartBeatMonitor.js"

/**
 * 任务执行的优化策略是：尽可能早的在浏览器空闲时运行，否则在被需要时执行
 * 问题：requestIdleCallback 可能不会执行，无法保证“尽可能早”这个条件
 */
// const instance = new IdleValue(function)
function IdleValue(task){
  this.task = task.bind(this)
  this.value = null
  this.idleId = requestIdleCallback(() => {
    this.value = task()
  })
}


IdleValue.prototype.getValue = function(){
  if(!this.value){
    cancelIdleCallback(this.idleId)
    this.value = this.task()
  }
  return this.value
}

// function IdleQueue(){
//   this.queue = []
// }

// IdleQueue.prototype.pushTask = function(task){

// }


/**
 * PerformanceObserver 检测长任务
 */
var observer = new PerformanceObserver(function (list) {
  var perfEntries = list.getEntries();
  for (var i = 0; i < perfEntries.length; i++) {
  //   // Process long task notifications:
  //   // report back for analytics and monitoring
  //   // ...
    console.error('Perform: ', perfEntries[i])
  }
});
// register observer for long task notifications
observer.observe({ entryTypes: ["longtask"] });

/**
 * 创建一个长任务：长是因为每次遍历都 console.log
 * 大概耗时 300ms
 */

const longTask = function(){
  // setTimeout(()=>{
    let arr = new Array(5000).fill('isboyjc')

    arr.forEach(console.log)
  // },1000)
}

// 在脚本最外层执行
// longTask()

// 在 button click callback 中执行
const startLongTask = document.getElementById('start-long-task')
startLongTask.onclick = longTask

// 开始&暂停监控卡顿
const startWatch = document.getElementById('start-watch')
const endWatch = document.getElementById('end-watch')
startWatch.onclick = start
endWatch.onclick = stop

// 页面隐藏时停止监控
document.addEventListener("visibilitychange", function () {
  console.log(document.visibilityState);
  if(document.visibilityState === 'hidden'){
    console.warn('page in hidden')
    stop()
    return
  }
  start()
})
