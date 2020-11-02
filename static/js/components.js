/*
WIN = 'w'
LOSS = 'l'
TIE = 't'

ROCK = 'r'
PAPER = 'p'
SCISSORS = 's'
*/

const RESULTS_MESSAGES = { w: 'You won', l: 'You lost', t: 'A tie' }
const COLORS = { w: '#006db3', l: '#F44336', t: '#FF9800' }
const IMAGES = {
  r: 'img/rock.svg',
  p: 'img/paper.svg',
  s: 'img/scissors.svg',
}

export class Components {
  static get START() {
    return '#start-component'
  }
  static get LOADING() {
    return '#loading-component'
  }
  static get CHOICE() {
    return '#choice-component'
  }
  static get RESULTS() {
    return '#results-component'
  }
}

export function renderPlainComponent(id) {
  const container = document.querySelector('.container')

  for (let i = 0; i < container.children.length; i++) {
    container.children[i].classList.remove('d-flex')
  }

  document.querySelector(id).classList.add('d-flex')
}

export function populateChoiceComponent(name) {
  document.querySelector(
    `${Components.CHOICE} h3`
  ).textContent = `Playing against ${name}!`
}

export function populateLoadingComponent(msg) {
  document.querySelector(`${Components.LOADING} h3`).textContent = `${msg}`
}

export function populateResultsComponent(p1, p2, result) {
  document
    .querySelector(`${Components.RESULTS} .choice:first-child > img`)
    .setAttribute('src', IMAGES[p1])
  document
    .querySelector(`${Components.RESULTS} .choice:last-child > img`)
    .setAttribute('src', IMAGES[p2])
  const resultMsg = document.querySelector(`${Components.RESULTS} > h2`)

  resultMsg.textContent = RESULTS_MESSAGES[result]
  resultMsg.style.color = COLORS[result]
}
