class Player {
  constructor(name, ws) {
    this.name = name
    this.ws = ws
    this.game = null
  }
}

class PlayerService {
  constructor() {
    this.players = {
      names: new Set(),
      objects: new Map(),
    }

    this.queued_players = {
      names: new Set(),
      objects: new Map(),
    }
  }

  register(player) {
    this.players.names.add(player.name)
    this.players.objects.set(player.name, player)
  }

  unregister(player) {
    this.players.names.delete(player.name)
    this.players.objects.delete(player.name)
  }

  isRegistered(player) {
    return this.players.names.has(player.name)
  }

  queue(player) {
    this.queued_players.names.add(player.name)
    this.queued_players.objects.set(player.name, player)
  }

  unqueue(player) {
    this.queued_players.names.delete(player.name)
    this.queued_players.objects.delete(player.name)
  }

  isOpponentAvailable() {
    return this.queued_players.names.size > 1
  }

  getPlayer(name) {
    return this.players.objects.get(name)
  }

  getOpponent() {
    const name = this.queued_players.names.values().next().value

    return this.queued_players.objects.get(name)
  }
}

module.exports = {
  Player: Player,
  PlayerService: PlayerService,
}
