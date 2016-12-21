'use strict';

let express = require('express');
let router = express.Router();

let moment = require('moment');
let gulp = require('gulp');
let gulpData = require('gulp-data');
let jade = require('gulp-jade');
let rimraf = require('rimraf');
let fse = require('fs-extra');
let fs = require('fs');
let path = require('path');
let pdf = require('html-pdf');
let numeral = require('numeral');

let Utils = require('../../helpers/utils');

let Meetings = require('../../models/meetings');
let Reports = require('../../models/reports');
let Departments = require('../../models/department');
let Employees = require('../../models/employee');

router.post('/meetings/list', (req, res, next) => {
  let db = req.db;
  let start = req.body.start;
  let end = req.body.end;

  if (start && end) {
    Meetings.reportMeetingList(db, start, end)
      .then(rows => res.send({ ok: true, rows: rows }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ ok: false, msg: 'ข้อมูลไม่ครบ กรุณาตรวจสอบ' });
  }
});

router.post('/meetings/not-meeting-list', (req, res, next) => {
  let db = req.db;
  let start = req.body.start;
  let end = req.body.end;
  let departmentId = req.body.departmentId;
  let positions = req.body.positions;

  // console.log(req.body);  
  if (start && end) {
    Reports.getEmployeeNotMeetings(db, departmentId, start, end, positions)
      .then(rows => res.send({ ok: true, rows: rows }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ ok: false, msg: 'ข้อมูลไม่ครบ กรุณาตรวจสอบ' });
  }
});

router.post('/department/list', (req, res, next) => {
  let db = req.db;
  let start = req.body.start;
  let end = req.body.end;
  let departmentId = req.body.department;

  if (start && end && departmentId) {
    Meetings.reportDepartmentList(db, departmentId, start, end)
      .then(rows => res.send({ ok: true, rows: rows[0] }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ ok: false, msg: 'ข้อมูลไม่ครบ กรุณาตรวจสอบ' });
  }
});

router.post('/employee-position/list', (req, res, next) => {
  let db = req.db;
  let departmentId = req.body.departmentId;

  if (departmentId) {
    Employees.getEmployeePositionList(db, departmentId)
      .then(rows => res.send({ ok: true, rows: rows[0] }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ ok: false, msg: 'ข้อมูลไม่ครบ กรุณาตรวจสอบ' });
  }
});

// print

