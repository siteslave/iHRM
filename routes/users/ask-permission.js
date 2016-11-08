'use strict';

let express = require('express');
let router = express.Router();
let moment = require('moment');

let gulp = require('gulp');
let data = require('gulp-data');
let jade = require('gulp-jade');
let rimraf = require('rimraf');
let fse = require('fs-extra');
let fs = require('fs');
let path = require('path');
let pdf = require('html-pdf');
let numeral = require('numeral');

let Utils = require('../../helpers/utils');

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
  ask.is_car_request = req.body.isCarRequest;
  ask.responsible_name = req.body.isCarRequest == 'Y' ? req.body.responsibleName : '';

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
  ask.is_car_request = req.body.isCarRequest;
  ask.responsible_name = req.body.isCarRequest == 'Y' ? req.body.responsibleName : '';
  
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


router.get('/print/:id', (req, res, next) => {

  let json = {};
  let id = req.params.id;
  let db = req.db;

  if (id) {
    fse.ensureDirSync('./templates/html');
    fse.ensureDirSync('./templates/pdf');

    var destPath = './templates/html/' + moment().format('x');
    fse.ensureDirSync(destPath);
    AskPermission.getPrintEmployeeList(db, id)
      .then(rows => {
        json.employees = rows[0];
        return AskPermission.getDriversList(db);
      })
      .then(rows => {
        json.drivers = rows[0];
        return AskPermission.getPrintInfo(db, id);
      })
      .then(rows => {
        //json.data = rows;
        // console.log(rows);
        let _data = rows[0][0];
        // console.log(_data);
        let ask = {};

        let _isCarRequest = _data.is_car_request;

        ask.currentDate = `${moment().format('D')} ${Utils.getMonthName(moment().format('MM'))} ${moment().get('year') + 543}`;
        ask.fullname = _data.fullname;
        ask.positionName = _data.position_name;
        ask.targetName = _data.target_name;
        ask.cause = _data.cause;
        ask.totalDay = _data.total_day;
        ask.distance = _data.distance;
        ask.responsibleName = _data.responsible_name;
        ask.startDate = `${moment(_data.start_date).format('D')} ${Utils.getMonthName(moment(_data.start_date).format('MM'))} ${moment(_data.start_date).get('year') + 543}`;
        ask.endDate = `${moment(_data.end_date).format('D')} ${Utils.getMonthName(moment(_data.end_date).format('MM'))} ${moment(_data.end_date).get('year') + 543}`;
        ask.startTime = moment(_data.start_time, 'HH:mm:ss').format('HH:mm');
        ask.endTime = moment(_data.end_time, 'HH:mm:ss').format('HH:mm');

        json.ask = ask;

        //console.log(json);
        if (_isCarRequest == 'Y') {
          // Create pdf
          gulp.task('html', (cb) => {
            return gulp.src('./templates/ask-permission.jade')
              .pipe(data(function () {
                return json;
              }))
              .pipe(jade())
              .pipe(gulp.dest(destPath));
          });

          gulp.task('pdf', ['html'], function () {
            var html = fs.readFileSync(destPath + '/ask-permission.html', 'utf8')
            var options = {
              format: 'A4',
              // orientation: "landscape",
              footer: {
                height: "10mm"
              }
            };

            var pdfName = `./templates/pdf/ask-permission-${moment().format('x')}.pdf`;

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
          
        } else {
        // Create pdf
          gulp.task('html', (cb) => {
            return gulp.src('./templates/ask-permission-only.jade')
              .pipe(data(function () {
                return json;
              }))
              .pipe(jade())
              .pipe(gulp.dest(destPath));
          });

          gulp.task('pdf', ['html'], function () {
            var html = fs.readFileSync(destPath + '/ask-permission-only.html', 'utf8')
            var options = {
              format: 'A4',
              // orientation: "landscape",
              footer: {
                height: "10mm"
              }
            };

            var pdfName = `./templates/pdf/ask-permission-only-${moment().format('x')}.pdf`;

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
          
        }// end _isCarRequest

        // Convert html to pdf
        gulp.start('pdf');
        
      })
      .catch(err => res.send({ ok: false, msg: err }));

  } else {
    res.send({ ok: false, msg: 'Id not found!' });
  }
  
});


module.exports = router;
