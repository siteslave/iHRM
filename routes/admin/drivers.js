'use strict';

let express = require('express');
let router = express.Router();

let Drivers = require('../../models/drivers');

router.post('/list', (req, res, next) => {
  let db = req.db;

  Drivers.list(db)
    .then(rows => res.send({ ok: true, rows: rows }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/', (req, res, next) => {
  let db = req.db;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let titleId = req.body.titleId;
  let isActive = req.body.active ? 'Y' : 'N';
  let driver = {};

  if (firstName && lastName) {
    driver.title_id = titleId;
    driver.first_name = firstName;
    driver.last_name = lastName;
    driver.is_active = isActive;

    Drivers.save(db, driver)
      .then(() => res.send({ ok: true }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ ok: false, msg: 'ข้อมูลไม่ครบถ้วน กรุณาตรวจสอบ' });
  }
});

router.put('/', (req, res, next) => {
  let db = req.db;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let titleId = req.body.titleId;
  let isActive = req.body.active ? 'Y' : 'N';
  let driverId = req.body.id;

  let driver = {};

  if (driverId && firstName && lastName) {
    driver.title_id = titleId;
    driver.first_name = firstName;
    driver.last_name = lastName;
    driver.is_active = isActive;

    Drivers.update(db, driverId, driver)
      .then(() => res.send({ ok: true }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ ok: false, msg: 'ข้อมูลไม่ครบถ้วน กรุณาตรวจสอบ' });
  }
});

router.delete('/:id', (req, res, next) => {
  let db = req.db;
  let id = req.params.id;

  if (id) {
    Drivers.remove(db, id)
      .then(() => res.send({ ok: true }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ ok: false, msg: 'Id not found' });
  }
});


module.exports = router;
