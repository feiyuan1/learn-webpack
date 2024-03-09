const progress = document.getElementById('progress')
const startButton = document.getElementById('startButton')
const currentTasks = document.getElementById('currentTaskNumber')
const totalTasks = document.getElementById('totalTaskCount')
const logElem = document.getElementById('log')
let fragment = null

const taskQueue = []
let count = 0
let shouldUpdateView = false

function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // 包含最小值和最大值
}

const updateProgress = function(){
  currentTasks.innerHTML = count
  progress.value = count
}

const addLog = function(text){
  shouldUpdateView = true
  fragment = fragment || document.createDocumentFragment()
  const div = document.createElement('div')
  div.innerHTML = text
  fragment.appendChild(div)
}

const updateView = function(){
  if(shouldUpdateView){
    logElem.appendChild(fragment)
    const gap = logElem.scrollHeight - logElem.clientHeight
    if(gap){
      logElem.scrollTop = gap
    }
    updateProgress()
  }
  shouldUpdateView = false
  fragment = null
}

const pushTaskQueue = function(handler, data){
  taskQueue.push({handler, data})
  count++

  window.requestIdleCallback(runTaskQueue)
}

const runTaskQueue = function(){
  if(!taskQueue.length){
    return
  }

  const {handler, data} = taskQueue.shift()
  handler(data)
  requestAnimationFrame(updateView)
}

const createTask = function(index){
  addLog(`task-id ----${index} started`)

  for(let i = 0; i < getRandomIntInclusive(50, 100); i++){
    addLog(`这是第 ${i} 条日志`)
  }
}

startButton.onclick = function(){
  const total = getRandomIntInclusive(100, 200)
  totalTasks.innerText = total
  progress.max = total

  for(let i = 0; i < total; i++){
    pushTaskQueue(createTask, i)
  }
}