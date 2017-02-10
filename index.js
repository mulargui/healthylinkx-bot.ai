/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# RUN THE BOT:
	Get a Bot token from Slack:
		-> http://my.slack.com/services/new/bot
	Run your bot from the command line:
		token=<MY TOKEN> node index.js
# EXTEND THE BOT:
	Botkit has many features for building cool and useful bots!
	Read all about it here:
		-> http://howdy.ai/botkit
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var Botkit = require('botkit');

var controller = Botkit.slackbot({
	debug: false
	//include "log: false" to disable logging
	//or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

var apiai = require('botkit-middleware-apiai')({
    token: process.env.apiai,
    skip_bot: true // or false. If true, the middleware don't send the bot reply/says to api.ai
});

controller.middleware.receive.use(apiai.receive);

var microservice = require("./microservice"); 

// connect the bot to a stream of messages
controller.spawn({
	token: process.env.token,
}).startRTM()

// apiai.hears for intents. in this example is 'hello' the intent
/*controller.hears(['hello', 'hi'], ['direct_message','direct_mention','mention', 'ambient'], apiai.hears, function(bot, message) {
    // ...
	console.log(message);
	bot.reply(message, "I hear you");
});*/

// apiai.action for actions
controller.hears(['SearchDoctors'],['direct_message','direct_mention','mention', 'ambient'],apiai.action,function(bot, message) {
	var gender = message.entities.gender;
	var specialty = message.entities.specialty;
	var zipcode1 = message.entities['zip-code'];
	var distance = message.entities['unit-length'];
	var zipcode = message.entities['zipcode'];
	var lastname = message.entities['last-name'];

	microservice.getSearchResults(zipcode, lastname, distance, gender, specialty)
		.then( function(res) {
			bot.reply(message, res);
	});
});