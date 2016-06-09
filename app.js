'use strict';

let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

let routes = require('./routes/index');
let admin = require('./routes/admin/index');
let money = require('./routes/admin/money');
let department = require('./routes/admin/department');
let subDepartment = require('./routes/admin/sub-department');
let employee = require('./routes/admin/employee');

let partials = require('./routes/partials');
let basic = require('./routes/basic');

let users = require('./routes/users');
let userMeetings = require('./routes/users/meetings');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// MySQL Connection
let db = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ihrm',
    charset: 'utf8'
  }
});

// Middleware
app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use('/', routes);
app.use('/basic', basic);
app.use('/partials', partials);
app.use('/admin', admin);
app.use('/admin/employee', employee);
app.use('/admin/money', money);
app.use('/admin/department', department);
app.use('/admin/sub-department', subDepartment);

app.use('/users', users);
app.use('/users/meetings', userMeetings);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
   res.send({
      message: err.message,
      error: err
    });
});


module.exports = app;
