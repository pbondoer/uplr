var http = require('http');
var fs = require('fs');
var crypto = require('crypto');

var config = require('./config');

var headers = {
	'Content-Type': 'text/plain; charset=utf-8',
	'Server': 'uplr'
};
var TEAPOT = 418;
var CREATED = 201;
var TOO_LARGE = 413;
var ERROR = 500;

var getId = function(size) {
	return crypto.randomBytes(Math.ceil(size / 2)).toString('hex').substring(0, size);
}

http.createServer(function(request, response) {

	// Handle bogus requests
	if (request.method !== 'POST' || request.headers['x-uplr'] !== config.key)
	{
		response.writeHead(TEAPOT, headers);
		response.end("uplr image upload server\nhttps://github.com/pbondoer/uplr\n\n\n<!-- here be dragons -->\n");
		return;
	}

	var data = [];
	var current_size = 0;

	request.on('data', function(chunk) {
		data.push(chunk);
		current_size += chunk.length;

		// Is it too much?
		if (current_size > config.max_size) {
			data = [];

			response.writeHead(TOO_LARGE, headers);
			response.end('File uploaded is too large.', function() {
				request.connection.destroy();
			});
		}
	});

	request.on('end', function() {
		if (response.finished) {
			return;
		}

		// Did we get any data?
		if (current_size === 0)
		{
			response.writeHead(ERROR, headers);
			response.end('The file you tried to upload was empty.');
		}

		// Make one buffer
		data = Buffer.concat(data);

		// Generate a valid ID
		var id = getId(config.id_size) + '.png';
		while (fs.existsSync(config.path + id))
		{
			id = getId(config.id_size) + '.png';
		}

		// Write the file
		fs.writeFile(config.path + id, data, function(err) {
			if (err) {
				console.log(err);

				response.writeHead(ERROR, headers);
				response.end('There was an error writing the file to disk.');
			}

			// Return the URL
			var url = config.prefix + id;

			console.log('-> ' + url);

			response.writeHead(CREATED, headers);
			response.end(url);
		});

	});

}).listen(config.port, function () {
	console.log('uplr.it backend');
	console.log('=> localhost:' + config.port);
	if (config.key === 'your_api_key')
	{
		console.log('/!\\ Your API key is still the default, consider changing it!');
	}
});
