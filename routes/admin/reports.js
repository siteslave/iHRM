'use strict';

let express = require('express');
let router = express.Router();

let meetings = require('../../models/meetings');

router.post('/meetings/list', (req, res, next) => {
  let db = req.db;
  let start = req.body.start;
  let end = req.body.end;

  if (start && end) {
    meetings.reportMeetingList(db, start, end)
      .then(rows => res.send({ ok: true, rows: rows }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ ok: false, msg: 'ข้อมูลไม่ครบ กรุณาตรวจสอบ' });
  }
});


router.post('/department/list', (req, res, next) => {
  let db = req.db;
  let start = req.body.start;
  let end = req.body.end;
  let departmentId = req.body.department;

  if (start && end && departmentId) {
    meetings.reportDepartmentList(db, departmentId, start, end)
      .then(rows => res.send({ ok: true, rows: rows[0] }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ ok: false, msg: 'ข้อมูลไม่ครบ กรุณาตรวจสอบ' });
  }
});


module.exports = router;
