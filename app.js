var express = require('express')
  , routes = require('./routes')
  , http = require('http')
	, favicon = require('serve-favicon')
	, logger = require('morgan')
	, methodOverride = require('method-override')
	, bodyParser = require('body-parser')
	, errorHandler = require('errorhandler')
  , fs = require('fs')
  , path = require('path');

global.config = require('./config.js');

var app = express();
var maxAge = 365 * 24 * 60 * 60 * 1000;

app.set('port', config.port || 9999);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/favicon.ico'));
app.use(methodOverride());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: maxAge }));


if ('development' == app.get('env')) {
	app.use(errorHandler());
}

app.get('*', function(req, res) {
	res.header('Access-Control-Allow-Origin', '*');

	var url = req.url.split('/');
	url = url.filter(function(n){ return n !== ''; });
	if ( url.length >= 1 ) {
		if (url[0] == 'report') {
			var report = require('./objects/report.js');
			if (url[1] == 'mail') {
				report.mail(req, res, url[2]);
			}
			else if (url[1] == 'order4customer' || url[1] == 'order4office' || url[1] == 'envelope') {
				report.generate(req, res, url[1], url[2], url[3]);
			}
			else if (url[1] == 'dealer') {
				report.dealer(req, res, url[2], url[3].replace('.pdf', ''));
			}
      else if (url[1] == 'aging' || url[1] == 'run_rate') {
				report.action(req, res, url[1], url[2], url[3], url[4]);
			}
			else {
				report.action(req, res, url[1], url[2]);
			}
		}
		else if (url[0] == 'barcode') {
			var barcode = require('./objects/barcode.js');
			barcode.generate(req, res, url[1]);
		}
		else if (url[0] == 'test') {
			var test = require('./objects/test.js');
			test.action(req, res);
		}
		else {
			fs.exists('./views/'+url[0]+'.jade', function (exists) {
				if (exists) {
					fs.exists('./public/javascripts/'+url[0]+'.js', function (exists) {
						routes.index(req, res, url[0], (exists) ? '/javascripts/'+url[0]+'.js' : '' );
					});
				}
				else {
					routes.index(req, res, 'index', '');
				}
			});
		}
	}
	else {
		routes.index(req, res, 'index', '');
	}
});

app.post('*', function(req, res) {

	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	global.data = {};
	data.result = null;
	data.success = false;
	data.error = 'No Action';

	var url = req.headers['referer'].split('/');
	if (config.origin.indexOf(url[2]) > -1) {

		url = req.url.split('/');
		url = url.filter(function(n){ return n !== ''; });

		if ( url.length >= 2 ) {
			var control = url[0];
			var action = url[1];
			url[0] = null;
			url[1] = null;
			url = url.filter(function(n){ return n !== null; });
			fs.exists('./objects/'+control+'.js', function (exists) {
				if (exists) {
					var object = require('./objects/'+control);
					object.action(req, res, object, action, url);
				}
				else {
					res.json(data);
				}
			});
		}
	}
	else {
		data.error = 'Your site do not allow access to this resource';
		res.json(data);
	}
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
