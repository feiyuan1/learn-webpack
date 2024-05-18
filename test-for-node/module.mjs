// const obj = {
//   val: 1
// }
// const setObj = function(val){
//   obj.val = val
// }

// setInterval(function(){
//   console.log('cjs.js: ', obj.val)
// }, 3000)

// export {obj, setObj}

let a = 1

const setA = (val) => {
  a = val
}

setInterval(function() {
  console.log('cjs.js: ', a)
}, 3000)

export {a, setA}
