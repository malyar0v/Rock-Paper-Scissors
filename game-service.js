class GameService {
  constructor() {
    this.players = []
    this.games = {}
  }

  registerPlayer(name) {
    this.players.push(name)
  }

  unregisterPlayer(name) {
    const idx = this.players.indexOf(name)

    if (idx >= 0) {
      this.players.splice(idx, 1)
    }
  }

  isOpponentAvailable() {
    return this.players.length > 1
  }

  getOpponent() {
    return this.players[0]
  }

  isRegistered(name) {
    return this.players.includes(name)
  }

  addGame(player1, player2) {
    this.games[player1] = {
      p1: {
        name: player1,
        choice: '',
        rematch: false,
      },
      p2: {
        name: player2,
        choice: '',
        rematch: false,
      },
    }

    this.games[player2] = {
      p1: {
        name: player2,
        choice: '',
        rematch: false,
      },
      p2: {
        name: player1,
        choice: '',
        rematch: false,
      },
    }
  }

  removeGame(player1, player2) {
    delete this.games[player1]
    delete this.games[player2]
  }

  choose(name, choice) {
    const opponent = this.games[name].p2.name
    this.games[name].p1.choice = choice
    this.games[opponent].p2.choice = choice
  }

  hasChosen(name) {
    return this.getGameByPlayer(name).p1.choice.length !== 0
  }

  getOpponentChoice(name) {
    return this.getGameByPlayer(name).p2.choice
  }

  isPlaying(name) {
    return name in this.games
  }

  getGameByPlayer(name) {
    return this.games[name]
  }

  setRematch(player, doRematch) {
    player.rematch = doRematch
  }

  wantRematch(p1, p2) {
    return (
      this.getGameByPlayer(p1).p1.rematch === true &&
      this.getGameByPlayer(p2).p1.rematch === true
    )
  }
}

module.exports = GameService
