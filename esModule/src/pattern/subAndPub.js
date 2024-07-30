/**
 * store 调度中心，提供订阅、发布 API
 * state 发布者
 * subscribe提供的参数就是一个订阅者
 */
// createStore
const createManager = (reducer) => {
  if(!reducer || typeof reducer !== 'function'){
    return
  }
  let map = []
  let state = reducer(undefined, {})

  const getState = () => state
  const dispatch = (action) => {
    state = reducer(state, action)
    map.forEach(fn => fn())
  }
  const subscribe = listener => {
    map.push(listener)
    return () => {
      console.log('canceled')
      map = map.filter(fn => fn !== listener)
    }
  }

  return {
    subscribe,
    dispatch,
    getState
  }
}

const getManager = (() => {
  let manager = null
  return function(reducer) {
    if(!manager){
      manager = createManager(reducer)
    }
    return manager
  }
})()

/**
 * test part
 */
const initState = {
  status: 'init'
}
const reducer = (state = initState, action) => {
  if(action.type){
    return {
      status: action.type
    }
  }
  return state
}
const subBtn = document.createElement('button')
subBtn.innerText = 'subscribe'
const openBtn = document.createElement('button')
openBtn.innerText = 'openBtn'
const closeBtn = document.createElement('button')
closeBtn.innerText = 'close'
const store = getManager(reducer)

subBtn.onclick = () => {
  const unsub = store.subscribe(() => {
    console.log('changed: ', store.getState())
  })
  setTimeout(unsub, 10000)
}

openBtn.onclick = () => {
  store.dispatch({type: 'open'})
}

closeBtn.onclick = () => {
  store.dispatch({type: 'close'})
}

document.body.appendChild(subBtn)
document.body.appendChild(openBtn)
document.body.appendChild(closeBtn)

// import {StoreProvider, StoreContext} from 'react-redux'

// // store: dispatch getState subscribe
// const store = createStore()
// const Wraper = () => {
//   return <StoreProvider store={store}>
//     <Subscriber />
//     <Publisher />
//   </StoreProvider>
// }

// const Subscriber = () => {
//   const store = useContext(StoreContext)
//   const [message, setMessage] = useState()
//   useEffect(() => {
//     store.subscribe(() => {
//       if(message !== store.getState().message){
//         setMessage()
//       }
//     })
//   }, [store])
// }
// const Publisher = () => {
//   const handleClick = useCallback(() => {
//     store.dispatch(action)
//   }, [store])
// }
