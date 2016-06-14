"use strict";

let crypto = require('crypto');
let gulp = require('gulp');
let data = require('gulp-data');
let jade = require('gulp-jade');
let rimraf = require('rimraf');
let fse = require('fs-extra');
let fs = require('fs');
let path = require('path');
let moment = require('moment');
let pdf = require('html-pdf');
var numeral = require('numeral');

let express = require('express');
let router = express.Router();
let Employee = require('../../models/employee');
let Meetings = require('../../models/meetings');

router.post('/changepass', (req, res, next) => {
  let password = req.body.password;
  let id = req.session.userId;

  let _encryptPassword = crypto.createHash('md5').update(password).digest('hex');

  Employee.changePassword(req.db, id, _encryptPassword)
    .then(() => res.send({ ok: true }))
      .catch(err => res.send({ ok: false, msg: err }));  
});

router.post('/save', (req, res, next) => {
  let meeting = {};

  meeting.employee_id = req.session.userId;
  meeting.meeting_title = req.body.title;
  meeting.meeting_owner = req.body.owner;
  meeting.meeting_place = req.body.place;
  meeting.start_date = req.body.start;
  meeting.end_date = req.body.end;
  meeting.score = req.body.score;
  meeting.money_id = req.body.money_id;
  meeting.price = req.body.price;
  meeting.type_meetings_id = req.body.type_meetings_id;

  Meetings.save(req.db, meeting)
    .then(() => res.send({ ok: true }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.put('/save', (req, res, next) => {
  let meeting = {};

  console.log(req.body);
  
  meeting.meeting_title = req.body.title;
  meeting.meeting_owner = req.body.owner;
  meeting.meeting_place = req.body.place;
  meeting.start_date = req.body.start;
  meeting.end_date = req.body.end;
  meeting.score = req.body.score;
  meeting.money_id = req.body.money_id;
  meeting.price = req.body.price;
  meeting.id = req.body.id;
  meeting.type_meetings_id = req.body.type_meetings_id;
  
  Meetings.update(req.db, meeting)
    .then(() => res.send({ ok: true }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/total', (req, res, next) => {
  let employee_id = req.session.userId;
  Meetings.total(req.db, employee_id)
    .then(rows => res.send({ ok: true, total: rows[0].total }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/list', (req, res, next) => {
  let limit = req.body.limit;
  let offset = req.body.offset;
  let employee_id = req.session.userId;

  Meetings.list(req.db, employee_id, limit, offset)
    .then(rows => res.send({ ok: true, rows: rows }))
    .catch(err => res.send({ ok: false, msg: err }));
});
/***********************************************************
 * Report
 ***********************************************************/
router.post('/reports/total', (req, res, next) => {
  let employee_id = req.session.userId;
  let startDate = req.body.start;
  let endDate = req.body.end;
  
  Meetings.reportTotal(req.db, employee_id, startDate, endDate)
    .then(rows => res.send({ ok: true, total: rows[0].total }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/reports/list', (req, res, next) => {
  let limit = req.body.limit;
  let offset = req.body.offset;
  let employee_id = req.session.userId;
  let startDate = req.body.start;
  let endDate = req.body.end;

  Meetings.reportList(req.db, employee_id, startDate, endDate, limit, offset)
    .then(rows => res.send({ ok: true, rows: rows }))
    .catch(err => res.send({ ok: false, msg: err }));
});
/*********************************************************/
router.post('/search', (req, res, next) => {
  let query = req.body.query;
  let employee_id = req.session.userId;

  Meetings.search(req.db, employee_id, query)
    .then(rows => res.send({ ok: true, rows: rows }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.delete('/delete/:id', (req, res, next) => {
  let id = req.params.id;

  Meetings.remove(req.db, id)
    .then(rows => res.send({ ok: true }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/info', (req, res, next) => {

  let employee_id = req.session.userId;
  
  Employee.getInfo(req.db, employee_id)
    .then(rows => {
      console.log(rows);
      res.send({ok: true, info: rows[0]})
    })
    .catch(err => {
      console.log(err);
      res.send({ok: false, msg: err})
    });
  
});

router.get('/pdf/:start/:end', (req, res, next) => {
  let json = {};
  json.startDate = moment(req.params.start).format('DD/MM') + '/' + (moment(req.params.start).get('year')+543);
  json.endDate = moment(req.params.end).format('DD/MM') + '/' + (moment(req.params.end).get('year') + 543);
  json.fullname = req.session.fullname;
  json.departmentName = req.session.department_name;
  json.subDepartmentName =  req.session.sub_department_name
  fse.ensureDirSync('./templates/html');
  fse.ensureDirSync('./templates/pdf');

  var destPath = './templates/html/' + moment().format('x');
  fse.ensureDirSync(destPath);

  Meetings.getExportData(req.db, req.session.userId, req.params.start, req.params.end)
    .then(rows => {
      //json.data = rows;
      console.log(rows);
      let meetings = [];

      rows.forEach(v => {
        let obj = {};
        obj.meeting_title = v.meeting_title;
        obj.meeting_owner = v.meeting_owner;
        obj.meeting_place = v.meeting_place;
        obj.start_date = moment(v.start_date).format('DD/MM') + '/' + (moment(v.start_date).get('year')+543);
        obj.end_date = moment(v.end_date).format('DD/MM') + '/' + (moment(v.end_date).get('year')+543);
        obj.score = numeral(v.score).format('0,0.00');
        obj.price = numeral(v.price).format('0,0.00');
        obj.type_meetings_name = v.type_meetings_name;
        obj.money_name = v.money_name;
        meetings.push(obj);
      }); 

      json.meetings = meetings;
          // Create pdf
      gulp.task('html', (cb) => {
        return gulp.src('./templates/user-report.jade')
          .pipe(data(function () {
            return json;
          }))
          .pipe(jade())
          .pipe(gulp.dest(destPath));
      });

    gulp.task('pdf', ['html'], function () {
      var html = fs.readFileSync(destPath + '/user-report.html', 'utf8')
      var options = {
        format: 'A4',
        orientation: "landscape",
        footer: {
          height: "15mm",
          contents: '<span style="color: #444;"><small>Printed: '+ new Date() +'</small></span>'
        }
      };

      var pdfName = `./templates/pdf/user-report-${moment().format('x')}.pdf`;

      pdf.create(html, options).toFile(pdfName, function(err, resp) {
        if (err) {
          res.send({ok: false, msg: err});
        } else {
          res.download(pdfName, function () {
            rimraf.sync(destPath);
            fse.removeSync(pdfName);
          });
        }
      });
    });
    // Convert html to pdf
    gulp.start('pdf');
    
    })
    .catch(err => res.send({ ok: false, msg: err }));
});

module.exports = router;
