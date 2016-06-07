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

router.get('/admin/money/main', (req, res, next) => {
  res.render('admin/partials/money-main');
});

router.get('/admin/money/new', (req, res, next) => {
  res.render('admin/partials/money-new');
});

module.exports = router;
