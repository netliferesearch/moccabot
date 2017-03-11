var regression = require('regression');

var data = require('./data.json');
var lessData = data.filter((line, i) => i % 100 === 0);

var dataSeries = lessData.map((line, index) => ([
    index, // (new Date(line[2])).getTime(),
    line[0]
]))

/**
 * Set up the Board
 */

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
var bot = require('./bot')
var botConfig = require('./botconfig')
var messages = botConfig.messages
var user = botConfig.user
var params = botConfig.params
var thresholdTemp = botConfig.thresholdTemp
var channel = botConfig.channel
var group = botConfig.group

function botStartUp () {
  bot.on('start', function () {
    console.log(user, messages.ready, params)
  })
}

function printToLCD (string, temp) {
  string = string || 'Klar'
  /**
   * Set up the LCD Screen (on port B)
   * */
  console.log(string, temp)
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


// regression('linear', dataSeries)

/*
dataSeries.forEach((line, i) => {
    if (i < 50) {
        return;
    }

    console.log([].concat(
        line,
        regression('linear', dataSeries.slice(i - 10, i)).equation[0] > 0.0075
    ));
*/

board.on('ready', function () {
  var multi = new five.Multi({
    controller: 'BME280'
  })
  var led = new five.Led('B0')
  led.blink(500)
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
    setTimeout(printToLCD(messages.ready, temp), 1000)
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

// lessData.forEach((line, i) => {
//     console.log(i)

//     console.log(lessData.slice(i, Math.max(i - 50, 0)).map(l => [
//         new Date(l[2]).getTime(),
//         l[0]
//     ]))

//     // console.log(regression(
//     //     'linear',
//     //     lessData.slice(i, Math.max(i - 50, 0)).map(l => [
//     //         new Date(l[2]).getTime(),
//     //         l[0]
//     //     ])
//     // ))
// })