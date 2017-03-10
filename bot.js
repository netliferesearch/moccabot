var path = require('path')
require('dotenv').config({path: path.join(__dirname, '.env')})
var SlackBot = require('slackbots')

var bot = new SlackBot({
  token: process.env.API_TOKEN, // Add a bot https://my.slack.com/services/new/bot and put the token
  name: 'Moccabot'
})
/*
var params = {
    icon_emoji: ':moccamaster:'
  }
bot.postMessageToGroup('bergen', 'Moccabot er klar', params)
*/
module.exports = bot
