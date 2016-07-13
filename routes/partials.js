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
  res.render('admin/partials/dialogs/employee-new');
});

router.get('/admin/meeting-history', (req, res, next) => {
  res.render('admin/partials/meeting-history');
});

router.get('/admin/meetings', (req, res, next) => {
  res.render('admin/partials/meetings');
});

router.get('/admin/staff', (req, res, next) => {
  res.render('admin/partials/staff');
});

router.get('/admin/staff/dialog/new', (req, res, next) => {
  res.render('admin/partials/dialogs/staff-new');
});

router.get('/admin/staff/dialog/update', (req, res, next) => {
  res.render('admin/partials/dialogs/staff-update');
});

router.get('/admin/meetings/dialog/new', (req, res, next) => {
  res.render('admin/partials/dialogs/meeting-new');
});

router.get('/admin/meetings/dialog/assign', (req, res, next) => {
  res.render('admin/partials/dialogs/meeting-assign');
});

router.get('/admin/meetings/dialog/registered-list', (req, res, next) => {
  res.render('admin/partials/dialogs/registered-list');
});

router.get('/admin/reports', (req, res, next) => {
  res.render('admin/partials/reports');
});

router.get('/admin/reports/meeting', (req, res, next) => {
  res.render('admin/partials/reports-meeting');
});

router.get('/admin/reports/department', (req, res, next) => {
  res.render('admin/partials/reports-department');
});


// Driver
router.get('/admin/drivers', (req, res, next) => {
  res.render('admin/partials/drivers');
});
router.get('/admin/drivers/dialogs/new', (req, res, next) => {
  res.render('admin/partials/dialogs/driver-new');
});
// Car request
router.get('/admin/car-request', (req, res, next) => {
  res.render('admin/partials/car-request');
});
router.get('/admin/car-request/dialogs/approve', (req, res, next) => {
  res.render('admin/partials/dialogs/car-request-approve');
});

// Ask permission
router.get('/admin/ask-permission', (req, res, next) => {
  res.render('admin/partials/ask-permission');
});
router.get('/admin/ask-permission/dialogs/employee-list', (req, res, next) => {
  res.render('admin/partials/dialogs/ask-permission-employee-list');
});

// Staff
router.get('/staff/main', (req, res, next) => {
  res.render('staff/partials/main');
});
router.get('/staff/meeting', (req, res, next) => {
  res.render('staff/partials/meeting');
});
router.get('/staff/info', (req, res, next) => {
  res.render('staff/partials/info');
});

// Users
router.get('/users/main', (req, res, next) => {
  res.render('users/partials/main');
});

router.get('/users/meetings', (req, res, next) => {
  res.render('users/partials/meetings');
});

router.get('/users/dialogs/meeting-register', (req, res, next) => {
  res.render('users/partials/dialogs/meeting-register');
});

router.get('/users/reports', (req, res, next) => {
  res.render('users/partials/reports');
});

router.get('/users/dialogs/meeting-detail', (req, res, next) => {
  res.render('users/partials/dialogs/meeting-detail');
});

router.get('/users/info', (req, res, next) => {
  res.render('users/partials/info');
});

// Education
router.get('/users/education', (req, res, next) => {
  res.render('users/partials/education');
});

router.get('/users/education/dialogs/new', (req, res, next) => {
  res.render('users/partials/dialogs/education-new');
});
// Car request
router.get('/users/car-request', (req, res, next) => {
  res.render('users/partials/car-request');
});
router.get('/users/car-request/dialogs/new', (req, res, next) => {
  res.render('users/partials/dialogs/car-request-new');
});
router.get('/users/car-request/dialogs/approve-info', (req, res, next) => {
  res.render('users/partials/dialogs/car-request-approve');
});

// Ask Permission
router.get('/users/ask-permission', (req, res, next) => {
  res.render('users/partials/ask-permission');
});

router.get('/users/ask-permission/dialogs/new', (req, res, next) => {
  res.render('users/partials/dialogs/ask-permission-new');
});


module.exports = router;
