window.addEventListener('load', function(){
  console.log('loaded')
 })

new Promise(function (resolve) {
  console.log('promise1')
  resolve()
 }).then(function () {
  console.log('promise2')
 })
 
