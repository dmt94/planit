const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');

require('dotenv').config();
require('./config/database');
require('./config/passport');

const indexRouter = require('./routes/index');
const dashboardRouter = require('./routes/dashboard');
const dayRouter = require('./routes/day');
const eventRouter = require('./routes/event');
const settingsRouter = require('./routes/settings');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/scripts', express.static(__dirname + '/public/javascript/calendar'));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
/* Makes sure that the logged in user is in a user variable that's available inside all EJS templates. If nobody is logged in, user will be undefined. */
app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});

app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);
app.use('/day', dayRouter);
app.use('/', eventRouter);
app.use('/settings', settingsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
