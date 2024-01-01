export function compileStyleObject(object){
  if(typeof object !== 'object'){
    throw new Error('input is not an object!')
  }

  return Object.keys(object).reduce((result, key) => {
    return `${result}${key}:${object[key]};`
  }, '')
}