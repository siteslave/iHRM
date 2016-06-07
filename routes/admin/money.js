'use strict';

let express = require('express');
let router = express.Router();

let Money = require('../../models/money');

/* GET home page. */
router.get('/list', (req, res, next) => {
  Money.list(req.db)
    .then(rows => res.send({ ok: true, rows: rows }),
    err => res.send({ ok: false, msg: err }));
});

module.exports = router;
