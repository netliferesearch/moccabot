var botConfig = {
  startTemp: 25,
  brewingTime: 10000, // five minutes 3e5
  channel: false,
  group: 'bergen',
  user: 'moccabot',
  messageReady: function () {
    return 'Moccabot is ready. Starting at ' + this.startTemp + ', and brewing time at ' + this.brewingTime + ' ms.'
  },
  messageBrewingSlack: 'Someone’s making another pot of coffee!',
  messageBrewing: 'Brewing...',
  messageDone: 'Fresh pots!',
  messageTempTerm: 'degrees',
  // more information about additional params https://api.slack.com/methods/chat.postMessage
  params: {
    icon_emoji: ':moccamaster:'
  }
}
module.exports = botConfig
