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
let Utils = require('../../helpers/utils');

router.post('/changepass', (req, res, next) => {
  let password = req.body.password;
  let id = req.session.userId;

  let _encryptPassword = crypto.createHash('md5').update(password).digest('hex');

  Employee.changePassword(req.db, id, _encryptPassword)
    .then(() => res.send({ ok: true }))
      .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/register', (req, res, next) => {
  let register = {};
  register.meeting_id = req.body.id;
  register.money_id = req.body.money_id;
  register.transport_id = req.body.transport_id;
  register.price = req.body.price;
  register.employee_id = req.session.userId;
  register.register_date = moment().format('YYYY-MM-DD');
  register.approve_status = 'N';
  register.score = req.body.score;

  // console.log(register);

  //check duplicated
  Meetings.isRegisterDuplicated(req.db, register.meeting_id, register.employee_id)
    .then(rows => {
      if (rows[0].total) {
        res.send({ok: false, msg: 'รายการนี้คุณได้ทำการลงทะเบียนไว้แล้ว'})
      } else {
        Meetings.doRegister(req.db, register)
          .then(() => res.send({ ok: true }))
          .catch(err => res.send({ ok: false, msg: err }));
      }
    })
    .catch(err => res.send({ ok: false, msg: err }));
});

router.put('/register', (req, res, next) => {
  let register = {};
  register.meeting_id = req.body.id;
  register.money_id = req.body.money_id;
  register.transport_id = req.body.transport_id;
  register.price = req.body.price;
  register.employee_id = req.session.userId;
  register.updated_at = moment().format('YYYY-MM-DD HH:mm:ss');
  register.approve_status = 'N';

  console.log(register);

  if (register.meeting_id && register.employee_id && register.transport_id) {
    Meetings.updateRegister(req.db, register)
      .then(() => res.send({ ok: true }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ ok: false, msg: 'ข้อมูลไม่สมบูรณ์' });
  }

});

router.post('/assign/total', (req, res, next) => {
  let department_id = req.session.department_id;
  let employeeId = req.session.userId;
  let meetingIds = [];

  Meetings.getRegisteredMeetings(req.db, employeeId)
    .then(rows => {
      rows.forEach(v => {
        meetingIds.push(v.id)
      })
      return Meetings.getAssignTotal(req.db, meetingIds, department_id)
  })
  
    .then(rows => {
      res.send({ ok: true, total: rows[0].total });
    })
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/assign/list', (req, res, next) => {
  let limit = req.body.limit;
  let offset = req.body.offset;
  let department_id = req.session.department_id;
  let employeeId = req.session.userId;
  // console.log(department_id)
  let meetingIds = [];

  Meetings.getRegisteredMeetings(req.db, employeeId)
    .then(rows => {
      // console.log(rows)
      rows.forEach(v => {
        meetingIds.push(v.id)
      })
      return Meetings.getAssignList(req.db, meetingIds, department_id, limit, offset)
    })
    .then(rows => res.send({ ok: true, rows: rows }))
    .catch(err => {
      console.log(err);
      res.send({ ok: false, msg: err })
    });
});

