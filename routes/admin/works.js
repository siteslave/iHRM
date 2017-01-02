'use strict';

let express = require('express');
let router = express.Router();
let crypto = require('crypto');
let moment = require('moment');
let fse = require('fs-extra');
var rimraf = require('rimraf');
let _ = require('lodash');
let path = require('path');
let fs = require('fs');
let pdf = require('html-pdf');
let jsonData = require('gulp-data');
let gulp = require('gulp');
let jade = require('gulp-jade');

let Work = require('../../models/work');
let Job = require('../../models/job');

router.post('/process', (req, res, next) => {
  let db = req.db;
  let start = req.body.start;
  let end = req.body.end;

  if (start && end) {
    Work.doProcess(db, start, end)
      .then(rows => {
        res.send({ ok: true, rows: rows[0] });
      });
  } else {
    res.send({ ok: false, msg: 'ข้อมูลไม่สมบูรณ์' });
  }
});

router.post('/worklate-detail', (req, res, next) => {
  let db = req.db;
  let start = req.body.start;
  let end = req.body.end;
  let employee_code = req.body.employee_code;

  if (employee_code && start && end) {
    Work.getWorkLateDetail(db, employee_code, start, end)
      .then(rows => {
        res.send({ ok: true, rows: rows[0] });
      });
  } else {
    res.send({ ok: false, msg: 'ข้อมูลไม่สมบูรณ์' });
  }
});

router.post('/exit-detail', (req, res, next) => {
  let db = req.db;
  let start = req.body.start;
  let end = req.body.end;
  let employee_code = req.body.employee_code;

  if (employee_code && start && end) {
    Work.getExitDetail(db, employee_code, start, end)
      .then(rows => {
        res.send({ ok: true, rows: rows[0] });
      });
  } else {
    res.send({ ok: false, msg: 'ข้อมูลไม่สมบูรณ์' });
  }
});

router.post('/not-exit-detail', (req, res, next) => {
  let db = req.db;
  let start = req.body.start;
  let end = req.body.end;
  let employee_code = req.body.employee_code;

  if (employee_code && start && end) {
    Work.getNotExitDetail(db, employee_code, start, end)
      .then(rows => {
        res.send({ ok: true, rows: rows[0] });
      });
  } else {
    res.send({ ok: false, msg: 'ข้อมูลไม่สมบูรณ์' });
  }
});


router.get('/print/:employeeCode/:startDate/:endDate', (req, res, next) => {
  let startDate = req.params.startDate;
  let endDate = req.params.endDate;
  let employeeCode = req.params.employeeCode;

  let db = req.db;

  fse.ensureDirSync('./templates/html');
  fse.ensureDirSync('./templates/pdf');

  let destPath = './templates/html/' + moment().format('x');
  fse.ensureDirSync(destPath);

  // let start = moment(startDate).format('YYYY-MM-DD');
  // let end = moment(endDate).format('YYYY-MM-DD');
  let json = {};

  json.start_date = `${moment(startDate).format('DD/MM')}/${moment(startDate).get('year') + 543}`;
  json.end_date = `${moment(endDate).format('DD/MM')}/${moment(endDate).get('year') + 543}`;
  json.items = [];

  // get employee detail
  Job.getEmployeeDetail(db, employeeCode)
    .then(rows => {
      json.employee = rows[0];
      // console.log(json);
      return Job.getDetailForPrint(db, employeeCode, startDate, endDate);
    })
    .then((rows) => {
      let _data = rows[0];
      json.results = [];

      _data.forEach(v => {
        let obj = {};
        obj.date_serve = `${moment(v.date_serve).format('DD/MM')}/${moment(v.date_serve).get('year') + 543}`;
        obj.in01 = v.in01 ? moment(v.in01, 'HH:mm:ss').format('HH:mm') : '';
        obj.in02 = v.in02 ? moment(v.in02, 'HH:mm:ss').format('HH:mm') : '';
        let _in03 = v.in03 || v.in03_2;
        obj.in03 = _in03 ? moment(_in03, 'HH:mm:ss').format("HH:mm") : '';
        obj.out01 = v.out01 ? moment(v.out01, 'HH:mm:ss').format('HH:mm') : '';
        let _out02 = v.out02 || v.out02_2;
        obj.out02 = _out02 ? moment(_out02, 'HH:mm:ss').format('HH:mm') : '';
        obj.out03 = v.out03 ? moment(v.out03, 'HH:mm:ss').format('HH:mm') : '';
        obj.late = moment(v.in01, 'HH:mm:ss').isAfter(moment('08:45:59', 'HH:mm:ss')) ? 'สาย' : '';
        json.results.push(obj);
      });

      // console.log(json);

      gulp.task('html', (cb) => {
        return gulp.src('./templates/user-time.jade')
          .pipe(jsonData(() => {
            return json;
          }))
          .pipe(jade())
          .pipe(gulp.dest(destPath));
      });

      gulp.task('pdf', ['html'], () => {
        let html = fs.readFileSync(destPath + '/user-time.html', 'utf8')
        let options = {
          format: 'A4',
          // height: "8in",
          // width: "6in",
          orientation: "portrait",
          footer: {
            height: "15mm",
            contents: '<span style="color: #444;"><small>Printed: ' + new Date() + '</small></span>'
          }
        }

        // let pdfName = path.join(destPath, employee.fullname + '-' + moment().format('x') + '.pdf');
        var pdfName = `./templates/pdf/user-time-${moment().format('x')}.pdf`;

        pdf.create(html, options).toFile(pdfName, (err, resp) => {
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

      gulp.start('pdf');

    })
    .catch(err => {
      res.send({ ok: false, msg: err });
    });

});

router.get('/print-summary/:startDate/:endDate', (req, res, next) => {
  let startDate = req.params.startDate;
  let endDate = req.params.endDate;

  let db = req.db;

  fse.ensureDirSync('./templates/html');
  fse.ensureDirSync('./templates/pdf');

  let destPath = './templates/html/' + moment().format('x');
  fse.ensureDirSync(destPath);

  let json = {};

  json.start_date = `${moment(startDate).format('D')} ${moment(startDate).locale('th').format('MMMM')} ${moment(startDate).get('year') + 543}`;
  json.end_date = `${moment(endDate).format('D')} ${moment(endDate).locale('th').format('MMMM')} ${moment(endDate).get('year') + 543}`;
  // get employee detail
  Work.doPrint(db, startDate, endDate)
    .then((rows) => {
      let _data = rows[0];
      json.results = _data;

      gulp.task('html', (cb) => {
        return gulp.src('./templates/user-time-summary.jade')
          .pipe(jsonData(() => {
            return json;
          }))
          .pipe(jade())
          .pipe(gulp.dest(destPath));
      });

      gulp.task('pdf', ['html'], () => {
        let html = fs.readFileSync(destPath + '/user-time-summary.html', 'utf8')
        let options = {
          format: 'A4',
          // height: "8in",
          // width: "6in",
          orientation: "portrait",
          footer: {
            height: "15mm",
            contents: '<span style="color: #444;"><small>Printed: ' + new Date() + '</small></span>'
          }
        }

        let pdfName = `./templates/pdf/user-time-summary-${moment().format('x')}.pdf`;

        pdf.create(html, options).toFile(pdfName, (err, resp) => {
          if (err) {
            res.send({ ok: false, msg: err });
          } else {
            res.download(pdfName, () => {
              rimraf.sync(destPath);
              fse.removeSync(pdfName);
            });
          }
        });

      });

      gulp.start('pdf');

    })
    .catch(err => {
      res.send({ ok: false, msg: err });
    });

});


module.exports = router;