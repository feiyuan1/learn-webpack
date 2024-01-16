import './demo.css'

export default function DemoWithCss(){
  const p = document.createElement('p')
  p.innerText = 'this is a demo with css'
  p.classList.add('red')
  document.body.appendChild(p)
}