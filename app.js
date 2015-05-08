var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//For file uploading 
var multer = require('multer');


var app = express();
//--------Adding the ejs-locals for sharing the variables and layouts--------/
var engine = require("ejs-locals");
app.engine('ejs',engine);
//--------The ejs-locals for sharing the variables and layouts--------/


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded());

//use multer for parsing
app.use(multer({
    dest: "./uploads/"
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//passport section-------------------------
var passport = require('passport');
var flash    = require('connect-flash');
var expressSession = require('express-session');
//inside the app.configure or app.js
app.use(expressSession({ secret: 'mySecretKey' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in sessions

//pass the passport to the required router
require('./config/passport')(passport); 
var fs = require("fs");
fs.readdirSync('./controllers').forEach(function(file) {
    if (file.substr(-3) == ".js") {
        route = require('./controllers/' + file);
        route.controller(app, passport);
    }
});
//---------------------------------------

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

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
