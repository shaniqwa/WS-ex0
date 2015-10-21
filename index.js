var http = require('http');
var Gol = require('./ws_gol')

//run methods
var messi = new Gol('Messi');
messi.plus_gol(2);
messi.minus_gol(1);
messi.minus_gol(3);
messi.plus_gol(2);

var ronaldo = new Gol('Ronaldo');
ronaldo.plus_gol(4);
ronaldo.plus_gol(3);
ronaldo.minus_gol(1);
ronaldo.plus_gol(2);

var CScallb = function(req,res){
	res.writeHead(200, {'Content-Type' : 'text/plain'});
	res.end('hello server! Success!\n\n' + messi.str + ronaldo.str);
}
var server = http.createServer(CScallb);
server.listen(3000,'127.0.0.1');
console.log("Server is listening on port 3000");