class GameService {

  constructor() {
    this.players = []
    this.games = {}
  }

  registerPlayer(name) {
    this.players.push(name)
  }

  isOpponentAvailable() {
    return this.players.length > 1
  }

  getOpponent() {
    this.players.pop()
    return this.players.pop();
  }

  isRegistered(name) {
    return this.players.includes(name)
  }

  addGame(player1, player2) {
    this.games[player1] = {
      p1: {
        name: player1,
        choice: ''
      },
      p2: {
        name: player2,
        choice: ''
      }
    }

    this.games[player2] = {
      p1: {
        name: player2,
        choice: ''
      },
      p2: {
        name: player1,
        choice: ''
      }
    }
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
}

module.exports = GameService