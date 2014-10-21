var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var connection = require('express-myconnection');
var session = require('express-session');
var http = require('http');

// Rest Client
var Client = require('node-rest-client').Client;
client = new Client();

var twitterKey = require('./keys/twitter');
var consumer_key = twitterKey.consumer_key;
var consumer_secret = twitterKey.consumer_secret;
var access_token = twitterKey.access_token;
var access_token_secret = twitterKey.access_token_secret;

var Twit = require('twit');

/*var twitter = new Twit({
  consumer_key: consumer_key,
  consumer_secret: consumer_secret,
  access_token: access_token,
  access_token_secret: access_token_secret
});*/

var routes = require('./routes/index');
var users = require('./routes/users');
var secure = require('./routes/secure');

var mozilliansKey = require('./keys/mozillians');
var url_server = mozilliansKey.url_server;
var app_name = mozilliansKey.app_name;
var api_key = mozilliansKey.app_key;

var app = express();

function checkAuth(req, res, next) {
  if (!req.session.loggedIn) {
    //console.log(req.session.user_id)
    res.send('You are not authorized to view this page');
    //res.redirect('/login');
  } else {
    next();
  }
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'keyboard cat'}))

app.use(
    connection(mysql,{
        host: 'localhost',
        user: 'root',
        password : 'mysql',
        port : 3306, //port mysql
        database:'mozillians_on_twitter'
    },'pool') //or single
);

app.use('/', routes);
app.get('/users', checkAuth, users.list);
app.get('/users/add', users.add);
app.post('/users/add', users.save);
app.get('/users/delete/:id', users.delete_user);
app.get('/users/edit/:id', users.edit);
app.post('/users/edit/:id',users.save_edit);

app.get('/my_secret_page', checkAuth, function (req, res) {
  res.send('if you are viewing this page it means you are logged in');
});

app.get('/login', secure.login);
app.post('/login', secure.validate);
app.get('/logout', secure.logout);

client.registerMethod("jsonGetInfAboutUserByEmail",
url_server+"/api/v1/users/?app_name="+app_name+"&app_key="+api_key+"&email=willy@mozilla.pe", "GET");

client.methods.jsonGetInfAboutUserByEmail(function(data,response){
    // parsed response body as js object
    console.log(data);
    // raw response
    console.log(response);
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
