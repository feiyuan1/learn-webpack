/**
 * 监听静态资源的状态：
 *  - 指定的静态资源加载完毕
 *  - 静态资源抛出的异常的监听
 */

const observer = new PerformanceObserver(function (list) {
  console.log('entries: ', list.getEntries())
  list.getEntries().forEach((entry) => {
    if (entry.name.indexOf('/test') >= 0) {
      console.log('entry: ', entry)
    }
  })
})

observer.observe({ entryTypes: ['resource'] })

window.onerror = function () {
  console.log('erroreventargs: ', arguments)
}

window.addEventListener(
  'error',
  (e) => {
    if (e instanceof ErrorEvent) {
      return
    }
    console.log('event-listener: ', e)
  },
  true
)

console.error = function () {
  console.log('console.error: ', arguments)
}

try {
  Promise.reject('1123')
} catch (e) {
  console.log(e)
}

try {
  throw 123
} catch (e) {
  console.log(e)
}

fetch('http://localhost:3000/test1', { method: 'put' })
navigator.sendBeacon('http://localhost:3000/cross/test')

import('https://static.zhihu.com/heifetz/6319.216a26f4.65c10347e5266e702e6.css')
  .then(() => {})
  .catch(console.log)
try {
  console.log(JSON.parse('1)'))
} catch (e) {
  console.log('syntax-errot: ', e)
}

const file = new File(['this is content'], 'test.txt', { type: 'text/plain' })
console.log('file: ', file)
throw 123
