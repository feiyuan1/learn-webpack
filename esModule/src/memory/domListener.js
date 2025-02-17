/**
 * case1
 */
var element1 = document.getElementById('launch-button');
console.log('element1: ', element1)
var counter = 0;
function onClick(event) {
   counter++;
   element1.innerText = 'text ' + counter;
}
element1.addEventListener('click', onClick);
element1.removeEventListener('click', onClick);
element1.parentNode.removeChild(element1);
/**
 * case2
 */
// var theThing = null;
// var replaceThing = function () {
//   var originalThing = theThing;
//   var unused = function () {
//     if (originalThing) // a reference to 'originalThing'
//       console.log("hi");
//   };
//   theThing = {
//     longStr: new Array(1000000).join('*'),
//     someMethod: function () {
//       console.log("message");
//     },
//   };
// };
// setInterval(replaceThing, 1000);

/**
 * case3
 */

// let click = document.querySelector("#click");
// let content = document.querySelector("#content")
// let arr = []

// function closures() {
//   let test = new Array(1000).fill('isboyjc')

//   return function () {
//     return test
//   }
// }

// click.addEventListener("click", function () {
//   arr.push(closures())
//   arr.push(closures())

//   content.innerHTML = arr.length
// });

// setInterval(function () {
//     arr.push(closures())
//     arr.push(closures())
  
//     content.innerHTML = arr.length
//   }, 300)