router.get('/print/by-meeting/:meetingId', (req, res, next) => { 
  let meetingId = req.params.meetingId;
  let db = req.db;
  let json = {};
  json.meeting = {};
  json.employees = [];

  if (meetingId) {
    fse.ensureDirSync('./templates/html');
    fse.ensureDirSync('./templates/pdf');

    var destPath = './templates/html/' + moment().format('x');
    fse.ensureDirSync(destPath);
    Meetings.getMeetingInfo(db, meetingId)
      .then(rows => {
        let _data = rows[0];
        json.meeting.title = _data.title;
        json.meeting.owner = _data.owner;
        json.meeting.place = _data.place;
        // json.meeting.score = _data.score;
        json.meeting.typeMeetingsName = _data.type_meetings_name;
        json.meeting.startDate = `${moment(_data.start_date).format('D')} ${Utils.getMonthName(moment(_data.start_date).format('MM'))} ${moment(_data.start_date).get('year') + 543}`;
        json.meeting.endDate = `${moment(_data.end_date).format('D')} ${Utils.getMonthName(moment(_data.end_date).format('MM'))} ${moment(_data.end_date).get('year') + 543}`;
        console.log(json);
        return Reports.reportByMeeting(db, meetingId);
      })
      .then(rows => {
        json.employees = rows[0];
        console.log(json);
        // Create pdf
        gulp.task('html', (cb) => {
          return gulp.src('./templates/report-by-meeting.jade')
            .pipe(gulpData(function () {
              return json;
            }))
            .pipe(jade())
            .pipe(gulp.dest(destPath));
        });

        gulp.task('pdf', ['html'], function () {
          var html = fs.readFileSync(destPath + '/report-by-meeting.html', 'utf8')
          var options = {
            format: 'A4',
            orientation: "landscape",
            footer: {
              height: "15mm",
              contents: '<span style="color: #444;"><small>Printed: ' + new Date() + '</small></span>'
            }
          };

          var pdfName = `./templates/pdf/report-by-meeting-${moment().format('x')}.pdf`;

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
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ok: false, msg: 'Meeting id not found!'})
  }
});

router.get('/print/not-meetings/:departmentId/:start/:end/:positions', (req, res, next) => { 
  let departmentId = req.params.departmentId;
  let start = req.params.start;
  let end = req.params.end;
  // let positions = JSON.parse(req.parmas.positions);
  let positions = req.params.positions
  let _p = positions.split(',');
  let _positions = _p;
  // console.log(req.params);

  let db = req.db;
  let json = {};
  // json.departmentName = null;
  json.startDate = `${moment(start).format('D')} ${moment(start).locale('th').format('MMMM')} ${moment(start).get('year') + 543}`;
  json.endDate = `${moment(end).format('D')} ${moment(end).locale('th').format('MMMM')} ${moment(end).get('year') + 543}`;
  // json.employees = [];

  if (departmentId && start && end) {
    fse.ensureDirSync('./templates/html');
    fse.ensureDirSync('./templates/pdf');

    var destPath = './templates/html/' + moment().format('x');
    fse.ensureDirSync(destPath);
    // get department detail
    Departments.getInfo(db, departmentId)
      .then(rows => {
        let data = rows[0];
        json.departmentName = data.name;
        // get employees list
        return Reports.getEmployeeNotMeetings(db, departmentId, start, end, _positions);
      })
      .then(rows => {
        json.employees = rows;
        // Create pdf
        gulp.task('html', (cb) => {
          return gulp.src('./templates/not-meeting.jade')
            .pipe(gulpData(function () {
              return json;
            }))
            .pipe(jade())
            .pipe(gulp.dest(destPath));
        });

        gulp.task('pdf', ['html'], function () {
          var html = fs.readFileSync(destPath + '/not-meeting.html', 'utf8')
          var options = {
            format: 'A4',
            // orientation: "landscape",
            footer: {
              height: "15mm",
              contents: '<span style="color: #444;"><small>Printed: ' + new Date() + '</small></span>'
            }
          };

          var pdfName = `./templates/pdf/not-meeting-${moment().format('x')}.pdf`;

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
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ok: false, msg: 'Meeting id not found!'})
  }
});

router.get('/print/by-department/:departmentId/:start/:end', (req, res, next) => { 
  let departmentId = req.params.departmentId;
  let start = req.params.start;
  let end = req.params.end;

  let db = req.db;
  let json = {};
  json.department = {};
  json.employees = [];

  if (departmentId && start && end) {
    fse.ensureDirSync('./templates/html');
    fse.ensureDirSync('./templates/pdf');

    var destPath = './templates/html/' + moment().format('x');
    fse.ensureDirSync(destPath);

    // get department info
    Departments.getInfo(db, departmentId)
      .then(rows => {
        json.department.name = rows[0].name;
        json.department.startDate = `${moment(start, 'YYYY-MM-DD').format('D')} ${Utils.getMonthName(moment(start, 'YYYY-MM-DD').format('MM'))} ${moment(start, 'YYYY-MM-DD').get('year') + 543}`;
        json.department.endDate = `${moment(end, 'YYYY-MM-DD').format('D')} ${Utils.getMonthName(moment(end, 'YYYY-MM-DD').format('MM'))} ${moment(end, 'YYYY-MM-DD').get('year') + 543}`;
        console.log(json);
        return Reports.reportByDepartment(db, departmentId, start, end);
      })
      // Reports.reportByDepartment(db, departmentId, start, end)
      .then(rows => {
        console.log(rows[0]);
        rows[0].forEach(v => {
          let obj = {};
          obj.employeeName = v.employee_name;
          obj.positionName = v.position_name;
          obj.title = v.title;
          obj.owner = v.owner;
          obj.place = v.place;
          obj.price = numeral(v.price).format('0,0.00');
          obj.score = v.score;
          obj.moneyName = v.money_name;
          obj.departmentName = v.department_name;
          obj.typeMeetingsName = v.type_meetings_name;
          obj.startDate = `${moment(v.start_date).format('D')} ${Utils.getMonthName(moment(v.start_date).format('MM'))} ${moment(v.start_date).get('year') + 543}`;
          obj.endDate = `${moment(v.end_date).format('D')} ${Utils.getMonthName(moment(v.end_date).format('MM'))} ${moment(v.end_date).get('year') + 543}`;

          json.employees.push(obj);
        });
        
        // console.log(json);
        // Create pdf
        gulp.task('html', (cb) => {
          return gulp.src('./templates/report-by-department.jade')
            .pipe(gulpData(function () {
              return json;
            }))
            .pipe(jade())
            .pipe(gulp.dest(destPath));
        });

        gulp.task('pdf', ['html'], function () {
          var html = fs.readFileSync(destPath + '/report-by-department.html', 'utf8')
          var options = {
            format: 'A4',
            orientation: "landscape",
            footer: {
              height: "15mm",
              contents: '<span style="color: #444;"><small>Printed: ' + new Date() + '</small></span>'
            }
          };

          var pdfName = `./templates/pdf/report-by-department-${moment().format('x')}.pdf`;

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
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ok: false, msg: 'ข้อมูลไม่สมบูรณ์!'})
  }
});

module.exports = router;
