/**
 * Set up the Board
 */

var five = require('johnny-five')
var Tessel = require('tessel-io')
var board = new five.Board({
  io: new Tessel(),
  repl: false,
  debug: false
})
/**
 * Set up Slackbot and fetch the config
 */
var bot = require('./bot')
var botConfig = require('./botconfig')
var messages = botConfig.messages
var user = botConfig.user
var params = botConfig.params
var thresholdTemp = botConfig.thresholdTemp

function botStartUp () {
  bot.on('start', function () {
    bot.postMessageToUser(user, messages.ready, params)
  })
}

function printToLCD (string, temp) {
  string = string || 'Klar'
  /**
   * Set up the LCD Screen (on port B)
   * */
  var lcd = new five.LCD({
    pins: ['b2', 'b3', 'b4', 'b5', 'b6', 'b7']
  })
  lcd.autoscroll().print(string).print(' ' + temp + ' grader')
}
function postToSlack (message) {
  bot.postMessageToUser(user, message, params)
}

board.on('ready', function () {
    /**
     * Set up the climate controller
     */
  var multi = new five.Multi({
    controller: 'BME280'
  })

  /**
   * Set the initial brewing state and start up
   */
  var brewing = false
  botStartUp()

  /**
   * Temperature logic
   */
  multi.on('data', function () {
    printToLCD(messages.ready, temp)
    var temp = this.thermometer.celsius
    if (temp > thresholdTemp && !brewing) {
      brewing = true
      printToLCD(messages.brewing, temp)
      postToSlack(messages.brewingSlack)
    }
    if (temp > thresholdTemp && brewing) {
      printToLCD(messages.brewing, temp)
    }
    if (temp < thresholdTemp && brewing) {
      brewing = false
      printToLCD(messages.done, temp)
      postToSlack(messages.done)
    }
    if (temp < thresholdTemp && !brewing) {
      setTimeout(printToLCD(messages.ready, temp), 5000)
    }
  })
})
