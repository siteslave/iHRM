'use strict';

let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');

let routes = require('./routes/index');
let admin = require('./routes/admin/index');
let adminMeetings = require('./routes/admin/meetings');
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

app.use(session({
  secret: 'MySecretkEy1-9',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

let userAuth = (req, res, next) => {
  if (!req.session.logged) {
    if (req.xhr) {
      res.send({ok: false, msg: 'Please login'})
    } else {
      res.redirect('/login')
    }

  } else {
    next();
  }
};

let isAdmin = (req, res, next) => {
  if (req.session.userType != 1) {
    if (req.xhr) {
      res.send({ok: false, msg: 'Please login as administrator'})
    } else {
      res.redirect('/login')
    }
  } else {
    next();
  }
};

let isUser = (req, res, next) => {
  if (req.session.userType != 0) {
    if (req.xhr) {
      res.send({ok: false, msg: 'Please login as administrator'})
    } else {
      res.redirect('/login')
    }
  } else {
    next();
  }
};

app.use(function(req,res,next){
  res.locals.session = req.session;
  next();
});

// Middleware
app.use((req, res, next) => {
  req.db = db;
  next();
});


app.use('/basic', basic);
app.use('/partials', userAuth, partials);
app.use('/admin', userAuth, isAdmin, admin);
app.use('/admin/employee', userAuth, isAdmin, employee);
app.use('/admin/meetings', userAuth, isAdmin, adminMeetings);
app.use('/admin/money', userAuth, isAdmin, money);
app.use('/admin/department', userAuth, isAdmin, department);
app.use('/admin/sub-department', userAuth, isAdmin, subDepartment);

app.use('/users', userAuth, isUser, users);
app.use('/users/meetings', userAuth, isUser, userMeetings);

app.use('/', routes);

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
