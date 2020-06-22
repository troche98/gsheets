const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Enable bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended:false} ));

//Enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token");
  next();
});

const path = require('path');

app.engine('html', require('ejs').renderFile);
app.set('views',  path.join(__dirname,'/public'));

/*
** Routes
*/
var oauth2Controller = require('./controller/oauth2google');
app.use('/', oauth2Controller);

var dashboardController = require('./controller/dashboard');
app.use('/', dashboardController);

app.use('/', (req, res) => {
  res.render('connect.ejs');
});

/*
** Errors Management
*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log("Page not found 404");

  // render the error page
  res.status(err.status || 500);
  res.json({error : err});
});

module.exports = app;
