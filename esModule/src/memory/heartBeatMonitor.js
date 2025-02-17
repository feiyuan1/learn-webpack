// let callback = null
let rafId = null
// case1: 假定阈值为 出现低于 50
const MIN_FPS = 50

function testHeart(fps){
  // const now = performance.now()
  if(fps >= MIN_FPS){
    return
  }
  // times++
  console.error('there is somthing wrong in page')
  // callback && typeof callback === 'function' && callback()
}

function countFps() {
  let fps = 0 // 帧率 每秒帧数
  /**
   * Date.now
   * performance.now 区别在于 后者 没有被限制在毫秒的精度内，可以精确到 微秒 且 它不受系统时间的影响（更稳定）
   */
  let last = performance.now()
  let count = 0
  const animate = () => {
    rafId = requestAnimationFrame(animate)
    count++

    const now = performance.now()
    const duration = now - last
    if(duration >= 1000){
      fps = Math.round(count * 1000 / duration)
      count = 0
      last = now
      console.log('fps: ', fps)
      testHeart(fps)
    }
  }

  rafId = requestAnimationFrame(animate)
}

// export const registerCallback = function(cb){
//   if(callback){
//     return
//   }
//   callback = cb
// }

// 开始监控
export const start = countFps

// 停止监控
export const stop = () => {
  cancelAnimationFrame(rafId)
}