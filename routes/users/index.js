'use strict';

var express = require('express');
var router = express.Router();
var Job = require('../../models/job');
var moment = require('moment');
var fse = require('fs-extra');
var rimraf = require('rimraf');
let _ = require('lodash');
let path = require('path');
let fs = require('fs');
let pdf = require('html-pdf');
let jsonData = require('gulp-data');
let gulp = require('gulp');
let jade = require('gulp-jade');


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('users/index')
});

router.get('/jobs/print/:startDate/:endDate', function (req, res, next) {
  let startDate = req.params.startDate;
  let endDate = req.params.endDate;
  let db = req.db;
  let employeeCode = req.session.employeeCode;

  // console.log(startDate);
  // console.log(endDate);

  fse.ensureDirSync('./templates/html');
  fse.ensureDirSync('./templates/pdf');

  var destPath = './templates/html/' + moment().format('x');
  fse.ensureDirSync(destPath);

  // let start = moment(startDate).format('YYYY-MM-DD');
  // let end = moment(endDate).format('YYYY-MM-DD');
  let json = {};

  // json.start_date = `${moment(startDate).format('DD/MM')}/${moment(startDate).get('year') + 543}`;
  // json.end_date = `${moment(endDate).format('DD/MM')}/${moment(endDate).get('year') + 543}`;
  json.start_date = `${moment(startDate).format('D')} ${moment(startDate).locale('th').format('MMMM')} ${moment(startDate).get('year') + 543}`;
  json.end_date = `${moment(endDate).format('D')} ${moment(endDate).locale('th').format('MMMM')} ${moment(endDate).get('year') + 543}`;
  
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

        let employee_name = `${json.employee.first_name} ${json.employee.last_name}`;
        // let pdfName = path.join(destPath, employee.fullname + '-' + moment().format('x') + '.pdf');
        var pdfName = `./templates/pdf/attendances-${employee_name}-${moment().format('x')}.pdf`;

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

router.post('/jobs/detail', (req, res, next) => {
  let employeeCode = req.session.employeeCode;
  let year = req.body.year;
  let month = req.body.month;
  let db = req.db;

  let serviceDate = `${year}-${month}-01`;
  let _startDate = moment(serviceDate, 'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD');
  let _endDate = moment(serviceDate, 'YYYY-MM-DD').endOf('month').format('YYYY-MM-DD');

  Job.getJobHistory(db, employeeCode, _startDate, _endDate)
    .then(rows => {
      if (rows.length) {
        res.send({ ok: true, rows: rows });
      } else {
        // create time
        let startDate = +moment(serviceDate, "YYYY-MM-DD").startOf("month").format("DD");
        let endDate = +moment(serviceDate, "YYYY-MM-DD").endOf("month").format("DD");
        let serviceDates = [];

        for (let i = 0; i <= endDate - 1; i++) {
          let _date = moment(serviceDate).add(i, "days").format("YYYY-MM-DD");
          serviceDates.push(_date);
        }

        let services = [];
        serviceDates.forEach(d => {
          let obj = { employee_code: employeeCode, date_serve: d, service_type: "1" };
          services.push(obj);
        });

        Job.saveJob(db, services)
          .then(() => {
            res.send({ ok: true, rows: services });
          }, error => {
            res.send({ ok: false, msg: error });
          });
        // save initial service

      }
    });

});

router.get('/jobs/allowed', (req, res, next) => {
  let db = req.db;

  Job.getJobAllowed(db)
    .then(rows => {
      res.send({ ok: true, rows: rows[0] });
    }, error => {
      res.send({ ok: false, msg: error });
    });
});

router.post('/jobs/save', (req, res, next) => {
  let data = req.body.data;
  let employeeCode = req.session.employeeCode;
  let month = req.body.month;
  let year = req.body.year;
  let db = req.db;

  let serviceDate = `${year}-${month}-01`;

  let _startDate = moment(serviceDate, 'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD');
  let _endDate = moment(serviceDate, 'YYYY-MM-DD').endOf('month').format('YYYY-MM-DD');


  let _data = [];

  data.forEach((v) => {
    let obj = {};
    obj.employee_code = employeeCode;
    obj.date_serve = v.date_serve;
    obj.service_type = v.service_type;
    obj.is_process = v.is_process;
    _data.push(obj);
  });

  // for (let x = 0; x <= _endDate - 1; x++) {
  //   let _date = moment(serviceDate, 'YYYY-MM-DD').add(x, "days").format("YYYY-MM-DD");
  //   serviceDates.push(_date);
  // }

  // console.log(_startDate);
  // console.log(_endDate);
  // console.log(_dates);
  Job.removeOldJob(db, employeeCode, _startDate, _endDate)
    .then(() => {
      return Job.saveJob(db, _data);
    })
    .then(() => {
      res.send({ ok: true });
    })
    .catch(err => {
      console.log(err);
      res.send({ ok: false, msg: err });
    });

});

module.exports = router;
