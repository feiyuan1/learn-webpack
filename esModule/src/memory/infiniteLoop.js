const click = document.getElementById('click')
click.onclick = function(){
  fetch('https:www.baidu.com')
}

let arr = []

function closures() {
  let test = new Array(1000).fill('isboyjc')

  return function () {
    return test
  }
}


// setInterval(function () {
//     arr.push(closures())
//     arr.push(closures())
  
//     content.innerHTML = arr.length
//   }, 300)
const start = document.getElementById('start')
start.onclick = function(){
  setTimeout(() => {
    while(true){
      // arr.push(closures())
      arr.push(closures())
    
      content.innerHTML = arr.length
    }
  })
}