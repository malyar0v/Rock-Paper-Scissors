const results = {
  r: {
    r: 't',
    p: 'l',
    s: 'w'
  },
  p: {
    r: 'w',
    p: 't',
    s: 'l'
  },
  s: {
    r: 'l',
    p: 'w',
    s: 't'
  }
}

function getResult(choice1, choice2) {
  return results[choice1][choice2]
}

module.exports = getResult
