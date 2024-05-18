const obj = {
  val: 1
}
const setObj = function(val){
  obj.val = val
}

setInterval(function(){
  console.log('cjs.js: ', obj.val)
}, 3000)

module.exports = {obj, setObj}