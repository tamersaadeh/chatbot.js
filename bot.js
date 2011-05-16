var http = require('http'),
    url = require('url'),
    w = require('./plugins/weather.js'),
    d = require('./plugins/definitions.js');
var data;

var weather = w;
var def = d;

function chat(res, d) {
	data = d;
	if(getQuery('botkey') == 'A8FB91D3-01C1-42C9-B23EBF12AE68FE3C') { //&& (getQuery('userkey') == '7B22E88B-DDBD-4BB9-AF7DDA9C1C79C603')) {
		var msg = getQuery('msg');
		switch(msg) {
		case "weather":
			res.end(weather.current("Washington, DC"));break;
		case "forcast":
			res.end(weather.forecast("Washington, DC"));break;
		case "def":
			res.end(def.define("Google"));break;
		case "definition":
			res.end(def.define("Google"));break;
		case "define":
			res.end(def.define("Google"));break;
		case "bye":
			res.end("Goodbye!");http.close();break;
		default:
			res.end("Usage:\nweather <location>\nforcast <location>\ndefine/def/definition <word>\n****");
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
