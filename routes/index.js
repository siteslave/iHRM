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
  } else if (req.query.t == '0') {
    res.render('staff-login')
  } else {
    res.render('user-login')
  }

});

router.post('/staff-login', (req, res, next)  => {
  let username = req.body.username;
  let password = req.body.password;
  console.log(req.body);

  if (username && password) {
    let _password = crypto.createHash('md5').update(password).digest('hex');
    Login.staffLogin(req.db, username, _password)
      .then(rows => {
        console.log(rows);
        if (rows.length) {
          req.session.logged = true;
          req.session.type = 0;
          req.session.staffId = rows[0].id;
          req.session.fullname = `${rows[0].first_name} ${rows[0].last_name}`;
          req.session.departmentId = rows[0].department_id;
          req.session.departmentName = rows[0].department_name;
          res.redirect('/staff')
        } else {
          res.render('staff-login', {err: 'ชื่อผู้ใช้งาน หรือ รหัสผ่าน ไม่ถูกต้อง!'})
        }
      })
      .catch(err => res.render('staff-login', {err: JSON.stringify(err)}));

  } else {
    res.render('staff-login', {err: 'ข้อมูลไม่สมบูรณ์!'})
  }
});

router.post('/user-login', (req, res, next)  => {
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    let _password = crypto.createHash('md5').update(password).digest('hex');
    Login.userLogin(req.db, username, _password)
      .then(rows => {
        console.log(rows)
        if (rows.length) {
          req.session.logged = true;
          req.session.type = 2;
          req.session.userId = rows[0].id;
          req.session.fullname = `${rows[0].title_name}${rows[0].first_name} ${rows[0].last_name}`;
          req.session.department_id = rows[0].department_id;
          req.session.department_name = rows[0].department_name;
          req.session.sub_department_name = rows[0].sub_department_name;
          console.log(req.session)
          res.redirect('/users')
        } else {
          res.render('user-login', {err: 'ชื่อผู้ใช้งาน หรือ รหัสผ่าน ไม่ถูกต้อง!'})
        }
      })
      .catch(err => res.render('user-login', {err: JSON.stringify(err)}));

  } else {
    res.render('user-login', {err: 'ข้อมูลไม่สมบูรณ์!'})
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
          req.session.type = 1;
          res.redirect('/admin')
        } else {
          res.render('admin-login', { err: 'ชื่อผู้ใช้งาน หรือ รหัสผ่าน ไม่ถูกต้อง' })
        }
      })
      .catch(err => {
        res.render('admin-login', { err: JSON.stringify(err) })
      });

  } else {
    res.render('admin-login', {err: 'ข้อมูลไม่สมบูรณ์'})
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
