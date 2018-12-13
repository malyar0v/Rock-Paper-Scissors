class WebsocketService {

  constructor() {
    this.connections = {}
  }

  addConnection(id, con) {
    this.connections[id] = con
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