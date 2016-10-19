'use strict';

let express = require('express');
let router = express.Router();

let Position = require('../../models/position');

/**
 * METHOD: GET
 * URL: /admin/position/list
 */
router.get('/list', (req, res, next) => {
  Position.list(req.db)
    .then(rows => res.send({ ok: true, rows: rows }),
    err => res.send({ ok: false, msg: err }))
});
/**
 * METHOD: POST
 * URL: /admin/position/save
 */
router.post('/save', (req, res, next) => {
  let name = req.body.name;
  if (name) {
    Position.save(req.db, name)
      .then(() => res.send({ ok: true }),
      err => res.send({ ok: false, msg: err }))
  } else {
    res.send({ok: false, msg: 'Name variable not found!'})
  }
});
/**
 * METHOD: PUT
 * URL: /admin/position/save
 */
router.put('/save', (req, res, next) => {
  let name = req.body.name;
  let id = req.body.id;

  if (name && id) {
    Position.duplicated(req.db, id, name)
      .then(total => {
        if (total) {
          res.send({ok: false, msg: 'Name duplicated!'})
        } else {
          Position.update(req.db, id, name)
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
 * URL: /admin/position/remove
 */
router.delete('/remove/:id', (req, res, next) => {
  let id = req.params.id;
  if (id) {
    Position.remove(req.db, id)
      .then(() => res.send({ ok: true }),
      err => res.send({ ok: false, msg: err }))
  } else {
    res.send({ok: false, msg: 'ID variable not found!'})
  }
});

module.exports = router;
