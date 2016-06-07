'use strict';

let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('admin/index', { title: 'Admin Panel' });
});


module.exports = router;
