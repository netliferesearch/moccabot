var botConfig = {
  thresholdTemp: 25,
  channel: '',
  user: 'dataknut',
  messages: {
    ready: 'Moccabot er klar!',
    brewingSlack: 'Noen har satt på kaffi!',
    brewing: 'Brygger...',
    done: 'Kaffien er ferdig!'
  },
  // more information about additional params https://api.slack.com/methods/chat.postMessage
  params: {
    icon_emoji: ':moccamaster:'
  }
}

module.exports = botConfig
