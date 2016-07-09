let express = require('express');
let router = express.Router();
let moment = require('moment');

let AskPermission = require('../../models/ask-permission');
let Employee = require('../../models/employee');

router.post('/list', (req, res, next) => {
  let db = req.db;
  let employeeId = req.session.userId;
  let limit = req.body.limit;
  let offset = req.body.offset;

  AskPermission.list(db, employeeId, limit, offset)
    .then(rows => res.send({ ok: true, rows: rows }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/employee-list-all', (req, res, next) => {
  let db = req.db;

  Employee.listAll(db)
    .then(rows => res.send({ ok: true, rows: rows }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/total', (req, res, next) => {
  let db = req.db;
  let employeeId = req.session.userId;

  AskPermission.total(db, employeeId)
    .then(rows => res.send({ ok: true, total: rows[0].total }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/', (req, res, next) => {
  let db = req.db;
  let ask = {};
  let askId = null;
  
  // console.log(req.body.ask);

  let employees = req.body.employees;
  
  ask.employee_id = req.session.userId;
  ask.ask_date = moment().format('YYYY-MM-DD');
  ask.start_date = req.body.startDate;
  ask.start_time = req.body.startTime;
  ask.end_date = req.body.endDate;
  ask.end_time = req.body.endTime;
  ask.target_name = req.body.targetName;
  ask.cause = req.body.cause;
  ask.distance = req.body.distance;
  ask.created_at = moment().format('YYYY-MM-DD HH:mm:ss');

  if (ask.start_date && ask.end_date && ask.target_name && ask.cause) {
    AskPermission.save(db, ask)
      .then((data) => {
        let askId = data[0];
        let _employees = [];
        employees.forEach(v => {
          let obj = {};
          obj.employee_id = v;
          obj.ask_permission_id = askId;
          _employees.push(obj);
        });
        return AskPermission.saveEmployee(db, _employees);
      })
      .then(() => res.send({ok: true}))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ ok: false, msg: 'ข้อมูลไม่สมบูรณ์' });
  }
});

router.put('/', (req, res, next) => {
  let db = req.db;
  let ask = {};
  let askId = req.body.id;
  let employees = req.body.employees;

  ask.ask_date = moment().format('YYYY-MM-DD');
  ask.start_date = req.body.startDate;
  ask.start_time = req.body.startTime;
  ask.end_date = req.body.endDate;
  ask.end_time = req.body.endTime;
  ask.target_name = req.body.targetName;
  ask.cause = req.body.cause;
  ask.distance = req.body.distance;
  ask.updated_at = moment().format('YYYY-MM-DD HH:mm:ss');

  if (ask.start_date && ask.end_date && ask.target_name && ask.cause) {

    // clear old employee 
    AskPermission.removeEmployee(db, askId)
      .then(() => {
        // update 
        return AskPermission.update(db, askId, ask);
      })
      .then(() => {
        let _employees = [];
        employees.forEach(v => {
          let obj = {};
          obj.employee_id = v;
          obj.ask_permission_id = askId;
          _employees.push(obj);
        });

        return AskPermission.saveEmployee(db, _employees);
      })
      .then(() => res.send({ ok: true }))
      .catch((err) => res.send({ ok: false, msg: err }));

    AskPermission.save(db, ask)
      .then(() => res.send({ ok: true }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ ok: false, msg: 'ข้อมูลไม่สมบูรณ์' });
  }
});

router.delete('/:id', (req, res, next) => {
 	let askId = req.params.id;
  let db = req.db;
  
  if (askId) {
    AskPermission.remove(db, askId)
      .then(() => {
        return AskPermission.removeEmployee(db, askId);
      })
      .then(() => res.send({ ok: true }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ ok: false, msg: 'Id not found!' });
  };
});

router.post('/get-employee-selected', (req, res, next) => {
  let db = req.db;
  let askId = req.body.askId;

  if (askId) {
    AskPermission.getEmployeeSelectedList(db, askId)
      .then(rows => res.send({ ok: true, rows: rows }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ ok: false, msg: 'Ask ID not found' });
  }
});

module.exports = router;
