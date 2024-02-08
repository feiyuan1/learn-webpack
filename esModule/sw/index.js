const registerServiceWorker = async() => {
    if('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.register('/sw/sw.js')

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

await registerServiceWorker()