const input = document.getElementById('input')
const click = document.getElementById('click-raf')
const content = document.getElementById('input-content')

const debounce = function(cb, delay){
  let timer = null
  const _cb = cb.bind(this)
  return function(...args){
    if(timer){
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      _cb(...args)
    }, delay)
  }
}
input.onchange = debounce(function(e){
  const value = e.target.value

  content.innerText += `${value}`

  requestAnimationFrame(function(){
    console.log('repaint')
  })
}, 100)

input.onfocus = function(){
  console.log('foucsed...')
}

click.onclick = function(){
  // console.log('clicked...')
  requestAnimationFrame(function(){
    console.log('repaint')
  })
  requestAnimationFrame(function(){
    console.log('repaint1')
  })
}