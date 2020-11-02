/*
WIN = 'w'
LOSS = 'l'
TIE = 't'

ROCK = 'r'
PAPER = 'p'
SCISSORS = 's'
*/

const RESULTS_MESSAGES = { w: 'You won', l: 'You lost', t: 'A tie' }
const COLORS = { w: '#2196F3', l: '#F44336', t: '#FF9800' }
const IMAGES = {
  r: 'img/rock.svg',
  p: 'img/paper.svg',
  s: 'img/scissors.svg',
}

export const START = 'start-component',
  LOADING = 'loading-component',
  CHOICE = 'choice-component',
  RESULTS = 'results-component'

export function renderPlainComponent(id) {
  const container = document.querySelector('#container')

  for (let i = 0; i < container.children.length; i++) {
    container.children[i].classList.remove('d-flex')
  }

  document.querySelector(`#${id}`).classList.add('d-flex')
}

export function populateChoiceComponent(name) {
  document.querySelector('#opponent').textContent = `Playing against ${name}!`
}

export function populateLoadingComponent(msg) {
  document.querySelector('#loading-component h3').textContent = `${msg}`
}

export function populateResultsComponent(p1, p2, result) {
  document.querySelector('#choice-1 > img').setAttribute('src', IMAGES[p1])
  document.querySelector('#choice-2 > img').setAttribute('src', IMAGES[p2])
  const resultMsg = document.getElementById('results')

  resultMsg.textContent = RESULTS_MESSAGES[result]
  resultMsg.style.color = COLORS[result]
}
