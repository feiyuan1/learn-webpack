// import createLoginButton from "./Login"
// 怎么省略后缀名来着？
// import print from "./print"
// import iconUrl from "./icon.png"
// 样式定义打包后被放在了 style 标签中
// import "./style.css"

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
  return import("lodash")
    .then(({ default: _ }) => {
      element.innerHTML = _.join(["Hello", "webpack"], " ")
      return element
    })
    .catch((error) =>
      console.error("an error occurred while loading the component")
    )
}

asyncGetComponent().then((element) => {
  document.body.appendChild(element)
})

console.log('client-node-env-NODE_ENV:', process.env.NODE_ENV, 'TWO: ', TWO, "TEST: ", TEST)

// const createLoginButton = () => {
//   import(/* webpackPrefetch: true */ './Login').then(({ default: createLoginButton }) => {
//     createLoginButton()
//   })
// }
// createLoginButton()
