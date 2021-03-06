var path = require('path');
var http = require('http');
var config = require('config');
var compression = require('compression');
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var routes = require('./app/routes/routes');



/**
 * TO LOAD MODULE FOLDERS
 */

var app = module.exports = express();

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

mongoose.connect(config.get('mongoDBURI'), {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(
  () => { console.log('Connected mongo...') },
  err => { console.log('Not Connected mongo...') }
);

// ExpressJS Configuration
app.set('views', __dirname + '/app/views');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json({limit:'100mb'}));
app.use(methodOverride());
app.use(compression());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);


/**
 * Server connection..
 */
var server = http.createServer(app);

server.listen(process.env.PORT || 3500, function() {
	console.log("Express server listening on port: ", process.env.PORT || 3500);
});