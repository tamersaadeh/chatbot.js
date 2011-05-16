var net = require('net');
var http = require('http');

var sockets = [];

var server = net.Server(function(socket) {
	sockets.push(socket);
	socket.on('data', function(data) {
		for(var i = 0; i < sockets.length; i++) {
			if (sockets[i] == socket) continue;
			sockets[i].write(data);
		}
	});

	socket.on('end', function() {
		var i = sockets.indexOf(socket);
		delete sockets[i];
	});
	
});

server.listen(20000);
