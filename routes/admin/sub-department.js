'use strict';

let express = require('express');
let router = express.Router();

let SubDepartment = require('../../models/sub-department');

/**
 * METHOD: GET
 * URL: /admin/departments/list
 */
router.get('/list', (req, res, next) => {
  SubDepartment.list(req.db)
    .then(rows => res.send({ ok: true, rows: rows }),
    err => res.send({ ok: false, msg: err }))
});

router.get('/list/:id', (req, res, next) => {
  let id = req.params.id;

  SubDepartment.listByMain(req.db, id)
    .then(rows => res.send({ ok: true, rows: rows }),
    err => res.send({ ok: false, msg: err }))
});
/**
 * METHOD: POST
 * URL: /admin/department/save
 */
router.post('/save', (req, res, next) => {
  let name = req.body.name;
  let id = req.body.id;

  if (name && id) {
    SubDepartment.save(req.db, id, name)
      .then(() => res.send({ ok: true }),
      err => res.send({ ok: false, msg: err }))
  } else {
    res.send({ok: false, msg: 'Name variable not found!'})
  }
});
/**
 * METHOD: PUT
 * URL: /admin/department/save
 */
router.put('/save', (req, res, next) => {
  let name = req.body.name;
  let mainId = req.body.mainId;
  let subId = req.body.subId;

  if (name && mainId && subId) {
    SubDepartment.duplicated(req.db, subId, name)
      .then(total => {
        if (total) {
          res.send({ok: false, msg: 'Name duplicated!'})
        } else {
          SubDepartment.update(req.db, mainId, subId, name)
            .then(() => res.send({ ok: true }),
            err => res.send({ ok: false, msg: err }))
        }
      });
  } else {
    res.send({ok: false, msg: 'Name/ID variables not found!'})
  }
});

/**
 * METHOD: DELETE
 * URL: /admin/department/remove
 */
router.delete('/remove/:id', (req, res, next) => {
  let id = req.params.id;
  if (id) {
    Department.remove(req.db, id)
      .then(() => res.send({ ok: true }),
      err => res.send({ ok: false, msg: err }))
  } else {
    res.send({ok: false, msg: 'ID variable not found!'})
  }
});

module.exports = router;
