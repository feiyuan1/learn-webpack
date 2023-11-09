// 重复引用同一个依赖 lodash
import _ from "lodash"

console.log(_.join(["Another", "module", "loaded!"], " "))

export default function print() {
  console.log("I get called from print.js")
}
