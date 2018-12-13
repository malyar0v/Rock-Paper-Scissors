const http = require('http')

const WebSocket = require('ws')
const fs = require('fs')
const GameService = require('./game-service.js')
const WebsocketService = require('./websocket-service.js')
const getResult = require('./results.js')

/*
* Resources server
* */
const server = http.createServer((req, resp) => {

  const route = req.url

  if (route === '/') {
    sendFile('/index.html', resp, 'text/html')
  }
  else if (route === '/favicon.ico') {
    sendFile('favicon.ico', resp, 'image/x-icon', true)
  }
  else {
    sendFile(route, resp, getContentType(route))
  }
})
.listen(process.env.PORT || 8080)

const contentTypes = {
  js: 'application/javascript',
  css: 'text/css',
  html: 'text/html',
  svg: 'image/svg+xml'
}

function getContentType(route) {
  return contentTypes[route.split('.').pop()]
}

function sendFile(path, resp, type, absolute = false) {

  fs.readFile(absolute ? path : `static${path}`, (err, data) => {

    if (err) {
      resp.writeHead(404)
    } else {
      resp.writeHead(200, {'Content-Type': type})

      resp.write(data)
    }

    resp.end()
  })
}

/*
* Websocket server
* */
const wss = new WebSocket.Server({server})

const gameService = new GameService()
const websocketService = new WebsocketService()

wss.on('connection', (ws) => {

  ws.on('message', (message) => {

    const json = JSON.parse(message)

    console.log(json)

    const data = json.data
    const name = data.name

    switch (json.type) {
      case 'player':

        if (gameService.isRegistered(name)) {

          send(ws, 'error', {
            'code': 0,
            'message': `${name} is already taken!`
          })

          break
        }

        gameService.registerPlayer(name, ws)
        websocketService.addConnection(name, ws)

        if (gameService.isOpponentAvailable()) {

          const opponent = gameService.getOpponent()

          gameService.addGame(name, opponent)

          console.log(`Found a pair! ${name}-${opponent}`)

          websocketService.broadcast(
              name,
              opponent,
              (ws) => send(ws, 'opponent', {'name': opponent}),
              (ws) => send(ws, 'opponent', {'name': name})
          )
        }

        break

      case 'choice':

        if (!gameService.isPlaying(name)) {
          send(ws, 'error', {
            'code': 1,
            'message': `${name} is not playing the game!`
          })

          break
        }
        const choice = data.choice // r, p, s

        const game = gameService.getGameByPlayer(name)
        const opponent = game.p2.name

        if (!gameService.hasChosen(name)) {
          gameService.choose(name, choice)
        }

        if (gameService.hasChosen(opponent)) {
          const opponentChoice = gameService.getOpponentChoice(name)

          websocketService.broadcast(name, opponent,
              (ws) => {
                send(ws, 'result', {
                  'p1': choice,
                  'p2': opponentChoice,
                  'result': getResult(choice, opponentChoice)
                })
              },
              (ws) => {
                send(ws, 'result', {
                  'p1': opponentChoice,
                  'p2': choice,
                  'result': getResult(opponentChoice, choice)
                })
              })
        }
    }
  })
})

function send(ws, type, data) {
  ws.send(toJson({
    type,
    data
  }))
}

function toJson(object) {
  return JSON.stringify(object)
}
