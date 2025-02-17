/**
 * 使用 ws 来模拟实现 b 站当前视频观看人数
 */

const intoBtn = document.getElementById('into')
const outBtn = document.getElementById('out')
const members = document.getElementById('members')
const info = {
  // userId: Math.ceil(Math.random() * 100000),
  videoId: new Date().getMinutes()
}

var ws = new WebSocket('ws://localhost:8080')
// Connection error
ws.addEventListener('error', function (event) {
  console.log('error: ', event)
})

// Listen for messages
ws.addEventListener('message', function (event) {
  try {
    const msg = JSON.parse(event.data)
    console.log('Message from server ', event.data)

    if (typeof msg !== 'object') {
      return
    }

    const { type, data } = msg
    if (type === 'init') {
      info.userId = data
    }

    if (type === 'watching') {
      if (!data.includes(info.userId)) {
        return
      }
      console.log('data: ', data)
      members.innerText = data.length
      return
    }
  } catch (e) {
    console.log(e)
  }
})

const sendMessage = (data) => {
  ws.send(
    new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    })
  )
}

intoBtn.onclick = () => {
  sendMessage({
    type: 'post',
    data: info
  })
}

outBtn.onclick = () => {
  sendMessage({
    type: 'delete',
    data: info
  })
}
