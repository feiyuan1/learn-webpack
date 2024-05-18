console.log('-----start generator')
/**
 * generator 初始使用示例
 */
// 生成器函数
// function* test(){
//   yield 1
//   yield 2
//   yield 3
// }

// // 返回的是生成器
// const gen = test()

// console.log('value: ', gen.next())
// console.log('value: ', gen.next())
// console.log('value: ', gen.next())

/**
 * 用 generator 模拟实现 async await，具体场景为：隔 1000ms 2000ms 3000ms 打印一次日志 
 */
const delay = function(interval){
  return new Promise((res) => {
    setTimeout(() => {
      res(`delay ${interval}`)
    }, interval)
  })
}

// 利用 promise 的链式调用
// delay(1000).then((log) => {
//   console.log(log)
//   return delay(2000)
// }).then((log) => {
//   console.log(log)
//   return delay(3000)
// }).then(console.log)

function* test(){
  const step1 = yield delay(1000)
  console.log('step1: ', step1)
  const step2 = yield delay(2000)
  console.log('step2: ', step2)
  const step3 = yield delay(3000)
  console.log('step3: ', step3)
  return 'asyncTest'
}

// async & await 使用样例
// async function asyncTest(){
//   const step1 = await delay(1000)
//   console.log('step1: ', step1)
//   await delay(2000)
//   console.log('step2: ', step3)
//   await delay(3000)
//   console.log('step3: ', step3)

//   return 'asyncTest'
// }

// asyncTest().then(console.log) // asyncTest

function asyncGenerator(generator){
  return new Promise((resolve, reject) => {
    try {
      const gen = generator()

      function step(type, res){
          const {value, done} = gen[type](res)
          if(value){
            Promise.resolve(value).then((result) => {
              if(!done){
                step('next', result)
              }
              if(done){
                resolve(result)
              }
            }).catch(err => step('throw', err))
          }
      }

      step('next')
    } catch (error) {
      reject(error)
    }
  })
}

asyncGenerator(test).then(result => console.log('final-result: ', result))

console.log('-----generator end')