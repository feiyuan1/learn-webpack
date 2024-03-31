// const applyRequestIdleCallback = require("./applyRequestIdleCallback") 

function A(){
  console.log(arguments)
}

A.prototype.test = function(){
  console.log('test')
}
// A(1, 2)
// const a = new A()
// a.test()

// applyRequestIdleCallback()

const memoize = (fun) => {
  const cache = new WeakMap()

  return function(...rest){
    if(cache[rest]) {
      console.log('use cache: ', cache[rest])
      return cache[rest]
    }
    const result = fun(...rest)
    cache[rest] = result
    console.log('add cache: ', result)
    return result
  }
}

const sum = memoize(function(a, b){
  return a + b
})

// sum(10, 20)
// sum(20, 20)
// sum(10, 20)

console.log('typeof: ', typeof window)

// https://www.nowcoder.com/discuss/353147762722152448?sourceSSR=search
// https://www.nowcoder.com/discuss/353154446739841024?sourceSSR=search
// const rl = require("readline").createInterface({ input: process.stdin });
// var iter = rl[Symbol.asyncIterator]();
// const readline = async () => (await iter.next()).value;

// void async function () {
//     const params = []
//     while(line = await readline()){
//         params.push(line)
//     }
//     // input
//     const [string] = params
    
//     // Write your code here
    
//     // 题目结果
//     console.log(result)
//     // output
//     while(line = await readline()){
//         let tokens = line.split(' ');
//         let a = parseInt(tokens[0]);
//         let b = parseInt(tokens[1]);
//         console.log(a + b);
//     }
// }()

// -----generator------

// 目的：在回调外拿到回调中的某个变量
// function* test(){
//   // yield 
//   const result = yield getData
//   console.log('result: ', result)
//   yield 1
//   yield 2
// }

// // 1. gen（生成器） 是 generator 方法（生成器构造方法）的返回值
// const gen = test()
// function getData(data){
//   console.log('getData', data, gen.next(data))
// }

// const p = new Promise(res => {res(123)})
// p.then(gen.next().value)

// 2. next 传递的值会作为上一个 yield 返回值
// 3. 可以递归调用生成器
// function* deepGen() {
//   yield 0;
//   yield* gen
// }

// const g = deepGen();
// console.log(g.next());
// console.log(g.next());
// console.log(g.next());
// console.log(g.next());

// delay 
const delay = (interval) => new Promise(res => {
  setTimeout(() => {
    res(`delay ${interval}`)
  }, interval)
})

// delay(1000).then((log) => {
//   console.log(log)
//   return delay(2000)
// }).then((log) => {
//   console.log(log)
//   return delay(3000)
// }).then(console.log).catch(console.log)

// 生成器实现
// function* generator(){
//   yield delay(1000)
//   yield delay(2000)
//   yield delay(3000)
// }

// const gen = generator()

// gen.next().value.then((log) => {
//   console.log(log)
//   gen.next().value.then(log => {
//     console.log(log)
//     gen.next().value.then(console.log)
//   })
// })

// const asyncGenerator = (generator) => {
//   const gen = generator()
//   function step(){
//     const {value, done} = gen.next()
//     if(done) {
//       return
//     }
//     Promise.resolve(value).then(value => {
//       console.log(value)
//       step()
//     })
//   }
//   step()
// }
// asyncGenerator(generator)

const asyncGenerator = (generator, args) => {
  return new Promise((resolve, reject) => {
    const gen = generator(args)

    const step = (type, res) => {
      let generatorResult
      try{
        generatorResult = gen[type](res)
      }catch(e) {
        reject(e)
      }
      const {done, value} = generatorResult
      if(done){
        resolve(value)
        return
      }
      Promise.resolve(value).then(data => {
      // console.log('comine', data)
        step('next', data)
      }, err => {step('throw', err)})
    }
    step('next')
  })
}

asyncGenerator(function* generator(){
  const result = yield delay(1000)
  console.log(result)
  const result2 = yield delay(2000)
  console.log(result2)
  const result3 = yield delay(3000)
  console.log(result3)
})
