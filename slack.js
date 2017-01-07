require('dotenv').config()
var SlackBot = require('slackbots');

var bot = new SlackBot({
    token: process.env.API_TOKEN, // Add a bot https://my.slack.com/services/new/bot and put the token 
    name: 'Moccabot'
});

bot.on('start', function () {
    // more information about additional params https://api.slack.com/methods/chat.postMessage
    var params = {
        icon_emoji: ':moccamaster:'
    };

    // define channel, where bot exist. You can adjust it there https://my.slack.com/services 
    // bot.postMessageToChannel('test1234', 'meow!', params);

    // define existing username instead of 'user_name'
    bot.postMessageToUser('dataknut', 'Noen har satt på kaffien!', params);

    // If you add a 'slackbot' property, 
    // you will post to another user's slackbot channel instead of a direct message

    // define private group instead of 'private_group', where bot exist
    bot.postMessageToGroup('test1234', 'Noen har satt på kaffien!', params);
});
