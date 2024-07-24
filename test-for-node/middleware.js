console.log('----start-middleware-----')

/**
 * koa middleware
 */
const compose = function(middlewares){
  return function(ctx){
    const dispatch = function(index){
      const middleware = middlewares[index]
      // try{
      //   // 异步中间件同步化
      //   return Promise.resolve(middleware(ctx, () => {
      //       return dispatch(index + 1)
      //   })).catch(console.error)

      // }catch(err){
      //   console.log(err)
      // }

      // 异步中间件同步化
      // 与 koa 保持一致：不处理错误
      Promise.resolve(middleware(ctx, () => {
        return dispatch(index + 1)
      }))
    }
    return dispatch(0)
  }
}

const myExpress = function(){
  const middlewares = []
  const use = function(fn){
    middlewares.push(fn)
  }

  const start = function(){
    const ctx = {}
    const result = compose(middlewares)
    return result(ctx)
  }

  return {
    use,
    start
  }
}

const app= myExpress()

app.use(function(ctx, next){
  // throw 'error1'
  console.log('1-start')
  next()
  console.log('1-end')
})

app.use(function(ctx, next){
  console.log('2-start')
  next()
  console.log('2-end')
})

app.use(async function(ctx, next){
  await Promise.resolve(123).then(() => console.log('3-start'))
  // await Promise.reject(123)
  next()
  console.log('3-end')
})

app.use(function(ctx, next){
  console.log('4-start')
  console.log('4-end')
})

app.start()

/**
 * koa 的使用示例
 */

// const Koa = require('koa')
// const app1 = new Koa();

// app1.use(function(data, next) {
//   // throw 'error1-koa'
//   console.log('1-start')
//   next()
//   console.log('1-end')
// })

// app1.use(async function(data, next) {
//   await new Promise((resovle, reject) => {
//     setTimeout(() => {
//       resovle()
//       // reject('error2-koa')
//       console.log('2-start')
//     }, 1000)
//   })
//   next()
//   console.log('2-end')
// })

// app1.use(function(data, next) {
//   console.log('3-start')
//   console.log('3-end')
// })

// app1.listen(4000)

// redux-middleware
const middleware1 = (storeApi) => next => action => {
  console.log('1-start')
  next(action)
  console.log('1-end')
}

const middleware2 = (storeApi) => next => action => {
  console.log('2-start')
  next(action)
  console.log('2-end')
}

const reduxThunkMiddleware = storeApi => next => action => {
  console.log('thunk-start: ', action)
  if(typeof action === 'function'){
    action(next)
    return
  }
  next(action)
  console.log('thunk-end')
}

const applyMiddleware = (middlewares) => {
  const storeApi = {dispatch: function(){}}
  let dispatch = storeApi.dispatch

  middlewares.slice().reverse().forEach(middleware => {
    dispatch = middleware(storeApi)(dispatch)
  })

  return {dispatch}
}

const {dispatch} = applyMiddleware([reduxThunkMiddleware, middleware1, middleware2])

const getData = (params) => (dispatch, state) => {
  new Promise(resovle => {
    setTimeout(resovle, 1000)
  }).then(data => {
    dispatch({
      type: 'update',
      payload: data
    })
  })
}

// async logic
dispatch(getData({}))
// sync logic
dispatch()