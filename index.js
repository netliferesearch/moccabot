/**
 * Set up the Board
 */
var fs = require('fs')

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
var channel = botConfig.channel
var group = botConfig.group
var startTemp = messages.startTemp
var doneTemp = messages.doneTemp
var lcd = new five.LCD({
    pins: ['b2', 'b3', 'b4', 'b5', 'b6', 'b7']
  })

function botStartUp () {
  bot.on('start', function () {
    bot.postMessageToGroup(group, messages.ready, params)
  })
}

function printToLCD (string, temp) {
  string = string || 'Ready'
  /**
   * Set up the LCD Screen (on port B)
   * */
  lcd.clear()
  lcd.cursor(0, 0).print(string)
  lcd.cursor(1, 0).print(temp + ' ' + startTemp)
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
  var doneState = false
  var coolDown = false
  botStartUp()

  /**
   * Temperature logic
   */
  multi.on('data', function () {
    function isFinishedBrewing() {
      return temp > doneTemp && brewing
    }
    function isBrewing() {
      return temp > startTemp && temp < doneTemp && !coolDown
    }
    
    var temp = this.thermometer.celsius
    var log = temp + ', ' + this.hygrometer.relativeHumidity + ', ' + new Date()
    

    if (isBrewing()) {
      brewing = true
      bot.postMessageToGroup(group, messages.brewingSlack, params)
    }
    if (isFinishedBrewing()) {
        brewing = false
        coolDown = true        
        bot.postMessageToGroup(group, messages.done, params)
        setTimout(function() {
          coolDown = false
        }, 6e5)
    }
    setTimeout(function() {
      console.log(log)
    }, 1500)
    /*
    if (temp < thresholdTemp && !brewing) {
      setTimeout(printToLCD(messages.ready, temp), 5000)
    }
    */
  })
})
