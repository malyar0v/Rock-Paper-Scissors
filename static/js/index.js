import {
  getChoiceStage,
  getProgressStage,
  getStartStage,
  getResultStage
} from "./stages.js";

const HOST = location.origin.replace(/^http/, 'ws')

let ws
let name

initWS()

function initWS() {

  ws = new WebSocket(HOST)

  ws.onopen = () => console.log("Connection established")

  ws.onmessage = (msg) => onMessage(msg)
  ws.onerror = (err) => console.log("Error " + err)
}

window.onClick = onClick

function onClick() {

  name = document.getElementById('name').value

  switchStage(getProgressStage())

  send(ws, 'player', {
    name
  })
}

function onChoice(choice) {

  send(ws, 'choice', {
    name,
    choice
  })

  switchStage(getProgressStage())
}

function onMessage(msg) {
  const json = JSON.parse(msg.data)
  const data = json.data

  switch (json.type) {
    case 'opponent':

      const name = data.name
      switchStage(getChoiceStage(name))

      document.getElementById('rock').onclick = () => onChoice('r')
      document.getElementById('paper').onclick = () => onChoice('p')
      document.getElementById('scissors').onclick = () => onChoice('s')
      break

    case 'result':

      console.log(json)
      const result = data.result
      const p1 = data.p1
      const p2 = data.p2

      switchStage(getResultStage(p1, p2, result))

      document.getElementById('play-again-btn').onclick = () => {
        switchStage(getStartStage())
      }
      break

    case 'error':
      console.log(data.message)
      switchStage(getStartStage())
  }
}

function switchStage(html) {
  document.getElementById('container').innerHTML = html
}

function send(ws, type, data) {
  ws.send(toJson({
    type,
    data
  }))
}

function toJson(object) {
  return JSON.stringify(object)
}
