const promise1 = new Promise((resolve, reject) => {
  resolve(1)
}).then(data => data)

const promise2 = new Promise((resolve, reject) => {
  reject(2)
}).catch(err => ({err}))

const promise3 = new Promise((resolve, reject) => {
  resolve(3)
}).then(data => data)

/**
 * test for promise all when catch
 */
Promise.all([promise1, promise2, promise3]).then(console.log).catch(err => {
  console.warn('waring: ', err)
})


