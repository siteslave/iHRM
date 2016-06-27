'use strict';

let express = require('express');
let router = express.Router();
let crypto = require('crypto');
let moment = require('moment');

let Staff = require('../../models/staff');

router.post('/', (req, res, next) => {
  let db = req.db;
  let staff = {};

  // console.log(req.body);

  staff.first_name = req.body.firstName;
  staff.last_name = req.body.lastName;
  staff.title_id = req.body.titleId;
  staff.position_id = req.body.positionId;
  staff.department_id = req.body.departmentId;
  staff.username = req.body.username;
  staff.password = crypto.createHash('md5').update(req.body.password).digest('hex');
  staff.active_status = req.body.activeStatus;

  if (staff.first_name && staff.last_name && staff.username && staff.password) {
    Staff.isExist(db, staff.username)
      .then(rows => {
        if (rows[0].total) {
          res.send({ ok: false, msg: 'รายการซ้ำ กรุณาเปลี่ยนชื่อผู้ใช้งานใหม่', code: 501 });
        } else {
          Staff.save(db, staff)
            .then(() => res.send({ ok: true }))
            .catch(err => res.send({ ok: false, msg: err }));
        }
    })

  } else {
    res.send({ ok: false, msg: 'ข้อมูลไม่สมบูรณ์', code: 501 });
  }

});

router.put('/', (req, res, next) => {
  let db = req.db;
  let staff = {};

  // console.log(req.body);

  staff.first_name = req.body.firstName;
  staff.last_name = req.body.lastName;
  staff.title_id = req.body.titleId;
  staff.position_id = req.body.positionId;
  staff.department_id = req.body.departmentId;
  staff.active_status = req.body.activeStatus;

  let staffId = req.body.staffId;

  if (staff.first_name && staff.last_name) {
    Staff.update(db, staffId, staff)
      .then(() => res.send({ ok: true }))
      .catch(err => res.send({ ok: false, msg: err }));

  } else {
    res.send({ ok: false, msg: 'ข้อมูลไม่สมบูรณ์', code: 501 });
  }
});

router.delete('/', (req, res, next) => {

});

router.post('/search', (req, res, next) => {
  let query = req.body.query;
  let db = req.db;

  Staff.search(db, query)
    .then(rows => res.send({ ok: true, rows: rows }),
    err => res.send({ ok: false, msg: err }))
});

router.post('/list', (req, res, next) => {
  Staff.list(req.db)
    .then(rows => res.send({ ok: true, rows: rows }),
    err => res.send({ ok: false, msg: err }))
});

router.post('/total', (req, res, next) => {
  Staff.total(req.db)
    .then(rows => res.send({ ok: true, total: rows[0].total }),
    err => res.send({ ok: false, msg: err }))
});

router.get('/detail/:id', (req, res, next) => {
  let db = req.db;
  let staffId = req.params.id;
  if (staffId) {
    Staff.getStaffDetail(db, staffId)
      .then(rows => res.send({ ok: true, rows: rows[0] }))
      .catch(err => res.send({ ok: false, msg: err, code: 501 }));
  } else {
    res.send({ok: false, msg: 'ไม่พบรหัสที่ต้องการแก้ไข'})
  }
});

router.post('/changepass', (req, res, next) => {
  let db = req.db;
  let password = req.body.password;
  let staffId = req.body.staffId;

  if (staffId && password) {
    let newPass = crypto.createHash('md5').update(password).digest('hex');
    Staff.changePassword(db, staffId, newPass)
      .then(() => res.send({ ok: true }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ ok: false, msg: 'ข้อมูลไม่สมบูรณ์' });
  }
});

router.delete('/:id', (req, res, next) => {
  let db = req.db;
  let staffId = req.params.id;

  if (staffId) {
    Staff.remove(db, staffId)
      .then(() => res.send({ ok: true }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ ok: false, msg: 'ข้อมูลไม่สมบูรณ์' });
  }
});

module.exports = router;