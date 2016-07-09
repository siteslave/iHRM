'use strict';

let express = require('express');
let router = express.Router();
let moment = require('moment');

let Meetings = require('../../models/meetings');

router.post('/save', (req, res, next) => {
  let meeting = {};
  meeting.book_no = req.body.book_no;
  meeting.book_date = req.body.book_date;
  meeting.title = req.body.title;
  meeting.owner = req.body.owner;
  meeting.place = req.body.place;
  meeting.start_date = req.body.start_date;
  meeting.end_date = req.body.end_date;
  meeting.type_meetings_id = req.body.type_meetings_id;
  meeting.created_at = moment().format('YYYY-MM-DD HH:mm:ss');

  if (!meeting.book_no || !meeting.book_date || !meeting.title || !meeting.owner || !meeting.start_date) {
    res.send({
      ok: false,
      msg: 'ข้อมูลไม่สมบูรณ์'
    })
  } else {
    Meetings.checkDuplicated(req.db, meeting.book_no)
      .then(rows => {
        if (rows[0].total) {
          res.send({
            ok: false,
            msg: 'รายการซำ้!'
          })
        } else {
          Meetings.save(req.db, meeting)
            .then(() => res.send({
              ok: true
            }))
            .catch(err => res.send({
              ok: false,
              msg: err
            }));
        }
      });

  }

});

router.put('/save', (req, res, next) => {
  let meeting = {};

  meeting.title = req.body.title;
  meeting.owner = req.body.owner;
  meeting.place = req.body.place;
  meeting.start_date = req.body.start_date;
  meeting.end_date = req.body.end_date;
  meeting.id = req.body.id;
  meeting.type_meetings_id = req.body.type_meetings_id;
  meeting.book_no = req.body.book_no;
  meeting.book_date = req.body.book_date;
  meeting.updated_at = moment().format('YYYY-MM-DD HH:mm:ss');

  // console.log(meeting);

  if (!meeting.book_no || !meeting.book_date || !meeting.title || !meeting.owner || !meeting.start_date) {
    res.send({
      ok: false,
      msg: 'ข้อมูลไม่สมบูรณ์'
    })
  } else {
    Meetings.checkDuplicatedUpdate(req.db, meeting.id, meeting.book_no)
      .then(rows => {
        if (rows[0].total) {
          res.send({
            ok: false,
            msg: 'รายการซำ้!'
          })
        } else {
          Meetings.updateAdmin(req.db, meeting)
            .then(() => res.send({
              ok: true
            }))
            .catch(err => res.send({
              ok: false,
              msg: err
            }));
        }
      });

  }


});

router.post('/total', (req, res, next) => {
  Meetings.totalAdmin(req.db)
    .then(rows => res.send({ ok: true, total: rows[0].total }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/list', (req, res, next) => {
  let limit = req.body.limit;
  let offset = req.body.offset;

  Meetings.listAdmin(req.db, limit, offset)
    .then(rows => res.send({ ok: true, rows: rows }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/assign', (req, res, next) => {

  let meetingId = req.body.id;
  let departments = req.body.departments;

  let data = [];

  departments.forEach(v => {
    console.log(v);
    let obj = {};
    obj.meeting_id = meetingId;
    obj.department_id = v;
    obj.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
    data.push(obj);
  });

  // console.log(data);

  Meetings.clearAssign(req.db, meetingId)
    .then(() => {
      // console.log(data);
      return Meetings.saveAssign(req.db, data);
    })
    .then(() => {
      res.send({ ok: true });
    })
    .catch(err => res.send({ ok: false, msg: err }));

});

router.post('/assign/department', (req, res, next) => {
  let id = req.body.id;

  Meetings.getAssign(req.db, id)
    .then(rows => {
      res.send({ok: true, rows: rows})
    })
    .catch(err => res.send({ ok: false, msg: err }));

});

// remove
router.delete('/delete/:id', (req, res, next) => {
  let id = req.params.id;

  if (id) {
    Meetings.remove(req.db, id)
      .then(() => res.send({ ok: true }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ok: false, msg: 'ID not found!'})
  }
})

router.post('/registered/list', (req, res, next) => {
  let db = req.db;
  let meetingId = req.body.meetingId;
  let meetings = {};

  if (meetingId) {
    Meetings.getEmployeeRegistered(db, meetingId)
      .then(rows => {
        res.send({ ok: true, rows: rows[0] })
      })
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ ok: false, msg: 'ไม่พบรหัสที่ต้องการ' });
  }
});

router.post('/registered/employee', (req, res, next) => {
  let db = req.db;
  let meetingId = req.body.meetingId;
  let employees = [];

  if (meetingId) {
    Meetings.getEmployeeRegisteredApproved(db, meetingId)
      .then(rows => {
        rows.forEach(v => {
          employees.push(v.employee_id);
        });

        res.send({ ok: true, rows: employees });
      })
      .catch(err => res.send({ ok: false, msg: err, code: 501 }));
  } else {
    res.send({ ok: false, msg: 'ไม่พบรหัสที่ต้องการ', code: 501 });
  }
});

router.put('/registered/approve', (req, res, next) => {
  let db = req.db;
  let employees = req.body.employees;
  let meetingId = req.body.meetingId;

  if (meetingId) {
    // clear approve status
    Meetings.clearApproveRegister(db, meetingId)
      .then(() => {
        return Meetings.approveRegister(req.db, meetingId, employees);
      })
      .then(() => {
        res.send({ ok: true });
      })
      .catch(err => res.send({ ok: false, msg: err, code: 501 }));
  } else {
    res.send({ ok: false, msg: 'ข้อมูลไม่สมบูรณ์', code: 501 });
  }

});

module.exports = router;
