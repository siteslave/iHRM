var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/admin/main', function(req, res, next) {
  res.render('admin/partials/main');
});

router.get('/admin/money', function(req, res, next) {
  res.render('admin/partials/money');
});

router.get('/admin/money/main', function(req, res, next) {
  res.render('admin/partials/money-main');
});

router.get('/admin/money/new', function(req, res, next) {
  res.render('admin/partials/money-new');
});

module.exports = router;
