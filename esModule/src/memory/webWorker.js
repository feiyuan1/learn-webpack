let isHealthy = true
let timer = null
const DELAY = 1000

const checkHealth = () => {
  isHealthy = false
  console.log('healty...')
  timer = setTimeout(() => {
    // 检测到卡顿，终止检测
    if(!isHealthy){
      console.error('page cannot interaction')
      return
    }
    checkHealth()
  }, DELAY)
  postMessage({type: 'checkHealth'})
}

const removeCheck = () => {
  clearTimeout(timer)
}

onmessage = function(e){
  if(e.data?.type === 'start'){
    checkHealth()
  }
  if(e.data?.type === 'stop'){
    removeCheck()
  }
  if(e.data?.type === 'active'){
    isHealthy = true
  }
}