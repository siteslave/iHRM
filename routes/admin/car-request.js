'use strict';

let express = require('express');
let router = express.Router();
let moment = require('moment');

let CareRequest = require('../../models/car-request');

router.post('/list', (req, res, next) => {
  let db = req.db;
  let limit = req.body.limit;
  let offset = req.body.offset;
  let approveStatus = req.body.approveStatus ? req.body.approveStatus : 'N';
  let startDate = req.body.startDate ? req.body.startDate : moment().startOf('month').format('YYYY-MM-DD');
  let endDate = req.body.endDate ? req.body.endDate : moment().endOf('month').format('YYYY-MM-DD');

  CareRequest.adminList(db, approveStatus, startDate, endDate, limit, offset)
    .then(rows => res.send({ ok: true, rows: rows }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/total', (req, res, next) => {
  let db = req.db;
  let approveStatus = req.body.approveStatus ? req.body.approveStatus : 'N';
  let startDate = req.body.startDate ? req.body.startDate : moment().startOf('month').format('YYYY-MM-DD');
  let endDate = req.body.endDate ? req.body.endDate : moment().endOf('month').format('YYYY-MM-DD');

  CareRequest.adminTotal(db, approveStatus, startDate, endDate)
    .then(rows => res.send({ ok: true, total: rows[0].total }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.put('/approve', (req, res, next) => {
  let db = req.db;
  let requestId = req.body.requestId;
  let driverId = req.body.driverId;
  let carLicense = req.body.carLicense;

  if (requestId && driverId && carLicense) {
    let approve = {};
    approve.approve_status = 'Y';
    approve.approved_at = moment().format('YYYY-MM-DD HH:mm:ss');
    approve.car_license_id = carLicense;
    approve.driver_id = driverId;

    CareRequest.adminApprove(db, requestId, approve)
      .then(() => res.send({ ok: true }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ ok: false, msg: 'ข้อมูลไม่ครบถ้วน กรุณาตรวจสอบ' });
  }
});

router.delete('/approve/:id', (req, res, next) => {
  let db = req.db;
  let requestId = req.params.id;

  if (requestId) {
    CareRequest.adminCancelApprove(db, requestId)
      .then(() => res.send({ ok: true }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ ok: false, msg: 'Id not found' });
  }
});

router.delete('/:id', (req, res, next) => {
  let db = req.db;
  let requestId = req.params.id;

  if (requestId) {
    CareRequest.remove(db, requestId)
      .then(() => res.send({ ok: true }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ ok: false, msg: 'Id not found' });
  }
});



module.exports = router;