var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// REQUIRE SEQUELIZE INSTANCE CREATED WHEN SEQUELIZE CLI WAS USED
const { sequelize } = require('./models/index');

// IMPORT ROUTER
var indexRouter = require('./routes/index');

var app = express();

// VIEW ENGINE SETUP
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CONNECT TO DB / LOG MESSAGE
sequelize.authenticate()
  .then(() => {
    console.log('Connection to database successful!');
  })
  .catch(err => {
    console.error('Unable to connect to database!', err);
  });

// SYNC MODELS
sequelize.sync()
  .then(() => {
    console.log('Models synced successfully!');
  })
  .catch(err => {
    console.error('Unable to sync models!', err);
  });

// USE ROUTER
app.use('/', indexRouter);

// CATCH 404 AND FORWARD TO GLOBAL HANDLER
app.use((req, res, next) => {
  const err = new Error();
  err.status = 404;
  err.message = 'That page does not exist!'
  next(err);
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  err.status = err.status || 500;
  err.message = err.message || 'There seems to be a server issue!'
  console.log(`${err.status}: ${err.message}`);
  res.render('error', {err});
});

module.exports = app;
