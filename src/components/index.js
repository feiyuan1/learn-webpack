import { getMultModule, getMultModuleKey } from "../requireContext"

export default function Components(){
  // 方式一
  // const compoennts = getMultModuleKey(require.context('./', false, /demo.+\.js$/))
  // // 这里的 url 是相对于 requireContext.js 的路径，因为是在该文件中被 resolve 的
  // compoennts.map(url => {
  //   const fileName = url.split('/').pop()
  //   import(`./${fileName}`).then(({default: Component}) => {
  //     console.log('Component: ', Component)
  //   })
  // })

  // 方式二
  const compoennts = getMultModule(require.context('./', false, /demo.+\.js$/))
  compoennts.map(({default: Component}) => {
    console.log('Component: ', Component)
  })
}