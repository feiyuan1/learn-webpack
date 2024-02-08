const registerServiceWorker = async() => {
    if('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.register('/esModule/sw/sw.js')

    if(registration.installing){
      console.log('installing')
    }

    if(registration.waiting){
      console.log('installed and waiting')
    }

    if(registration.active){
      console.log('active')
    }
  }
}

const addScript = (url) => {
  const script = document.createElement('script')
  script.src = url
  // defer async?
  script.type = 'module'
  document.body.appendChild(script)
}

await registerServiceWorker()

// 测试 fallback
addScript('/module')
