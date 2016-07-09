'use strict';

let express = require('express');
let router = express.Router();
let moment = require('moment');

let Education = require('../../models/education');

router.post('/list', (req, res, next) => {
  let db = req.db;
  let limit = req.body.limit;
  let offset = req.body.offset;

  Education.list(db, limit, offset)
    .then(rows => res.send({ ok: true, rows: rows }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/total', (req, res, next) => {
  let db = req.db;
  Education.total(db)
    .then(rows => res.send({ ok: true, total: rows[0].total }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.put('/', (req, res, next) => {
  let db = req.db;
  let educationId = req.body.id;
  let courseName = req.body.courseName;
  let requestYear = req.body.requestYear;
  let institution = req.body.institution;
  let peroid = req.body.peroid;
  let updatedAt = moment().format('YYYY-MM-DD HH:mm:ss'); 

  let education = {};
  
  if (courseName && requestYear && institution && peroid) {
    education.course_name = courseName;
    education.request_year = requestYear;
    education.institution = institution;
    education.peroid = peroid;
    education.updated_at = updatedAt;

    Education.update(db, educationId, education)
      .then(() => res.send({ ok: true }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ ok: false, msg: 'ข้อมูลไม่สมบูรณ์ กรุณาตรวจสอบ' });
  }
});

router.delete('/:id', (req, res, next) => {
  let db = req.db;
  let id = req.params.id;

  if (id) {
    Education.remove(db, id)
      .then(() => res.send({ ok: true }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ ok: false, msg: 'Id not found!' });
  }
});

router.post('/', (req, res, next) => {
  let db = req.db;
  let courseName = req.body.courseName;
  let requestYear = req.body.requestYear;
  let institution = req.body.institution;
  let peroid = req.body.peroid;
  let userId = req.session.userId;
  let created_at = moment().format('YYYY-MM-DD HH:mm:ss');

  let education = {};
  
  if (courseName && requestYear && institution && peroid) {
    education.course_name = courseName;
    education.request_year = requestYear;
    education.institution = institution;
    education.peroid = peroid;
    education.employee_id = userId;
    education.created_at = created_at;

    Education.save(db, education)
      .then(() => res.send({ ok: true }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ ok: false, msg: 'ข้อมูลไม่สมบูรณ์ กรุณาตรวจสอบ' });
  }
});

module.exports = router;
