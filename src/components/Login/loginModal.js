import { compileStyleObject } from "../../utils"

export default function LoginModal(){
  const div = document.createElement('div')
  div.style = compileStyleObject({
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    left: 0,
    top: 0,
    visibility: 'hidden'
  })
  document.body.appendChild(div)
  const shadow = document.createElement('div')
  shadow.style = compileStyleObject({
    width: '100%',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    background: 'rgba(0,0,0,0.5)'
  })
  const modalContent = document.createElement('span')
  modalContent.innerHTML = 'modal content...'
  div.appendChild(shadow)
  div.appendChild(modalContent)

  const changeModalStatus = function(status){
    if(status){
      div.style.visibility = 'visible'
      return
    }
    div.style.visibility = 'hidden'
  }

  shadow.onclick = () => changeModalStatus(false)
  
  return {changeModalStatus}
}