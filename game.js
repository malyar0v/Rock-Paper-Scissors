class PlayerState {
  constructor(player) {
    this.player = player

    this.choice = ''
    this.rematch = false
  }

  state() {
    return {
      name: this.player.name,
      choice: this.choice,
      rematch: this.rematch,
    }
  }
}

class GameState {
  constructor(p1, p2) {
    this.p1 = p1
    this.p2 = p2

    this.playerStates = new Map([
      [p1, new PlayerState(p1)],
      [p2, new PlayerState(p2)],
    ])
  }

  playerState(player) {
    return this.playerStates.get(player)
  }

  state() {
    return {
      p1: this.playerStates.get(p1).state(),
      p2: this.playerStates.get(p2).state(),
    }
  }
}

class Game {
  static get RESULTS() {
    return {
      r: {
        r: 't',
        p: 'l',
        s: 'w',
      },
      p: {
        r: 'w',
        p: 't',
        s: 'l',
      },
      s: {
        r: 'l',
        p: 'w',
        s: 't',
      },
    }
  }

  static gameResult(choice1, choice2) {
    return Game.RESULTS[choice1][choice2]
  }

  constructor(p1, p2) {
    p1.game = this
    p2.game = this

    this.p1 = p1
    this.p2 = p2

    this.state = new GameState(p1, p2)
  }

  opponent(ofPlayer) {
    const players = [this.p1, this.p2]

    return players[(players.indexOf(ofPlayer) + 1) % 2]
  }
}

module.exports = {
  Game: Game,
}
