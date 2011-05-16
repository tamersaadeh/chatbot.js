var http = require('http');
var url = require('url');
var data;

function chat(res, d) {
	data = d;
	if(getQuery('botkey') == 'A8FB91D3-01C1-42C9-B23EBF12AE68FE3C') { //&& (getQuery('userkey') == '7B22E88B-DDBD-4BB9-AF7DDA9C1C79C603')) {
		var msg = getQuery('msg');
		switch(msg) {
		case "weather":
			res.end("Hi, what's your name?");break;
		case "forcast":
			res.end("Cool name!\nHow old are you?");break;
		case "def":
			res.end("Aren't we a bit young? ;)");break;
		case "definition":
			res.end("Details Sent:\n"+getValue(0)+"\n"+getValue(1)+"\n"+getValue(2)+"\n"+getValue(3)+"\nI'm currently dumb");break;
		case "bye":
			res.end("Goodbye!");http.close();break;
		}
	} else {
		res.end("botkey invalid");
	}
}

function getValue(val) {
	return getQuery('value'+val);
}

function getQuery(item) {
	var query = url.parse('/?'+data, true)['query'];
	return query[item];
}

var server = http.Server(function(req, res) {
	if(req.headers['user-agent'] == 'Imified/1.0') {
		req.on('data', function(data) {
			chat(res, data);
		});
	} else {
		res.end("access via chat only");
	}
	
});

server.listen(20000);
