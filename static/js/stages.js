/*
WIN = 'w'
LOSS = 'l'
TIE = 't'

ROCK = 'r'
PAPER = 'p'
SCISSORS = 's'
*/

const RESULTS = {w: 'You won', l: 'You lost', t: 'A tie'}
const COLORS = {w: '#2196F3', l: '#F44336', t: '#FF9800'}
const IMAGES = {
  r: 'img/rock.svg',
  p: 'img/paper.svg',
  s: 'img/scissors.svg'
}

export function getResultStage(p1, p2, result) {
  return `
  <div id="result-stage" class="stage">

    <div
        id="choices"
        class="row text-center"
    >
      <div id="rock" class="choice offset-2 col-4">
        <img src="${IMAGES[p1]}" alt="">
      </div>
      <div id="paper" class="choice col-4">
        <img src="${IMAGES[p2]}" alt="">
      </div>
    </div>
    <div id="result" class="text-center" style="color: ${COLORS[result]}">${RESULTS[result]}</div>

    <button id="play-again-btn" type="button" class="btn btn-success">
      PLAY AGAIN
    </button>
  </div>
  `
}

export function getStartStage() {
  return `
  <div id="start-stage" class="stage">
    <label for="name"></label>
    <input placeholder="Name" id="name" name="name" type="text">
    <button id="play-btn" type="button" class="btn btn-success" onclick="onClick()">
      PLAY
    </button>
  </div>
  `
}

export function getProgressStage() {
  return `
  <div id="progress-stage" class="stage">
    <div id="progress" class="progress">
      <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
           aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>
    </div>
  </div>
  `
}

export function getChoiceStage(opponent) {
  return `
  <div id="choice-stage" class="stage">
    <div
        id="choices"
        class="row text-center"
    >
      <div id="rock" class="choice col-4">
        <img src="img/rock.svg" alt="">
      </div>
      <div id="paper" class="choice col-4">
        <img src="img/paper.svg" alt="">
      </div>
      <div id="scissors" class="choice col-4">
        <img src="img/scissors.svg" alt="">
      </div>
    </div>
    <div id="opponent" class="text-center">Playing Against ${opponent}</div>
  </div>
  `
}