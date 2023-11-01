import { join } from "lodash"
// 怎么省略后缀名来着？
import print from "./print"
// import iconUrl from "./icon.png"
// 样式定义打包后被放在了 style 标签中
// import "./style.css"

function createButton() {
  const button = document.createElement("button")
  button.innerHTML = "click me and check the console"
  button.onclick = print
  return button
}

function component() {
  const element = document.createElement("div")
  const button = createButton()
  // lodash（目前通过一个 script 脚本引入）对于执行这一行是必需的
  element.innerHTML = join(["Hello", "webpack"], " ")
  // 插入图片
  // const icon = new Image()
  // icon.src = iconUrl
  // icon.alt = ""
  // icon.width = 100
  // element.appendChild(icon)
  // element.classList.add("red")
  element.appendChild(button)
  return element
}

document.body.appendChild(component())
