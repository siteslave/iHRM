let express = require('express');
let router = express.Router();
let Meetings = require('../../models/meetings');

router.post('/save', (req, res, next) => {
  let meeting = {};

  meeting.employee_id = 1;
  meeting.meeting_title = req.body.title;
  meeting.meeting_owner = req.body.owner;
  meeting.meeting_place = req.body.place;
  meeting.start_date = req.body.start;
  meeting.end_date = req.body.end;
  meeting.score = req.body.score;
  meeting.money_id = req.body.money_id;
  meeting.price = req.body.price;

  Meetings.save(req.db, meeting)
    .then(() => res.send({ ok: true }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/total', (req, res, next) => {
  Meetings.total(req.db)
    .then(rows => res.send({ ok: true, total: rows[0].total }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/list', (req, res, next) => {
  let limit = req.body.limit;
  let offset = req.body.offset;

  Meetings.list(req.db, limit, offset)
    .then(rows => res.send({ ok: true, rows: rows }))
    .catch(err => res.send({ ok: false, msg: err }));
});

module.exports = router;
