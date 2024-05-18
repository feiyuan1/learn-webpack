console.log('run precomit')
const child_process = require('child_process');
// const fs = require('fs');
// const msg = fs.readFileSync(process.argv[2], 'utf-8').trim();
// console.log('msg: ', msg, process.argv)
console.log('process.argv: ', process.argv)
const rl = require("readline").createInterface({ input: process.stdin });
var iter = rl[Symbol.asyncIterator]();
const readline = async () => (await iter.next()).value;
readline().then((line)=>{
  console.log('line: ', line)
})
// console.log('line: ', await readline())