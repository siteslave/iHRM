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

router.get('/admin/meeting-history', (req, res, next) => {
  res.render('admin/partials/meeting-history');
});

router.get('/admin/meetings', (req, res, next) => {
  res.render('admin/partials/meetings');
});

router.get('/admin/meetings/dialog/new', (req, res, next) => {
  res.render('admin/partials/dialogs/new-meetings');
});

router.get('/admin/meetings/dialog/assign', (req, res, next) => {
  res.render('admin/partials/dialogs/meeting-assign');
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

router.get('/users/reports', (req, res, next) => {
  res.render('users/partials/reports');
});

router.get('/users/dialogs/detail-meetings', (req, res, next) => {
  res.render('users/partials/dialogs/detail-meetings');
});

router.get('/users/info', (req, res, next) => {
  res.render('users/partials/info');
});

module.exports = router;
