const { Game } = require('./game.js')

class Event {
  constructor(data, player) {
    this.data = data
    this.player = player
  }
}

class EventController {
  constructor(gameService, playerService) {
    this.gameService = gameService
    this.playerService = playerService

    this.handlers = {
      player: new PlayerEventHandler(gameService, playerService),
      choice: new ChoiceEventHandler(gameService),
      rematch: new RematchEventHandler(gameService),
      'play-again': new PlayAgainEventHandler(gameService, playerService),
    }
  }

  process(msg, player) {
    const event = new Event(msg.data, player)

    this.handlers[msg.event].handle(event)
  }
}

class EventHandler {
  constructor(gameService) {
    this.gameService = gameService
  }

  handle(event) {}
}

class PlayerEventHandler extends EventHandler {
  constructor(gameService, playerService) {
    super(gameService)

    this.playerService = playerService
  }

  handle(event) {
    const gameService = this.gameService
    const playerService = this.playerService

    const player = event.player

    if (!playerService.isRegistered(player)) {
      console.log(`Registering player ${player.name}.`)

      playerService.register(player)
      playerService.queue(player)
    }

    if (playerService.isOpponentAvailable()) {
      const opponent = playerService.getOpponent()

      if (opponent.ws.isAlive === false) {
        console.log('Potential opponent is disconnected!')

        playerService.unregister(opponent)
        playerService.unqueue(opponent)

        return
      }

      const game = new Game(player, opponent)
      gameService.addGame(game)

      playerService.unqueue(player)
      playerService.unqueue(opponent)

      console.log(`Found a pair! ${player.name}-${opponent.name}`)

      const response = (opponentName) => {
        return { name: opponentName }
      }

      gameService.broadcast(
        game,
        'opponent',
        (me, opponent, send) => {
          send(response(opponent.name))
        },
        (me, opponent, send) => {
          send(response(opponent.name))
        }
      )
    }
  }
}

class ChoiceEventHandler extends EventHandler {
  constructor(gameService) {
    super(gameService)
  }

  handle(event) {
    const gameService = this.gameService

    const player = event.player
    const choice = event.data.choice // r, p, s

    const game = player.game
    const opponent = game.opponent(player)

    if (!gameService.hasChosen(player)) {
      gameService.choose(player, choice)
    }

    if (gameService.hasChosen(opponent)) {
      const response = (me, opponent) => {
        const myChoice = gameService.playerState(me).choice
        const opponentChoice = gameService.playerState(opponent).choice

        return {
          p1: {
            name: me.name,
            choice: myChoice,
          },
          p2: {
            name: opponent.name,
            choice: opponentChoice,
          },
          result: Game.gameResult(myChoice, opponentChoice),
        }
      }

      gameService.broadcast(
        game,
        'result',
        (me, opponent, send) => {
          send(response(me, opponent))
        },
        (me, opponent, send) => {
          send(response(me, opponent))
        }
      )
    }

    if (gameService.hasChosen(player) && gameService.hasChosen(opponent)) {
      // Both chose
    }
  }
}

class RematchEventHandler extends EventHandler {
  constructor(gameService) {
    super(gameService)
  }

  handle(event) {
    const gameService = this.gameService

    const player = event.player
    const game = player.game
    const opponent = game.opponent(player)

    gameService.setRematch(player, true)

    if (gameService.wantRematch(player, opponent)) {
      gameService.removeGame(game)

      const rematchGame = new Game(player, opponent)
      gameService.addGame(rematchGame)

      const response = (opponentName) => {
        return { name: opponentName }
      }

      gameService.broadcast(
        rematchGame,
        'opponent',
        (me, opponent, send) => {
          send(response(opponent.name))
        },
        (me, opponent, send) => {
          send(response(opponent.name))
        }
      )
    }
  }
}

class PlayAgainEventHandler extends EventHandler {
  constructor(gameService, playerService) {
    super(gameService)

    this.playerService = playerService
  }

  handle(event) {
    const player = event.player
    const game = player.game

    this.playerService.unregister(player)
    this.gameService.removeGame(game)
  }
}

module.exports = {
  EventController: EventController,
}
