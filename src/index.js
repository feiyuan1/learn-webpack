// import createLoginButton from "./Login"
// 怎么省略后缀名来着？
// import print from "./print"
// import iconUrl from "./icon.png"
// 样式定义打包后被放在了 style 标签中
// import "./style.css"
import Components from './components'
import DemoWithCss from "./components/demoWithCss"
import { square } from "./components/DemoForTreeShaking"
// import {consoleReact} from "./NormalImport"
import {greeter, loginCut} from './testForTs/index.js'
import multiEntry from './MultiEntryImportCut.jpg'
// import loginCutJpeg from './loginCut.jpeg'
import circle from './circle.svg'
// import { main } from "esModule/main"
// import createModule from 'esmodule'
// import testForLoader from "./testForLoader/index"
import a from './testForCircleDeps/a'
import initReact from "./testForSentry/index.jsx"

initReact()

// 测试批量引入文件
console.log(Components())

function asyncGetComponent() {
  const element = document.createElement("div")
  // lodash（目前通过一个 script 脚本引入）对于执行这一行是必需的
  element.innerHTML = "init-content-in-div"
  // 插入图片
  // const icon = new Image()
  // icon.src = iconUrl
  // icon.alt = ""
  // icon.width = 100
  // element.appendChild(icon)
  // element.classList.add("red")
  return import(/* webpackChunkName: "lodash-vendor" */"lodash/join")
    .then(({ default: join }) => {
      element.innerHTML = join(["Hello", "webpack"], " ")
      return element
    })
    .catch((error) =>
      console.error("an error occurred while loading the component", error)
    )
}

asyncGetComponent().then((element) => {
  document.body.appendChild(element)
})

console.log('client-node-env-NODE_ENV:', process.env.NODE_ENV, 'TWO: ', TWO, "TEST: ", TEST)

// const createLoginButton = () => {
//   import(/* webpackPrefetch: true */ './components/Login/Login').then(({ default: createLoginButton }) => {
//     createLoginButton()
//   })
// }
// createLoginButton()

// 尝试样式表的热替换
DemoWithCss()

// 测试 TreeShaking
console.log('square: ', square(2))

// 测试常规引入第三方工具
// consoleReact()

// 测试使用 ts
console.log(greeter('world.'))
// 测试使用 data URI（assets/inline）
// 打包后，loginCut 会被替换为 data URI（作为 data URI 被注入到 bundle）
// console.log('loginCutDataURI: ', new URL(loginCut))
// 测试使用 asset/resource
// 打包后，会将文件输出到 dist(output 路径)，且会将 multiEntry 替换为 url（发送一个单独的文件，并导出 url）
console.log('multiEntrySrc: ', multiEntry)
// 测试使用 asset/source
// console.log('loginCutJpegContent: ', loginCutJpeg)
console.log('circleContent: ', circle)

// if('serviceWorker' in navigator){
//   // 页面加载完毕后
//   window.addEventListener('load', () => {
//     // 注册 sw
//     navigator.serviceWorker.register('/service-worker.js').then(registration => {
//       console.log('SW registered: ', registration);
//     }).catch(registrationError => {
//       console.log('SW registration failed: ', registrationError);
//     });
//   })
// }

// 尝试使用 package.json exports
// cmd 在该项目根路径下执行 npm link /path/to/esmodule 把本地包链接到该项目中
// 在 esmodule 包中利用 exports 指定导出的文件
// console.log('main: ', main)
// console.log('esmoudle: ', createModule)

// 尝试使用 loader
// console.log('loader-result: ', testForLoader)

// 测试循环依赖的表现
console.log('circle-a: ', a())

// web-dev-server 调用 window.location.reload 会触发该事件
window.onload = () => {
  console.log('load')
}

// 是 demoWithCss 支持HMR
if(module.hot){
  module.hot.accept('./components/demoWithCss.js',()=>{
  console.log("module updated..")
  DemoWithCss()
  })
 }