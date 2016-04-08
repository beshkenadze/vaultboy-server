var restify = require('restify'),
	generatePassword = require('password-generator'),
	CryptoJS = require("crypto-js");

var server = restify.createServer({
	name: 'myapp',
	version: '1.0.0'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/vault/generate_password', function (req, res, next) {
	res.send(201, generatePassword());
	return next();
});

server.post('/vault/encrypt', function (req, res, next) {
	var content = req.params.content;
	var key = req.params.key;
	var result = CryptoJS.AES.encrypt(content, key);
	
	res.send(201, result.toString());
	return next();
});

server.post('/vault/decrypt', function (req, res, next) {
	var encContent = req.params.content;
	var key = req.params.key;
	// Decrypt
	var bytes = CryptoJS.AES.decrypt(encContent.toString(), key);
	var content = bytes.toString(CryptoJS.enc.Utf8);

	res.send(201, content);
	return next();
});

server.get('/vault/:name', function (req, res, next) {
	res.send(req.params);
	return next();
});

server.listen(8080, function () {
	console.log('%s listening at %s', server.name, server.url);
});