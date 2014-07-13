var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Rest Client
var Client = require('node-rest-client').Client;
client = new Client();

var twitterKey = require('./keys/twitter');
var consumer_key = twitterKey.consumer_key;
var consumer_secret = twitterKey.consumer_secret;
var access_token = twitterKey.access_token;
var access_token_secret = twitterKey.access_token_secret;

var Twit = require('twit');

var twitter = new Twit({
  consumer_key: consumer_key,
  consumer_secret: consumer_secret,
  access_token: access_token,
  access_token_secret: access_token_secret
});

var mozilliansKey = require('./keys/mozillians');
var url_server = mozilliansKey.url_server;
var app_name = mozilliansKey.app_name;
var api_key = mozilliansKey.app_key;

//var routes = require('./routes');
var dashboard = require('./routes/dashboard');
var security = require('./routes/security');

var app = express();

app.use(express.json())
  .use(express.urlencoded())
  .use(express.cookieParser())
  .use(express.session({
    secret: "mozillapersona"
  }));

require("express-persona")(app, {
  audience: "http://localhost:3000" // Must match your browser's address bar
});

// view engine setup
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

app.get('/', dashboard.main);
app.get('/login', security.login);

// registering remote methods
client.registerMethod("jsonGetInfAboutUserByEmail",
url_server+"/api/v1/users/?app_name="+app_name+"&app_key="+api_key+"&email=marti1125@gmail.com", "GET");

client.methods.jsonGetInfAboutUserByEmail(function(data,response){
    // parsed response body as js object
    console.log(data);
    // raw response
    console.log(response);
});

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
