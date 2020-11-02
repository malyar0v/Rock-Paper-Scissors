import {
  START,
  LOADING,
  CHOICE,
  RESULTS,
  renderPlainComponent,
  populateChoiceComponent,
  populateLoadingComponent,
  populateResultsComponent,
} from './components.js'

const HOST = location.origin.replace(/^http/, 'ws')

let ws
let name

renderPlainComponent(START)
initWS()

function initWS() {
  ws = new WebSocket(HOST)

  ws.onopen = () => console.log('Connection established')

  ws.onmessage = (msg) => onMessage(msg)
  ws.onerror = (err) => console.log('Error ' + err)
}

document.querySelector('#play-btn').addEventListener('click', (e) => {
  name = document.getElementById('name').value

  renderPlainComponent(LOADING)
  populateLoadingComponent(`Looking for an opponent!`)

  send(ws, 'player', {
    name,
  })
})

function onChoice(choice) {
  send(ws, 'choice', {
    name,
    choice,
  })

  renderPlainComponent(LOADING)
  populateLoadingComponent(`Waiting for your opponent to choose!`)
}

function onMessage(msg) {
  const json = JSON.parse(msg.data)
  const data = json.data

  switch (json.type) {
    case 'opponent':
      const name = data.name
      renderPlainComponent(CHOICE)
      populateChoiceComponent(name)

      document.getElementById('rock').onclick = () => onChoice('r')
      document.getElementById('paper').onclick = () => onChoice('p')
      document.getElementById('scissors').onclick = () => onChoice('s')
      break

    case 'result':
      console.log(json)
      const result = data.result

      const p1Choice = data.p1.choice
      const p2Choice = data.p2.choice

      renderPlainComponent(RESULTS)
      populateResultsComponent(p1Choice, p2Choice, result)

      document.getElementById('play-again-btn').onclick = () => {
        renderPlainComponent(LOADING)
        populateLoadingComponent(`Waiting for ${data.p2.name} to accept!`)

        send(ws, 'rematch', {
          name: data.p1.name,
          opponent: data.p2.name,
        })
      }
      break

    case 'error':
      console.log(data.message)
      renderPlainComponent(START)
  }
}

function send(ws, type, data) {
  ws.send(
    toJson({
      type,
      data,
    })
  )
}

function toJson(object) {
  return JSON.stringify(object)
}
