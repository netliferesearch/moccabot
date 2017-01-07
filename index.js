require('dotenv').config()
var Barcli = require("barcli");
var five = require("johnny-five");
var Tessel = require("tessel-io");
var board = new five.Board({
    io: new Tessel(),
    repl: false,
    debug: false,
});

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


    // If you add a 'slackbot' property, 
    // you will post to another user's slackbot channel instead of a direct message

    // define private group instead of 'private_group', where bot exist
    bot.postMessageToGroup('test1234', 'Kaffibot er klar!', params);
});



board.on("ready", function () {


    var multi = new five.Multi({
        controller: "BME280"
    });

    var lcd = new five.LCD({
        pins: ["b2", "b3", "b4", "b5", "b6", "b7"]
    });

    lcd.cursor(0, 0).print("Moccabot!");

    var range = [0, 100];


    var brewing = false
    multi.on("data", function () {
        var params = {
            icon_emoji: ':moccamaster:'
        };
        var temp = this.thermometer.celsius

        if (temp > 24 && !brewing) {
            brewing = true
            lcd.cursor(1, 0).print("Brygger... (" + this.thermometer.celsius + ")")
            console.log("Noen har satt på kaffien!")

            bot.postMessageToUser('dataknut', 'Noen har satt på kaffien!', params);
        }
        if (temp < 24 && brewing) {
            lcd.cursor(1, 0).print("Kaffien er ferdig!")
            console.log("Kaffien er ferdig!")
            brewing = false

            bot.postMessageToUser('dataknut', 'Kaffien er ferdig!', params);
        }
    })

});
