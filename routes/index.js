'use strict';

let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/admin');
});

module.exports = router;
