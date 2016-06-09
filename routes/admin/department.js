'use strict';

let express = require('express');
let router = express.Router();

let Department = require('../../models/department');

/**
 * METHOD: GET
 * URL: /admin/departments/list
 */
router.get('/list', (req, res, next) => {
  Department.list(req.db)
    .then(rows => res.send({ ok: true, rows: rows }),
    err => res.send({ ok: false, msg: err }))
});
/**
 * METHOD: POST
 * URL: /admin/department/save
 */
router.post('/save', (req, res, next) => {
  let name = req.body.name;
  if (name) {
    Department.save(req.db, name)
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
  let id = req.body.id;

  if (name && id) {
    Department.duplicated(req.db, id, name)
      .then(total => {
        if (total) {
          res.send({ok: false, msg: 'Name duplicated!'})
        } else {
          Department.update(req.db, id, name)
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
