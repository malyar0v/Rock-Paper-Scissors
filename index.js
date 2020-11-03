const http = require('http')

const WebSocket = require('ws')
const fs = require('fs')
const { GameService } = require('./game-service.js')

/*
 * Resources server
 * */
const contentTypes = {
  js: 'application/javascript',
  css: 'text/css',
  html: 'text/html',
  svg: 'image/svg+xml',
}

function getContentType(route) {
  return contentTypes[route.split('.').pop()]
}

const server = http
  .createServer((req, resp) => {
    const route = req.url

    if (route === '/') {
      sendFile('/index.html', resp, 'text/html')
    } else if (route === '/favicon.ico') {
      sendFile('favicon.ico', resp, 'image/x-icon', true)
    } else {
      sendFile(route, resp, getContentType(route))
    }
  })
  .listen(process.env.PORT || 8080)

function sendFile(path, resp, type, absolute = false) {
  fs.readFile(absolute ? path : `static${path}`, (err, data) => {
    if (err) {
      resp.writeHead(404)
    } else {
      resp.writeHead(200, { 'Content-Type': type })

      resp.write(data)
    }

    resp.end()
  })
}

/*
 * Websocket server
 * */
const wss = new WebSocket.Server({ server })

const gameService = new GameService()

const pingInterval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) return ws.terminate()

    ws.isAlive = false
    ws.ping(() => {})
  })
}, 5000)

wss.on('close', () => {
  console.log('WS server closing!')
  clearInterval(pingInterval)
})

wss.on('connection', (ws) => {
  ws.isAlive = true

  ws.on('pong', () => (ws.isAlive = true))

  ws.addEventListener('message', onMessage)
  ws.addEventListener('close', onClose)
})

function onMessage(message) {
  const msg = JSON.parse(message.data)

  console.log(msg)

  gameService.onMessage(msg, this)
}

function onClose(code) {
  gameService.onClose(code, this)
}
