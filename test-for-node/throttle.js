console.log('----- start throttle')

// 执行指定时间段中的第一次
// function throttle(fn, timeout){
//   let timestamp = Date.now()
//   let flag = false
//   return function(){
//     const now = Date.now()
//     if(now - timestamp >= timeout){
//       timestamp = now
//       flag = false
//     }

//     if(!flag){
//       fn()
//       flag = true
//     }
//   }
// }

// const fn = throttle(function(){console.log('click')}, 3000)

// 执行指定时间段中的最后一次
function debounce(fn, timeout){
  let timer = null
  return function(){
    if(timer){
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      fn()
    }, timeout)
  }
}

const fn = debounce(function(){console.log('click')}, 3000)

// function testCase(){
//   fn()
// }

// function testCase(){
//   fn()
//   fn()
//   fn()
//   fn()
// }

function testCase(){
  fn()
  fn()
  setTimeout(fn, 4000)
}

testCase()