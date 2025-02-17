// const readableUrl = '/esmodule/package-lock.json'
const readableUrl = 'http://localhost:3000/download'

// 读取下载进度
fetch(readableUrl).then(async (response) => {
  const total = +response.headers.get('Content-Length')
  const reader = response.body.getReader()
  const result = []
  let progress = 0
  while (true) {
    const gen = await reader.read()
    console.log('gen: ', gen)
    const { done, value } = gen
    if (done) {
      break
    }
    result.push(value)
    progress += value.length
    // onUpdate && onUpdate(progress, total)
    console.log('progress: ', progress, total)
  }
})

// const url = 'https://i0.hdslb.com/bfs/vc/75ec2d45ce8c942a1f7379d4641171da4d90ab0d.png@1c.webp'
// const url = 'http://localhost:8000/src/loginCut.png'
const url = 'http://localhost:8000/esmodule/package-lock.json'

// 触发下载
fetch(readableUrl).then(async (response) => {
  if (!response.ok) {
    throw response.status
  }
  const filename = new URL(url).pathname.split('/').pop()
  const blob = await response.blob()
  const linkUrl = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = linkUrl
  a.download = filename
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
})
