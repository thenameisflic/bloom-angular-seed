var express = require('express');
var path = require('path');

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8084;

var app = express();
app
	.use(express.static(path.resolve('/app')))
    .get('/', function (req, res) {
        res.sendFile(path.resolve('app/index.html'));
    })
	.get('*/', function (req, res) {
        res.sendFile(path.resolve('app/' + req.path));
    })
    .listen(port, ipaddress, function() {
		console.log('%s: Server started on %s:%d ...',
            Date(Date.now()), ipaddress, port);
	});