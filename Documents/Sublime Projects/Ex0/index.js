var http = require('http');
var gol = require('./ws_gol')

var CScallb = function(req,res){
	res.writeHead(200, {'Content-Type' : 'text/plain'});
	res.end('server is built!\n');
}
var server = http.createServer(CScallb);
server.listen(3000,'127.0.0.1');
console.log("Server is listening on port 3000");

//run methods

gol.plus_gol(5);
gol.plus_gol(12);
gol.minus_gol(2);
gol.minus_gol(20);