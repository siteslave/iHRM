'use strict';

let express = require('express');
let router = express.Router();
let crypto = require('crypto');

let Employee = require('../../models/employee');

router.post('/total', (req, res, next) => {
  Employee.total(req.db)
    .then(rows => res.send({ ok: true, total: rows[0].total }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/list', (req, res, next) => {
  let limit = req.body.limit;
  let offset = req.body.offset;

  Employee.list(req.db, limit, offset)
    .then(rows => res.send({ ok: true, rows: rows }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/search', (req, res, next) => {
  let query = req.body.query;

  Employee.search(req.db, query)
    .then(rows => res.send({ ok: true, rows: rows }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/save', (req, res, next) => {

  let employee = {};

  employee.fullname = req.body.fullname;
  employee.position_id = req.body.position;
  employee.sub_department_id = req.body.department;
  employee.title_id = req.body.title;
  employee.position_id = req.body.position;
  employee.username = req.body.username;

  let password = req.body.password;

  employee.password = crypto.createHash('md5').update(password).digest('hex');

  if (employee.fullname && employee.position_id && employee.sub_department_id && employee.username && employee.password) {
    Employee.save(req.db, employee)
      .then(() => res.send({ ok: true }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ok: false, msg: 'Data incomplete!'})
  }

});

router.put('/save', (req, res, next) => {
  let employee = {};

  employee.fullname = req.body.fullname;
  employee.position_id = req.body.position;
  employee.sub_department_id = req.body.department;
  employee.title_id = req.body.title;
  employee.position_id = req.body.position;
  employee.id = req.body.id;

  if (employee.fullname && employee.id) {
    Employee.isDuplicated(req.db, employee.id, employee.fullname)
      .then(rows => {
        if (rows[0].total) {
          res.send({ ok: false, msg: 'Duplicated!' })
        } else {
          Employee.update(req.db, employee)
            .then(() => res.send({ ok: true }))
            .catch(err => res.send({ ok: false, msg: err }));
        }
      })
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ok: false, msg: 'Employee id not found!'})
  }
});

router.delete('/delete/:id', (req, res, next) => {
  let id = req.params.id;

  if (id) {
    Employee.remove(req.db, id)
      .then(() => res.send({ ok: true }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ok: false, msg: 'Employee id not found!'})
  }
});

router.put('/changepass', (req, res, next) => {
  let id = req.body.id;
  let password = req.body.password;

  let encryptPassword = crypto.createHash('md5').update(password).digest('hex');

  if (password && id) {
    Employee.changePassword(req.db, id, encryptPassword)
      .then(() => res.send({ ok: true }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ok: false, msg: 'Incorrect parameters!'})
  }
});


module.exports = router;