router.post('/register/total', (req, res, next) => {
  let employeeId = req.session.userId;
  Meetings.getRegisteredTotal(req.db, employeeId)
    .then(rows => {
      // console.log(rows[0]);
      res.send({ ok: true, total: rows[0].total });
    })
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/register/list', (req, res, next) => {
  let limit = req.body.limit;
  let offset = req.body.offset;
  let employeeId = req.session.userId;

  Meetings.getRegisteredList(req.db, employeeId, limit, offset)
    .then(rows => res.send({ ok: true, rows: rows }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.delete('/register/cancel/:meetingId', (req, res, next) => {
  let employeeId = req.session.userId;
  let meetingId = req.params.meetingId;
  if (employeeId && meetingId) {
    Meetings.doUnRegister(req.db, meetingId, employeeId)
      .then(() => res.send({ ok: true }))
      .catch((err) => res.send({ ok: false, msg: err }));
  } else {
    res.send({ok: false, msg: 'ข้อมูลไม่สมบูรณ์'})
  }
});


// router.post('/total', (req, res, next) => {
//   let employee_id = req.session.userId;
//   Meetings.total(req.db, employee_id)
//     .then(rows => res.send({ ok: true, total: rows[0].total }))
//     .catch(err => res.send({ ok: false, msg: err }));
// });

// router.post('/list', (req, res, next) => {
//   let limit = req.body.limit;
//   let offset = req.body.offset;
//   let employee_id = req.session.userId;

//   Meetings.list(req.db, employee_id, limit, offset)
//     .then(rows => res.send({ ok: true, rows: rows }))
//     .catch(err => res.send({ ok: false, msg: err }));
// });
/***********************************************************
 * Report
 ***********************************************************/
router.post('/reports/total', (req, res, next) => {
  let employee_id = req.session.userId;
  let startDate = req.body.start;
  let endDate = req.body.end;

  Meetings.userReportTotal(req.db, employee_id, startDate, endDate)
    .then(rows => res.send({ ok: true, total: rows[0].total }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/reports/list', (req, res, next) => {
  let limit = req.body.limit;
  let offset = req.body.offset;
  let employee_id = req.session.userId;
  let startDate = req.body.start;
  let endDate = req.body.end;

  Meetings.userReportList(req.db, employee_id, startDate, endDate, limit, offset)
    .then(rows => res.send({ ok: true, rows: rows }))
    .catch(err => res.send({ ok: false, msg: err }));
});
/*********************************************************/
router.post('/search', (req, res, next) => {
  let query = req.body.query;
  let employee_id = req.session.userId;

  Meetings.userSearch(req.db, employee_id, query)
    .then(rows => res.send({ ok: true, rows: rows }))
    .catch(err => res.send({ ok: false, msg: err }));
});

// router.delete('/delete/:id', (req, res, next) => {
//   let id = req.params.id;

//   Meetings.remove(req.db, id)
//     .then(rows => res.send({ ok: true }))
//     .catch(err => res.send({ ok: false, msg: err }));
// });

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

router.get('/print/history/:start/:end', (req, res, next) => {
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
        obj.title = v.title;
        obj.owner = v.owner;
        obj.place = v.place;
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

router.get('/print/register/:id', (req, res, next) => {
  let json = {};
  let meetingId = req.params.id;
  let employeeId = req.session.userId;

  // json.startDate = moment(req.params.start).format('DD/MM') + '/' + (moment(req.params.start).get('year')+543);
  // json.endDate = moment(req.params.end).format('DD/MM') + '/' + (moment(req.params.end).get('year') + 543);
  // json.fullname = req.session.fullname;
  // json.departmentName = req.session.department_name;
  // json.subDepartmentName =  req.session.sub_department_name

  Meetings.getMeetingRegisteredDetail(req.db, meetingId, employeeId)
    .then(rows => {
      console.log(rows[0][0])
      json.meetings = rows[0][0];
      let mStartDate = Utils.getMonthName(moment(json.meetings.start_date).format('MM'));
      let mEndDate = Utils.getMonthName(moment(json.meetings.end_date).format('MM'));
      let mBookDate = Utils.getMonthName(moment(json.meetings.book_date).format('MM'));
      let mCurrentDate = Utils.getMonthName(moment().format('MM'));

      json.meetings.book_date = `${moment(json.meetings.book_date).get('date')} ${mBookDate} ${moment(json.meetings.book_date).get('year') + 543}`;
      json.meetings.startDate = `${moment(json.meetings.start_date).get('date')} ${mStartDate} ${moment(json.meetings.start_date).get('year') + 543}`;
      json.meetings.endDate = `${moment(json.meetings.end_date).get('date')} ${mEndDate} ${moment(json.meetings.end_date).get('year') + 543}`;
      json.meetings.currentDate = `${moment().get('date')} ${mCurrentDate} ${moment().get('year') + 543}`;
      // console.log(json);

      fse.ensureDirSync('./templates/html');
      fse.ensureDirSync('./templates/pdf');

      var destPath = './templates/html/register/' + moment().format('x');
      fse.ensureDirSync(destPath);

      gulp.task('html', (cb) => {
        return gulp.src('./templates/meeting-register.jade')
          .pipe(data(function () {
            return json;
          }))
          .pipe(jade())
          .pipe(gulp.dest(destPath));
      });

      gulp.task('pdf', ['html'], function () {
        var html = fs.readFileSync(destPath + '/meeting-register.html', 'utf8')
        var options = {
          format: 'A4',
          // orientation: "landscape",
          footer: {
            height: "15mm",
            contents: '<span style="color: #444;"><small>Printed: ' + new Date() + '</small></span>'
          }
        };

        var pdfName = `./templates/pdf/register-${moment().format('x')}.pdf`;

        pdf.create(html, options).toFile(pdfName, function (err, resp) {
          if (err) {
            res.send({ ok: false, msg: err });
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
    .catch(err => {
      res.send({ ok: false, msg: err });
    });

});



module.exports = router;
