class WebsocketService {
  constructor() {
    this.connections = {}
  }

  addConnection(id, ws) {
    this.connections[id] = ws

    ws.on('close', (code) => {
      console.log(`Closing WS for: ${id}`)

      ws.isAlive = false
    })
  }

  getConnection(id) {
    return this.connections[id]
  }

  broadcast(client, opponent, forClient, forOpponent) {
    forClient(this.getConnection(client))
    forOpponent(this.getConnection(opponent))
  }
}

module.exports = WebsocketService
