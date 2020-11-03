const { EventController } = require('./events')
const { Player, PlayerService } = require('./player-service')
const { send } = require('./utils')

class GameService {
  constructor() {
    this.games = new Set()

    this.playerService = new PlayerService()
    this.eventController = new EventController(this, this.playerService)
  }

  onMessage(msg, ws) {
    const event = msg.event
    const data = msg.data

    const name = data.name

    let player = new Player(name, ws)

    if (msg.event == 'player') {
      if (this.playerService.isRegistered(player)) {
        console.log(`Player with ${name} name is already registered!`)

        return
      }
    } else {
      player = this.playerService.getPlayer(name)
    }

    ws.player = player

    this.eventController.process(msg, player)
  }

  onClose(closeEvent, ws) {
    const player = ws.player

    if (player !== undefined) {
      console.log(`${player.name} disconnected! Code: ${closeEvent.code}`)

      this.playerService.unregister(player)
      this.playerService.unqueue(player)
    } else {
      console.log('Anonymous client disconnected!')
    }
  }

  broadcast(game, event, forP1, forP2) {
    const p1 = game.p1
    const p2 = game.p2

    const p1Fun = (data) => {
      send(p1.ws, event, data)
    }

    const p2Fun = (data) => {
      send(p2.ws, event, data)
    }

    forP1(p1, p2, p1Fun)
    forP2(p2, p1, p2Fun)
  }

  addGame(game) {
    this.games.add(game)
  }

  removeGame(game) {
    this.games.delete(game)
  }

  playerState(player) {
    return player.game.state.playerState(player)
  }

  choose(player, choice) {
    this.playerState(player).choice = choice
  }

  hasChosen(player) {
    return this.playerState(player).choice !== ''
  }

  setRematch(player, doRematch) {
    this.playerState(player).rematch = doRematch
  }

  wantRematch(p1, p2) {
    return (
      this.playerState(p1).rematch === true &&
      this.playerState(p2).rematch === true
    )
  }
}

module.exports = {
  GameService: GameService,
}
