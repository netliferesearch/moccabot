/**
 * Set up the Board
 */
var temporal = require('temporal')

var five = require('johnny-five')
var Tessel = require('tessel-io')
var board = new five.Board({
  io: new Tessel(),
  repl: false,
  debug: true
})
/**
 * Set up Slackbot and fetch the config
 */
// var bot = require('./bot')
var botConfig = require('./botconfig')
var messages = {
  ready: botConfig.messageReady(),
  brewingSlack: botConfig.messageBrewingSlack,
  brewing: botConfig.messageBrewing,
  done: botConfig.messageDone
}
var user = botConfig.user
var params = botConfig.params
var startTemp = botConfig.startTemp
var brewingTime = botConfig.brewingTime
var channel = botConfig.channel
var group = botConfig.group

board.on('ready', function () {
  console.log('Board is ready')
  var multi = new five.Multi({
    controller: 'BME280'
  })
  /**
   * Set the initial brewing state and start up
   */
  var brewing = false
  var sentReadyMessage = false

  botStartUp()

  /**
   * Temperature logic
   */
  multi.on('ready', function () {
    console.log('thermometer is ready')
  })

  multi.on('data', function () {
    var temp = this.thermometer.celsius
    if (temp > startTemp && !brewing) {
      brewing = true
      log(messages.brewing, temp)
      // postToSlack(messages.brewingSlack)
      // it takes N minutes on a full pot to final drop
      temporal.delay(brewingTime, function () {
        brewing = false
        sentReadyMessage = false
        log(messages.done, temp)
        postToSlack(messages.done)
      })
    }
    if (temp > startTemp && brewing && sentReadyMessage) {
      temporal.loop(3000, function () {
        log(messages.brewing, temp)
      })
    }
    if (temp < startTemp && !brewing && !sentReadyMessage) {
      log(messages.ready, temp)
      sentReadyMessage = true
    }
  })

  multi.on('error', function (error) {
    console.log('there was an error', error)
  })
})

function log (message, temp) {
  console.log(message, temp)
}

function postToSlack (message) {
  if (user) {
    console.log(user, message, params)
  }
  if (channel) {
    console.log(channel, message, params)
  }
  if (group) {
    console.log(group, message, params)
  }
}


function botStartUp () {
  postToSlack(user, messages.ready, params)
}

