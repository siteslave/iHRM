'use strict';

let express = require('express');
let router = express.Router();

let Login = require('../models/login');
let crypto = require('crypto');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/login');
});

router.get('/login', (req, res, next) => {
  if (req.query.t == '1') {
    res.render('admin-login')
  } else {
    res.render('user-login')
  }
  
});

router.post('/user-login', (req, res, next)  => {
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    let _password = crypto.createHash('md5').update(password).digest('hex');
    Login.userLogin(req.db, username, _password)
      .then(rows => {
        if (rows.length) {
          req.session.logged = true;
          req.session.userType = 0;
          req.session.userId = rows[0].id;
          req.session.fullname = rows[0].fullname;
          req.session.department_id = rows[0].department_id;
          req.session.department_name = rows[0].department_name;
          req.session.sub_department_name = rows[0].sub_department_name;
          res.redirect('/users')
        } else {
          if (req.body.t == 1) {
            res.render('admin-login', {err: 'Incorrect username/password!'})
          } else {
            res.render('user-login', {err: 'Incorrect username/password!'})
          }

        }
      })
      .catch(err => res.render('login', {err: JSON.stringify(err)}));
    
  } else {
    if (req.body.t == 1) {
      res.render('admin-login', {err: 'Data incomplete!'})
    } else {
      res.render('user-login', {err: 'Data incomplete!'})
    }
  }
});

router.post('/admin-login', (req, res, next)  => {
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    let _password = crypto.createHash('md5').update(password).digest('hex');
    Login.adminLogin(req.db, username, _password)
      .then(rows => {
        if (rows[0].total) {
          req.session.logged = true;
          req.session.userType = 1;
          res.redirect('/admin')
        } else {
          if (req.body.t == 1) {
            res.render('admin-login', {err: 'Incorrect username/password!'})
          } else {
            res.render('user-login', {err: 'Incorrect username/password!'})
          }
        }
      })
      .catch(err => res.render('login', {err: JSON.stringify(err)}));

  } else {
    if (req.body.t == 1) {
      res.render('admin-login', {err: 'Data incomplete!'})
    } else {
      res.render('user-login', {err: 'Data incomplete!'})
    }
  }
});

router.get('/logout', (req, res, next) => {

  req.session.destroy(function(err){
    if(err){
      res.send({ok: false, msg: err})
    } else {
      res.redirect('/login');
    }
  });

});

module.exports = router;
