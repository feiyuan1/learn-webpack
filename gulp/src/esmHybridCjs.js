import moduleEsm from "./moduleEsm"
import testForCjs from "./testForCjs"

export default function esmHybridCjs(flag){
  // if(!flag){
  //   import('./unitEsm.js').then(({default: unit}) => {
  //     unit()
  //   })
  // }
  moduleEsm()
  testForCjs()
  console.log('u are running test for esm')
}

// function testForEsm(){
//   console.log('u are running test for esm')
// }

