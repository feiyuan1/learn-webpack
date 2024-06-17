/**
 * 
 * @param {strign} url 
 * @param {object} options 
 * - timeout number
 * - customTimeout boolean
 * @returns promise
 */
function customFetch(url, options){
  const {timeout = 1000, customTimeout} = options || {}
  const controller = new AbortController()

  const timer = setTimeout(() => {
    // abort request with specific reason
    controller.abort('timeout')
  }, timeout)

  return fetch(url, {signal: controller.signal}).then(response => {
    if(!response.ok){
      // 服务端指明需要稍后重试
      if(response.headers.has('Retry-After')){
        const retryDelay = 0 
        // case1 503
        if(response.status === 503){
        
        }
        // case2 301
        if(response.status === 301){
          redirectUrl = response.headers.get('Location')
        }
        // 用 promise 包一层，可以让使用方拿到最终的结果
        return new Promise(res => {
          setTimeout(() => {
            res()
          }, retryDelay)
        }).then(() => customFetch(redirectUrl, options))
      }
    }
    return response
  }).catch(e => {
    /**
     * 默认处理超时的逻辑
     */
    // log report...
    console.error(e)
    /**
     * 使用方自定义超时逻辑
     */
    if(customTimeout){
      throw e
    }
  }).finally(() => {
    console.log('...cleartimeout...')
    clearTimeout(timer)
  })
}

customFetch('/esmodule/package.json').then(content => {
  console.log('content: ', content)
})