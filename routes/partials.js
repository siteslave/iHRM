'use strict';

let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/admin/main', (req, res, next) => {
  res.render('admin/partials/main');
});

router.get('/admin/money', (req, res, next) => {
  res.render('admin/partials/money');
});

router.get('/admin/department', (req, res, next) => {
  res.render('admin/partials/department');
});

router.get('/admin/sub-department', (req, res, next) => {
  res.render('admin/partials/sub-department');
});

router.get('/admin/sub-department/dialog/new', (req, res, next) => {
  res.render('admin/partials/dialogs/new-sub-department');
});

router.get('/admin/employee', (req, res, next) => {
  res.render('admin/partials/employee');
});

router.get('/admin/employee/dialog/new', (req, res, next) => {
  res.render('admin/partials/dialogs/new-employee');
});

// Users
router.get('/users/main', (req, res, next) => {
  res.render('users/partials/main');
});

router.get('/users/meetings', (req, res, next) => {
  res.render('users/partials/meetings');
});

router.get('/users/dialogs/new-meetings', (req, res, next) => {
  res.render('users/partials/dialogs/new-meetings');
});

module.exports = router;
