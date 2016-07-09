let express = require('express');
let router = express.Router();
let moment = require('moment');

let CareRequest = require('../../models/car-request');

router.post('/list', (req, res, next) => {
  let db = req.db;
  let employeeId = req.session.userId;
  let limit = req.body.limit;
  let offset = req.body.offset;

  CareRequest.list(db, employeeId, limit, offset)
    .then(rows => res.send({ ok: true, rows: rows }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/total', (req, res, next) => {
  let db = req.db;
  let employeeId = req.session.userId;

  CareRequest.total(db, employeeId)
    .then(rows => res.send({ ok: true, total: rows[0].total }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/', (req, res, next) => {
  let db = req.db;
  let request = {};
  
  request.employee_id = req.session.userId;
  request.request_date = moment().format('YYYY-MM-DD');
  request.start_date = req.body.startDate;
  request.start_time = req.body.startTime;
  request.end_date = req.body.endDate;
  request.end_time = req.body.endTime;
  request.target_name = req.body.targetName;
  request.cause = req.body.cause;
  request.traveler_num = req.body.travelerNum;
  request.responsible_name = req.body.responsibleName;
  request.created_at = moment().format('YYYY-MM-DD HH:mm:ss');

  if (request.start_date && request.end_date && request.target_name && request.cause) {
    CareRequest.save(db, request)
      .then(() => res.send({ ok: true }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ ok: false, msg: 'ข้อมูลไม่สมบูรณ์' });
  }
});

router.put('/', (req, res, next) => {
  let db = req.db;
  let request = {};
  
  let requestId = req.body.id;

  request.request_date = moment().format('YYYY-MM-DD');
  request.start_date = req.body.startDate;
  request.start_time = req.body.startTime;
  request.end_date = req.body.endDate;
  request.end_time = req.body.endTime;
  request.target_name = req.body.targetName;
  request.cause = req.body.cause;
  request.traveler_num = req.body.travelerNum;
  request.responsible_name = req.body.responsibleName;
  request.updated_at = moment().format('YYYY-MM-DD HH:mm:ss');

  if (request.start_date && request.end_date && request.target_name && request.cause) {
    CareRequest.update(db, requestId, request)
      .then(() => res.send({ ok: true }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ ok: false, msg: 'ข้อมูลไม่สมบูรณ์' });
  }
});

router.delete('/:id', (req, res, next) => {
 	let requestId = req.params.id;
    let db = req.db;
  
    if (requestId) {
      CareRequest.remove(db, requestId)
        .then(() => res.send({ ok: true }))
        .catch(err => res.send({ ok: false, msg: err }));
    } else {
      res.send({ ok: false, msg: 'Id not found!' });  
    }
});

module.exports = router;
