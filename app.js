'use strict';
require('dotenv').config();

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
let position = require('./routes/admin/position');
let department = require('./routes/admin/department');
let subDepartment = require('./routes/admin/sub-department');
let employee = require('./routes/admin/employee');
let adminStaff = require('./routes/admin/staff');
let adminReport = require('./routes/admin/reports');
let adminDrivers = require('./routes/admin/drivers');
let adminCarRequest = require('./routes/admin/car-request');
let adminAskPermission = require('./routes/admin/ask-permission');

let partials = require('./routes/partials');
let basic = require('./routes/basic');

let users = require('./routes/users');
let userMeetings = require('./routes/users/meetings');
let userEducation = require('./routes/users/education');
let userCarRequest = require('./routes/users/car-request');
let userAskPermission = require('./routes/users/ask-permission');

let staff = require('./routes/staff');

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
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
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
  if (req.session.type != 1) {
    if (req.xhr) {
      res.send({ok: false, msg: 'Please login as administrator'})
    } else {
      res.redirect('/login?t=1')
    }
  } else {
    next();
  }
};

let isUser = (req, res, next) => {
  if (req.session.type != 2) {
    if (req.xhr) {
      res.send({ok: false, msg: 'Please login as user'})
    } else {
      res.redirect('/login?t=2')
    }
  } else {
    next();
  }
};

let isStaff = (req, res, next) => {
  if (req.session.type != 0) {
    if (req.xhr) {
      res.send({ok: false, msg: 'Please login as staff'})
    } else {
      res.redirect('/login?t=0')
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
app.use('/admin/staff', userAuth, isAdmin, adminStaff);
app.use('/admin/employee', userAuth, isAdmin, employee);
app.use('/admin/meetings', userAuth, isAdmin, adminMeetings);
app.use('/admin/money', userAuth, isAdmin, money);
app.use('/admin/position', userAuth, isAdmin, position);
app.use('/admin/department', userAuth, isAdmin, department);
app.use('/admin/sub-department', userAuth, isAdmin, subDepartment);
app.use('/admin/reports', userAuth, isAdmin, adminReport);
app.use('/admin/drivers', userAuth, isAdmin, adminDrivers);
app.use('/admin/car-request', userAuth, isAdmin, adminCarRequest);
app.use('/admin/ask-permission', userAuth, isAdmin, adminAskPermission);

app.use('/users', userAuth, isUser, users);
app.use('/users/meetings', userAuth, isUser, userMeetings);
app.use('/users/education', userAuth, isUser, userEducation);
app.use('/users/car-request', userAuth, isUser, userCarRequest);
app.use('/users/ask-permission', userAuth, isUser, userAskPermission);

app.use('/staff', userAuth, isStaff, staff);

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
    console.log(err);
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
  console.log(err);
  res.status(err.status || 500);
   res.send({
      message: err.message,
      error: err
    });
});


module.exports = app;
