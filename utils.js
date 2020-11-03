function send(ws, event, data) {
  ws.send(
    JSON.stringify({
      event,
      data,
    })
  )
}

module.exports = {
  send: send,
}
