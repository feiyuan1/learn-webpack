const WebSocket = require('ws')
const { WebSocketServer } = WebSocket
// 用户 id 与 视频 id 的映射表
const dataBase = {}
// 建立连接的客户端
const clients = []

const saveData = ({ userId, videoId }) => {
  if (!dataBase[videoId]) {
    dataBase[videoId] = []
  }
  const client = clients.find((item) => item.id === userId)
  dataBase[videoId].push(client)
  console.log('save succeed', client.id)
}

const updateList = () => {}
const wss = new WebSocketServer({ host: 'localhost', port: 8080 })

wss.on('connection', function connection(ws) {
  ws.on('error', console.error)

  ws.on('message', function message(msg) {
    const {
      type,
      data: { videoId, userId },
      data
    } = JSON.parse(new TextDecoder().decode(msg))
    console.log('received: %s', msg)
    if (type === 'post') {
      saveData(data)
      updateList()
    }
    if (type === 'delete') {
      dataBase[videoId] = dataBase[videoId].filter(({ id }) => id !== userId)
    }

    dataBase[videoId].forEach(({ ws }) =>
      ws.send(
        JSON.stringify({
          type: 'watching',
          data: dataBase[videoId].map(({ id }) => id)
        })
      )
    )
  })

  const id = Math.ceil(Math.random() * 100000)
  clients.push({ ws, id })
  ws.send(
    JSON.stringify({
      type: 'init',
      data: id
    })
  )
})
