console.log('---binaryInsert----')
// 用二分法插入
function findInsertIndex(arr, num){
  let left = 0;
  let right = arr.length - 1
  while(left <= right){
    const middle = Math.ceil((left + right) / 2)
    const item = arr[middle]
    if(item === num){
      return middle
    }

    if(item < num){
      left = middle + 1
    }

    if(item > num){
      right = middle - 1
    }
  }

  return left
}

console.log(findInsertIndex([1,2,3,4], 3))