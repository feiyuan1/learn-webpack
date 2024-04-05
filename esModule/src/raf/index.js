function countFps() {
  let fps = 0 // 帧率 每秒帧数
  /**
   * Date.now
   * performance.now 区别在于 后者 没有被限制在毫秒的精度内，可以精确到 微秒 且 它不受系统时间的影响
   */
  let last = performance.now()
  let count = 0
  const animate = () => {
    requestAnimationFrame(animate)
    count++

    const now = performance.now()
    const duration = now - last
    if(duration >= 1000){
      fps = Math.round(count * 1000 / duration)
      count = 0
      last = now
      console.log('fps: ', fps)
    }
  }

  requestAnimationFrame(animate)
}

countFps()