import { join } from "lodash"
import "./style.css"

function component() {
  const element = document.createElement("div")

  // lodash（目前通过一个 script 脚本引入）对于执行这一行是必需的
  element.innerHTML = join(["Hello", "webpack"], " ")
  element.classList.add("red")

  return element
}

document.body.appendChild(component())
