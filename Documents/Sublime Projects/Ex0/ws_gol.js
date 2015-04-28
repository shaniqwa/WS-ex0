var events = require('events');
var util = require('util');
util.inherits(Player, events.EventEmitter);

//player constructor
function Player () {
	this.gols = 0;
	events.EventEmitter.call(this);
}

//Player prototypes
exports.Player.prototype.plus_gol = function (amount) {
	this.gols += amount;
	this.emit('golChanged'); //golChanged is the name of the event
};

exports.Player.prototype.minus_gol = function (amount) {
	this.gols -= amount;
	this.emit('golChanged');
}

//the callback functions
function displayGols() {
	console.log("Player gol balance is " + this.gols + " goals!!");
}
function ZeroGoals () {
	if(this.gols < 0 ){
		console.log("Player goals is less then Zero! " + this.gols);
	}
}

//create Player instance and attach callbacks to events
var messi = new Player();
messi.on("golChanged", displayGols);
messi.on("golChanged", ZeroGoals);

// //run methods
// messi.plus_gol(5);
// messi.plus_gol(12);
// messi.minus_gol(2);
// messi.minus_gol(20);