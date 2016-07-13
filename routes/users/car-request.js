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

let CareRequest = require('../../models/car-request');

router.post('/list', (req, res, next) => {
  let db = req.db;
  let employeeId = req.session.userId;
  let limit = req.body.limit;
  let offset = req.body.offset;

  CareRequest.list(db, employeeId, limit, offset)
    .then(rows => res.send({ ok: true, rows: rows }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/total', (req, res, next) => {
  let db = req.db;
  let employeeId = req.session.userId;

  CareRequest.total(db, employeeId)
    .then(rows => res.send({ ok: true, total: rows[0].total }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/', (req, res, next) => {
  let db = req.db;
  let request = {};
  
  request.employee_id = req.session.userId;
  request.request_date = moment().format('YYYY-MM-DD');
  request.start_date = req.body.startDate;
  request.start_time = req.body.startTime;
  request.end_date = req.body.endDate;
  request.end_time = req.body.endTime;
  request.target_name = req.body.targetName;
  request.cause = req.body.cause;
  request.traveler_num = req.body.travelerNum;
  request.responsible_name = req.body.responsibleName;
  request.created_at = moment().format('YYYY-MM-DD HH:mm:ss');

  if (request.start_date && request.end_date && request.target_name && request.cause) {
    CareRequest.save(db, request)
      .then(() => res.send({ ok: true }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ ok: false, msg: 'ข้อมูลไม่สมบูรณ์' });
  }
});

router.put('/', (req, res, next) => {
  let db = req.db;
  let request = {};
  
  let requestId = req.body.id;

  request.request_date = moment().format('YYYY-MM-DD');
  request.start_date = req.body.startDate;
  request.start_time = req.body.startTime;
  request.end_date = req.body.endDate;
  request.end_time = req.body.endTime;
  request.target_name = req.body.targetName;
  request.cause = req.body.cause;
  request.traveler_num = req.body.travelerNum;
  request.responsible_name = req.body.responsibleName;
  request.updated_at = moment().format('YYYY-MM-DD HH:mm:ss');

  if (request.start_date && request.end_date && request.target_name && request.cause) {
    CareRequest.update(db, requestId, request)
      .then(() => res.send({ ok: true }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ ok: false, msg: 'ข้อมูลไม่สมบูรณ์' });
  }
});

router.delete('/:id', (req, res, next) => {
 	let requestId = req.params.id;
    let db = req.db;
  
    if (requestId) {
      CareRequest.remove(db, requestId)
        .then(() => res.send({ ok: true }))
        .catch(err => res.send({ ok: false, msg: err }));
    } else {
      res.send({ ok: false, msg: 'Id not found!' });  
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

    CareRequest.getPrintInfo(db, id)
      .then(rows => {
        //json.data = rows;
        // console.log(rows);
        let _data = rows[0][0];
        // console.log(_data);
        let request = {};

        request.currentDate = `${moment().format('D')} ${Utils.getMonthName(moment().format('MM'))} ${moment().get('year') + 543}`;
        request.fullname = _data.fullname;
        request.positionName = _data.position_name;
        request.targetName = _data.target_name;
        request.cause = _data.cause;
        request.travelerNum = _data.traveler_num;
        request.startDate = `${moment(_data.start_date).format('D')} ${Utils.getMonthName(moment(_data.start_date).format('MM'))} ${moment(_data.start_date).get('year') + 543}`;
        request.endDate = `${moment(_data.end_date).format('D')} ${Utils.getMonthName(moment(_data.end_date).format('MM'))} ${moment(_data.end_date).get('year') + 543}`;
        request.startTime = moment(_data.start_time, 'HH:mm:ss').format('HH:mm');
        request.endTime = moment(_data.end_time, 'HH:mm:ss').format('HH:mm');
        request.responsibleName = _data.responsible_name;

        json.request = request;
        console.log(json);
        // Create pdf
        gulp.task('html', (cb) => {
          return gulp.src('./templates/car-request.jade')
            .pipe(data(function () {
              return json;
            }))
            .pipe(jade())
            .pipe(gulp.dest(destPath));
        });

        gulp.task('pdf', ['html'], function () {
          var html = fs.readFileSync(destPath + '/car-request.html', 'utf8')
          var options = {
            format: 'A4',
            // orientation: "landscape",
            footer: {
              height: "15mm",
              contents: '<span style="color: #444;"><small>Printed: ' + new Date() + '</small></span>'
            }
          };

          var pdfName = `./templates/pdf/car-request-${moment().format('x')}.pdf`;

          pdf.create(html, options).toFile(pdfName, function (err, resp) {
            if (err) {
              res.send({ ok: false, msg: err });
            } else {
              res.download(pdfName, function () {
                // rimraf.sync(destPath);
                // fse.removeSync(pdfName);
              });
            }
          });
        });
        // Convert html to pdf
        gulp.start('pdf');

      })
      .catch(err => res.send({ ok: false, msg: err }));

  } else {
    res.send({ ok: false, msg: 'Id not found!' });
  }
  
});

module.exports = router;
