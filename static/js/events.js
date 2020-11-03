import {
  Components,
  renderPlainComponent,
  populateChoiceComponent,
  populateLoadingComponent,
  populateResultsComponent,
} from './components.js'

function send(ws, event, data) {
  ws.send(
    JSON.stringify({
      event,
      data,
    })
  )
}

export class Event {
  constructor(type, data) {
    this.type = type
    this.data = data
  }
}

class UiUpdate {
  perform() {}
}

export class StartUiUpdate extends UiUpdate {
  perform() {
    renderPlainComponent(Components.START)
  }
}

export class ClientEvent {
  constructor(name, type) {
    this.name = name
    this.type = type
  }

  data() {}
}

export class PlayerEvent extends ClientEvent {
  constructor(name) {
    super(name, 'player')
  }

  data() {
    return {
      name: this.name,
    }
  }
}

export class PlayerEventUiUpdate extends UiUpdate {
  perform() {
    renderPlainComponent(Components.LOADING)
    populateLoadingComponent(`Looking for an opponent!`)
  }
}

export class ChoiceEvent extends ClientEvent {
  constructor(name, choice) {
    super(name, 'choice')

    this.name = name
    this.choice = choice
  }

  data() {
    return {
      name: this.name,
      choice: this.choice,
    }
  }
}

export class ChoiceEventUIUpdate extends UiUpdate {
  perform() {
    renderPlainComponent(Components.LOADING)
    populateLoadingComponent(`Waiting for your opponent to choose!`)
  }
}

export class PlayAgainEvent extends ClientEvent {
  constructor(name) {
    super(name, 'play-again')
  }

  data() {
    return {
      name: this.name,
    }
  }
}

export class PlayAgainEventUIUpdate extends UiUpdate {
  perform() {
    renderPlainComponent(Components.START)
  }
}

export class RematchEvent extends PlayAgainEvent {
  constructor(name) {
    super(name)

    this.type = 'rematch'
  }
}

export class RematchEventUIUpdate extends UiUpdate {
  constructor(name) {
    super()
    this.name = name
  }

  perform() {
    renderPlainComponent(Components.LOADING)
    populateLoadingComponent(`Waiting for ${name} to accept!`)
  }
}

export class UiUpdater {
  update(uiUpdate) {
    uiUpdate.perform()
  }
}

export class EventEmitter {
  constructor(ws) {
    this.ws = ws
  }

  emit(event) {
    const type = event.type
    const data = event.data()

    send(this.ws, type, data)
  }
}

export class OpponentEvent extends Event {
  constructor(data) {
    super('opponent', data)
  }
}

export class ResultEvent extends Event {
  constructor(data) {
    super('result', data)
  }
}

export class ErrorEvent extends Event {
  constructor(data) {
    super('error', data)
  }
}

export class EventHandler {
  constructor(uiUpdater) {
    this.uiUpdater = uiUpdater
  }

  handle(event) {}
}

export class OpponentEventHandler extends EventHandler {
  handle(event) {
    const name = event.data.name

    const uiUpdate = new OpponentEventUiUpdate(name)
    this.uiUpdater.update(uiUpdate)
  }
}

export class OpponentEventUiUpdate extends UiUpdate {
  constructor(name) {
    super()

    this.name = name
  }

  perform() {
    renderPlainComponent(Components.CHOICE)
    populateChoiceComponent(this.name)
  }
}

export class ResultEventHandler extends EventHandler {
  handle(event) {
    const data = event.data

    const result = data.result
    const p1Choice = data.p1.choice
    const p2Choice = data.p2.choice

    const uiUpdate = new ResultEventUiUpdate(p1Choice, p2Choice, result)
    this.uiUpdater.update(uiUpdate)
  }
}

export class ResultEventUiUpdate extends UiUpdate {
  constructor(p1Choice, p2Choice, result) {
    super()

    this.p1Choice = p1Choice
    this.p2Choice = p2Choice
    this.result = result
  }

  perform() {
    renderPlainComponent(Components.RESULTS)
    populateResultsComponent(this.p1Choice, this.p2Choice, this.result)
  }
}

export class ErrorEventHandler extends EventHandler {
  handle(event) {
    const data = event.data

    console.log(data.message)

    const uiUpdate = new ErrorEventUiUpdate(data)
    this.uiUpdater.update(uiUpdate)
  }
}

export class ErrorEventUiUpdate extends UiUpdate {
  perform() {
    renderPlainComponent(Components.START)
  }
}
