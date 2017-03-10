var botConfig = {
  startTemp: 28,
  doneTemp: 32,
  channel: false,
  group: 'bergen',
  user: 'dataknut',
  messages: {
    ready: 'Moccabot er klar',
    brewingSlack: 'Noen har satt på kaffi!',
    brewing: 'Brygger...',
    done: 'Kaffien er ferdig',
    tempTerm: 'grader'
  },
  // more information about additional params https://api.slack.com/methods/chat.postMessage
  params: {
    icon_emoji: ':moccamaster:'
  }
}

module.exports = botConfig
