'use strict';

let express = require('express');
let router = express.Router();

let Title = require('../models/title');
let Position = require('../models/position');
let Department = require('../models/department');
let SubDepartment = require('../models/sub-department');
let Money = require('../models/money');
let TypeMeetings = require('../models/type-meetings');
let Transport = require('../models/transport');

router.get('/type-meetings', (req, res, next) => {
  TypeMeetings.list(req.db)
    .then(rows => res.send({ ok: true, rows: rows }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.get('/title', (req, res, next) => {
  Title.list(req.db)
    .then(rows => res.send({ ok: true, rows: rows }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.get('/position', (req, res, next) => {
  Position.list(req.db)
    .then(rows => res.send({ ok: true, rows: rows }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.get('/department', (req, res, next) => {
  Department.list(req.db)
    .then(rows => res.send({ ok: true, rows: rows }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.get('/money', (req, res, next) => {
  Money.list(req.db)
    .then(rows => res.send({ ok: true, rows: rows }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.get('/sub-department/:id', (req, res, next) => {
  let mainId = req.params.id;

  SubDepartment.listByMain(req.db, mainId)
    .then(rows => res.send({ ok: true, rows: rows }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.get('/transport', (req, res, next) => {
  Transport.list(req.db)
    .then(rows => res.send({ ok: true, rows: rows }))
    .catch(err => res.send({ ok: false, msg: err }));
});

module.exports = router;
