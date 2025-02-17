/**
 * yieldInterval 指的是当前执行的这个宏任务最长可执行时间
 * yieldInterval 初始值为 5ms，之后动态设置为一帧时间
 *
 * 判断是否继续执行是在任务中判断的；schedule 只提供了 是否存在剩余时间 的 api
 * 任务是否执行 以及 是否发起一个宏任务 是两件事情：
 * 只要还存在未执行的任务时，总会发起一个新的宏任务，但任务是否会被执行取决于当前剩余时间
 *
 * 时间切片：基于宏任务
 * 任务切片：在任务实现中，基于时间切片，返回剩余任务，完成任务切片
 */
const taskQueue = []
// 一帧执行时间
let yieldInterval = 5
// 一帧的最后一个时间戳
let deadline = null
/**
 * 一种所有任务可以共享的实现
 * ps：在 react render 中，fiber 是所有任务可以共享的
 */

const shouldYield = () => {
  if (performance.now() >= deadline) {
    return true
  }
  return false
}

/**
 * 一个任务是否要出队取决于该任务的 callback 是否为空
 *
 * 任务的 callback 的返回值（执行结果）是带有含义的：
 * - 返回值类型为 function，说明任务没有执行完
 * - 返回值类型不是 function，说明任务执行完毕
 *
 * 任务的 callback 会在两个时机被更新：
 * - 开始执行任务时，置为 null
 * - 当次宏任务执行完毕时，更新为 callback 的返回值
 */
const workLoop = () => {
  let nextTask = null
  let task = taskQueue[0]
  try {
    while (task !== null && !shouldYield()) {
      if (typeof task.callback !== 'function') {
        taskQueue.shift()
        task = taskQueue[0]
      }

      callback = task.callback
      task.callback = null
      console.log('current-yieldInterval: ', yieldInterval)
      // 应该只有这里需要防御
      nextTask = callback()
    }
  } catch (e) {
    throw e
  } finally {
    // 这种比 i < totalCount 要好很多，对 task 内部逻辑是透明的
    if (typeof nextTask === 'function') {
      task.callback = nextTask
      return true
    }
    return false
  }
}

const performWorkUntilDeadline = () => {
  let hasMoreWork = true
  try {
    hasMoreWork = workLoop()
  } catch (e) {
  } finally {
    if (!hasMoreWork) {
      // 移除 port1 onmessage 的事件监听，否则进程无法关闭（node 中），回调函数无法销毁
      // port1.onmessage = null
      return
    }
    schedulePerformWorkUntilDeadline()
  }
}

const { port1, port2 } = new MessageChannel()

port1.onmessage = () => {
  deadline = performance.now() + yieldInterval
  // 执行可以中断的任务
  performWorkUntilDeadline()
}

const schedulePerformWorkUntilDeadline = () => {
  port2.postMessage('')
}

const init = () => {
  enququeTask()
  schedulePerformWorkUntilDeadline()
}

const enququeTask = () => {
  let i = 1
  const callback = () => {
    const totalCount = 2000000
    const start = performance.now()
    let flag = false
    for (; i < totalCount && !shouldYield(); i++) {
      const index = i
      Promise.resolve('resovled').then((data) => {
        if (!flag) {
          flag = true
          // 确认微任务开始执行的时间 => 也就是当前宏任务执行完毕的时间
          // 只有这个时间段等于 duration 才算符合预期
          console.log(performance.now() - start)
          console.log(data, index)
        }

        if (index === totalCount - 1) {
          console.log(data, index)
        }
      })
    }
    return callback
  }
  taskQueue.push({
    // 由于本例中任务执行顺序是严格按照插入顺序，所以不需要 id 来唯一标记任务
    // react 中由于添加了 任务优先级，所以执行顺序与插入任务顺序不同，需要有 id 来找到当前需要恢复的任务
    id: taskQueue.length && taskQueue.at(-1).id + 1,
    callback
  })
}

/**
 * 更新 yieldInterval 为平均一帧的时间
 */
let startTime = null
let count = 0
let rafId = null
const step = () => {
  count++
  let now = performance.now()
  const gap = now - startTime

  if (gap > 1000) {
    yieldInterval = Math.floor(gap / count)
    count = 0
    startTime = now
  }
  rafId = requestAnimationFrame(step)
}

const clearRaf = () => {
  if (!rafId) {
    return
  }
  cancelAnimationFrame(rafId)
  rafId = null
  count = 0
  startTime = null
}

const startRaf = () => {
  startTime = performance.now()
  rafId = requestAnimationFrame(step)
}

// 由于在页面被隐藏期间 raf 回调不会触发，会导致 yieldInterval 计算异常
// 这里在隐藏页面时，取消 raf，在恢复展示时，重新注册 raf 回调
document.addEventListener('visibilitychange', () => {
  const visibility = document.visibilityState
  if (visibility === 'visible') {
    startRaf()
    return
  }
  clearRaf()
})

// 默认进入页面开始计算 yieldInterval
startRaf()

const schedule = document.getElementById('schedule')

schedule.onclick = () => {
  // init()
  for (let i = 0; i < 10; i++) {
    init()
  }
}
