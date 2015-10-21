var events = require('events');
var util = require('util');
util.inherits(Player, events.EventEmitter);


//player constructor
function Player (name) {
	this.name_ = name; 
	this.gols = 0;
	this.str = '';
	events.EventEmitter.call(this);
}

//Player prototypes
Player.prototype.plus_gol = function (amount) {
	console.log("plus_gol activated!");
	this.gols += amount;
	this.emit('golChanged'); //golChanged is the name of the event
};

Player.prototype.minus_gol = function (amount) {
	console.log("minus_gol activated!");
	this.gols -= amount;
	this.emit('golChanged');
}

Player.prototype.get_str = function () {
	return this.str;
}

//the callback functions
function displayGols() {
	console.log(this.name_ + " gol balance is " + this.gols + " goals!!");
	this.str += this.name_ + " gol balance is " + this.gols + " goals!!\n";
}
function ZeroGoals () {
	if(this.gols < 0 ){
		console.log(this.name_ +" goals is less then Zero! " + this.gols);
		this.str += this.name_ +" goals is less then Zero! " + this.gols +"\n";
	}
}

//exported func: create Player instance and attach callbacks to events
module.exports = function (name) {
	var player = new Player(name);
	player.on("golChanged", displayGols);
	player.on("golChanged", ZeroGoals);
	return player;
}

