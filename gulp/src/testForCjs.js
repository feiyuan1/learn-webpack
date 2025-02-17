const http = require('http')
console.log('type: ', typeof http)

module.exports = function testForCjs(){
  console.log('u are running test for cjs')
}

console.log('exports: ', exports, module.exports)