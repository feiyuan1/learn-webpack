function getLoginModal(){
  return import(/* webpackPreload: true */ './loginModal').then(({default: LoginModal}) => LoginModal)
}

export default function createLoginButton(){
  const button = document.createElement('button')
  button.innerHTML = 'open modal'
  button.onclick = function(){
    getLoginModal().then(LoginModal => {
      const {changeModalStatus} = LoginModal()
      changeModalStatus(true)
    })
  }
  
  document.body.appendChild(button)
}