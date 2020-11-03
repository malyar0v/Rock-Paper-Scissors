import {
  EventEmitter,
  PlayerEvent,
  ChoiceEvent,
  OpponentEventHandler,
  ResultEventHandler,
  ErrorEventHandler,
  OpponentEvent,
  ResultEvent,
  ErrorEvent,
  PlayAgainEvent,
  RematchEvent,
  PlayerEventUiUpdate,
  ChoiceEventUIUpdate,
  RematchEventUIUpdate,
  PlayAgainEventUIUpdate,
  UiUpdater,
  StartUiUpdate,
} from './events.js'

const HOST = location.origin.replace(/^http/, 'ws')

let ws
let name

const uiUpdater = new UiUpdater()
uiUpdater.update(new StartUiUpdate())

initWS()

function initWS() {
  ws = new WebSocket(HOST)

  ws.onopen = () => console.log('Connection established')

  ws.onmessage = (msg) => onMessage(msg)
  ws.onerror = (err) => console.log('Error ' + err)
}

const eventEmitter = new EventEmitter(ws)

document.getElementById('play-btn').addEventListener('click', (e) => {
  name = document.getElementById('name').value

  const event = new PlayerEvent(name)
  const uiUpdate = new PlayerEventUiUpdate()

  eventEmitter.emit(event)
  uiUpdater.update(uiUpdate)
})

document.getElementById('rock').onclick = () => {
  const event = new ChoiceEvent(name, 'r')
  const uiUpdate = new ChoiceEventUIUpdate()

  eventEmitter.emit(event)
  uiUpdater.update(uiUpdate)
}
document.getElementById('paper').onclick = () => {
  const event = new ChoiceEvent(name, 'p')
  const uiUpdate = new ChoiceEventUIUpdate()

  eventEmitter.emit(event)
  uiUpdater.update(uiUpdate)
}
document.getElementById('scissors').onclick = () => {
  const event = new ChoiceEvent(name, 's')
  const uiUpdate = new ChoiceEventUIUpdate()

  eventEmitter.emit(event)
  uiUpdater.update(uiUpdate)
}

document.getElementById('rematch-btn').onclick = () => {
  const event = new RematchEvent(name)
  const uiUpdate = new RematchEventUIUpdate(name)

  eventEmitter.emit(event)
  uiUpdater.update(uiUpdate)
}

document.getElementById('play-again-btn').onclick = () => {
  const event = new PlayAgainEvent(name)
  const uiUpdate = new PlayAgainEventUIUpdate()

  eventEmitter.emit(event)
  uiUpdater.update(uiUpdate)
}

const opponentEventHandler = new OpponentEventHandler(uiUpdater)
const resultEventHandler = new ResultEventHandler(uiUpdater)
const errorEventHandler = new ErrorEventHandler(uiUpdater)

const handlers = {
  opponent: (data) => {
    const event = new OpponentEvent(data)
    opponentEventHandler.handle(event)
  },
  result: (data) => {
    const event = new ResultEvent(data)
    resultEventHandler.handle(event)
  },
  error: (data) => {
    const event = new ErrorEvent(data)
    errorEventHandler.handle(event)
  },
}

function onMessage(message) {
  const msg = JSON.parse(message.data)
  const data = msg.data

  const event = msg.event
  const handler = handlers[event]

  handler(data)
}
