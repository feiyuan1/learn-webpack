/**
 * 测试代码，用于观察内存占用情况
 */

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
// var permuteUnique = function(nums) {
//   const result = permute(nums)
//   console.log('result: ', result)
//   return result
// };
var permuteUnique = function (nums) {
  const indeies = nums.map((item, index) => index)
  const res = []
  const strings = []
  function deep(paths) {
    if (paths.length === nums.length) {
      // console.log('strings: ', strings, paths.join())
      const temp = paths.map((index) => nums[index])
      if (!strings.includes(temp.join())) {
        res.push(temp)
        strings.push(temp.join())
      }
      return
    }
    for (let i = 0; i < indeies.length; i++) {
      const cur = indeies[i]
      if (paths.includes(cur)) {
        continue
      }
      deep([...paths, cur])
    }
  }

  deep([])
  return res
}

// 不晓得为啥：window.performance.memory 一直没有更新
const calculateMemory = function (target, cases) {
  const start = window.performance.memory.totalJSHeapSize / Math.pow(10, 6)
  console.log('start: ', start, window.performance.memory.usedJSHeapSize)
  cases.map((args) => target(args))
  const end = window.performance.memory.totalJSHeapSize / Math.pow(10, 6)
  console.log(
    'memory: ',
    end,
    end - start,
    window.performance.memory.usedJSHeapSize
  )
}

// console.log('result: ', calculateMemory(permuteUnique,[ [1,2,3], [1,3,4,5,6,7,8], [1,3,4,5,6,2,8], [1], [1,2], [1,2,3,4],[1,2,3,4,5]]))

// let foo = null;
function outer() {
  let foo = {
    // 给foo变量重新赋值
    bigData: new Array(1000000).join('this_is_a_big_data'), // 如果这个对象携带的数据非常大，将会造成非常大的内存泄漏
    inner: function () {
      console.log(`inner method run`)
    }
  }
  let bar = foo
  function unused() {
    // 未使用到的函数
    console.log(`bar is ${bar}`)
  }
}
for (let i = 0; i < 1000; i++) {
  outer()
}
