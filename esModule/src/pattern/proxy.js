/**
 * vue3 代理模式，实现响应式数据
 * - 收集依赖
 *  - 回调临时存放在全局
 *  - 执行回调，读取属性
 *  - 回调执行完毕，将回调从全局中清除
 * - vue 监听数据变化
 *  - vue2 defineProperty
 *  - vue3 proxy + reflect
 * - 响应式更新（发布订阅）
 * 
 * 本案例的实现：
 * - 支持响应式更新
 * - 支持数据的响应式监听（包括嵌套对象）
 * - 支持收集依赖（添加依赖的途径只有一种：调用 listen 方法）
 */
const getManager = (() => {
  let manager = null
  return function() {
    if(!manager){
      manager = createManager()
    }
    return manager
  }
})()
const createManager = () => {
  const map = new Map()
  const subscribe = (target, fn) => {
    if(!map[target]){
      map.set(target, [])
    }
    const deps = map.get(target)
    deps.push(fn)
    // 查看订阅
    console.log('sub: ', deps, target)
  }

  const dispatch = target => {
    if(!map.get(target)){
      return
    }
    map.get(target).forEach(fn => {
      fn()
    })
  }

  return {
    subscribe,
    dispatch
  }
}

const {dispatch, subscribe} = getManager()

const handler =  {
  get(target, prop){
    const result = target[prop]
    // 收集依赖 
    if(isReacting){
      subscribe(target, activeEffect.at(-1))
    }
    return result
  },
  set(target, prop, value){
    target[prop] = value
    // 触发更新
    dispatch(target)
    return true
  }
}

const reactive = (obj, flag) => {
  if(flag){
    Object.keys(obj).forEach(k => {
      console.log('reactive: ', obj[k])
      if(obj[k] instanceof Object){
        obj[k] = new Proxy(obj[k], handler)
      }
    })
  }
  const p = new Proxy(obj, handler)
  return p
}

// 暂存 effect 注册的回调
const activeEffect = []
// 是否需要在读取属性时添加 effect
let isReacting
const listen = fn => {
  try{
    isReacting = true
    activeEffect.push(fn)
    fn()
  }catch(e){console.error(e)}finally{
    console.log('comhere')
    isReacting = false
    activeEffect.pop()
  }
}

const testCase1 = reactive({state: 1})

// 基础用例
// listen(() => {
//   console.log('testCase1 changed: ', testCase1.state)
// })

const testCase2 = reactive({state: 1, child: {state: 2}}, true)
// 测试嵌套对象
listen(() => {
  console.log('testCase2 changed: ', testCase2.child.state)
})

listen(() => {
  console.log('testCase2 changed: ', testCase2.state)
})

const testCase3 = reactive({state: 0})
// 测试依赖多个状态
// listen(() => {
//   console.log('testCase1-02 changed: ', testCase1.state)
//   console.log('testCase3-02 changed: ', testCase3.state)
// })

testCase1.state = 2
testCase3.state = 3
testCase2.child.state = 3
testCase2.state = 4
// console.log(testCase1.state)