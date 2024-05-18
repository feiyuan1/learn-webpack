console.log('----start-middleware-----')

// const express = require('express')
// const app = express()

const compose = function(middlewares){
  return function(ctx){
    const dispatch = function(index){
      const middleware = middlewares[index]
      try{
        return Promise.resolve(middleware(ctx, () => {
            return dispatch(index + 1)
        }))

      }catch(err){
        Promise.reject(err)
      }
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
  console.log('1-start')
  next()
  console.log('1-end')
})

app.use(function(ctx, next){
  console.log('2-start')
  next()
  console.log('2-end')
})

app.use(function(ctx, next){
  console.log('3-start')
  // next()
  console.log('3-end')
})

app.start()


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

const applyMiddleware = (middlewares) => {
  const storeApi = {dispatch: function(){}}
  let dispatch = storeApi.dispatch

  middlewares.slice().reverse().forEach(middleware => {
    dispatch = middleware(storeApi)(dispatch)
  })

  return {dispatch}
}

const {dispatch} = applyMiddleware([middleware1, middleware2])

dispatch()