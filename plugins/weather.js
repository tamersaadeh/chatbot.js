var http = require('http'),
    util = require('util'),
    jsdom = require('jsdom');

var c,f;

exports.current = function(location) {
	query(location, function (contents) {
		var body, reply = [];
		try {
			body = getDom(contents);
		} catch (e) {
			return 'Could not fetch weather data.';
		}
		console.log(body);
		var city = body.getElementsByTagName('city')[0];
		if (!city || !city.getAttribute) {
			return 'No city -> no weather.';
		}
		reply.push('Weather for ' + city.getAttribute('data'));
		var currentCondition = body.getElementsByTagName('current_conditions')[0];
		var conditions = currentCondition.getElementsByTagName('condition')[0];
		var temp = currentCondition.getElementsByTagName('temp_c')[0];
		var humidity = currentCondition.getElementsByTagName('humidity')[0];
		
		reply.push('Current conditions: ' + conditions.getAttribute('data') + 
				   ' ' + temp.getAttribute('data') + 'ºc');
		reply.push(humidity.getAttribute('data'));
		return reply.join("\n");
	});
	console.log("\na: "+a);
	return a;
}


exports.forecast = function(location) {
	query(location, function (contents) {
		var body, reply = [];
		try {
			body = getDom(contents);
		} catch (e) {
			return 'Could not fetch weather data.';
		}
		console.log(body);
		var forecast = Array.prototype.slice.call(body.getElementsByTagName('forecast_conditions'));

		forecast.forEach(function (element) {
			var text;
			var day = element.getElementsByTagName('day_of_week')[0].getAttribute('data');
			var low = element.getElementsByTagName('low')[0].getAttribute('data');
			var high = element.getElementsByTagName('high')[0].getAttribute('data');
			var condition = element.getElementsByTagName('condition')[0].getAttribute('data');
			text = day + ' ' + condition + ' high of: ' + convertTemp(high) + ' low of: ' + convertTemp(low);
			reply.push(text);
		});
		f = reply.join("\n");
		//return a;
	});
	console.log("\nf: "+f);
	return f;
};

function convertTemp(faren) {
	return ((5 / 9) * (faren - 32)).toFixed(0);
}

function getDom(contents) {
	body = jsdom.jsdom(contents.body);
	if (body.getElementsByTagName('weather')[0].childNodes.length === 0) {
		throw Error('No xml response');
	}
	return body;
}

function query(location, callback) {
	console.log("\nquery: "+location);
	var options = {
		host: 'www.google.com',
		path: '/ig/api?weather=' + encodeURIComponent(location.trim()),
	};
	http.get(options, function (response) {
		var contents = {body: ''};
		response.on('data', function(chunk) {
			contents.body += chunk;
		});
		response.on('end', callback.bind(this, contents));
	});
}
