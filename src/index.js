import { join } from "lodash"
import iconUrl from "./icon.png"
// 样式定义打包后被放在了 style 标签中
import "./style.css"

function component() {
  const element = document.createElement("div")
  element.innerHTML = join(["Hello", "webpack"], " ")
  // 插入图片
  const icon = new Image()
  icon.src = iconUrl
  icon.alt = ""
  icon.width = 100
  element.appendChild(icon)
  // lodash（目前通过一个 script 脚本引入）对于执行这一行是必需的
  element.classList.add("red")

  return element
}

document.body.appendChild(component())
