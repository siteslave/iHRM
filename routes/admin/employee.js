'use strict';

let express = require('express');
let router = express.Router();
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

let Employee = require('../../models/employee');
let Meetings = require('../../models/meetings');

router.post('/total', (req, res, next) => {
  Employee.total(req.db)
    .then(rows => res.send({ ok: true, total: rows[0].total }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/list', (req, res, next) => {
  let limit = req.body.limit;
  let offset = req.body.offset;

  Employee.list(req.db, limit, offset)
    .then(rows => res.send({ ok: true, rows: rows }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/search', (req, res, next) => {
  let query = req.body.query;

  Employee.search(req.db, query)
    .then(rows => res.send({ ok: true, rows: rows }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/save', (req, res, next) => {

  let employee = {};

  employee.first_name = req.body.firstName;
  employee.last_name = req.body.lastName;
  employee.position_id = req.body.position;
  employee.sub_department_id = req.body.department;
  employee.title_id = req.body.title;
  employee.position_id = req.body.position;
  employee.username = req.body.username;

  let password = req.body.password;

  employee.password = crypto.createHash('md5').update(password).digest('hex');

  if (employee.first_name && employee.last_name && employee.position_id && employee.sub_department_id && employee.username && employee.password) {
    console.log(employee);

    Employee.save(req.db, employee)
      .then(() => res.send({ ok: true }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ok: false, msg: 'Data incomplete!'})
  }

});

router.put('/save', (req, res, next) => {
  let employee = {};

  employee.first_name = req.body.firstName;
  employee.last_name = req.body.lastName;
  employee.position_id = req.body.position;
  employee.sub_department_id = req.body.department;
  employee.title_id = req.body.title;
  employee.position_id = req.body.position;
  employee.id = req.body.id;

  if (employee.first_name && employee.last_name && employee.id) {
    console.log(employee);
    Employee.isDuplicated(req.db, employee.id, employee.first_name, employee.last_name)
      .then(rows => {
        if (rows[0].total) {
          res.send({ ok: false, msg: 'Duplicated!' })
        } else {
          Employee.update(req.db, employee)
            .then(() => res.send({ ok: true }))
            .catch(err => res.send({ ok: false, msg: err }));
        }
      })
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ok: false, msg: 'Employee id not found!'})
  }
});

router.delete('/delete/:id', (req, res, next) => {
  let id = req.params.id;

  if (id) {
    Employee.remove(req.db, id)
      .then(() => res.send({ ok: true }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ok: false, msg: 'Employee id not found!'})
  }
});

router.put('/changepass', (req, res, next) => {
  let id = req.body.id;
  let password = req.body.password;

  let encryptPassword = crypto.createHash('md5').update(password).digest('hex');

  if (password && id) {
    Employee.changePassword(req.db, id, encryptPassword)
      .then(() => res.send({ ok: true }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ok: false, msg: 'Incorrect parameters!'})
  }
});

router.post('/history/total', (req, res, next) => {
  let employee_id = req.session.userId;
  let startDate = req.body.start;
  let endDate = req.body.end;
  let id = req.body.id;

  Meetings.userReportTotal(req.db, id, startDate, endDate)
    .then(rows => res.send({ ok: true, total: rows[0].total }))
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/history/list', (req, res, next) => {
  let limit = req.body.limit;
  let offset = req.body.offset;
  let employee_id = req.session.userId;
  let startDate = req.body.start;
  let endDate = req.body.end;
  let id = req.body.id;

  Meetings.userReportList(req.db, id, startDate, endDate, limit, offset)
    .then(rows => res.send({ ok: true, rows: rows }))
    .catch(err => res.send({ ok: false, msg: err }));
});


router.get('/pdf/:id/:start/:end', (req, res, next) => {
  let json = {};
  json.startDate = moment(req.params.start).format('DD/MM') + '/' + (moment(req.params.start).get('year')+543);
  json.endDate = moment(req.params.end).format('DD/MM') + '/' + (moment(req.params.end).get('year') + 543);
  fse.ensureDirSync('./templates/html');
  fse.ensureDirSync('./templates/pdf');

  var destPath = './templates/html/' + moment().format('x');
  fse.ensureDirSync(destPath);

  gulp.task('html', (cb) => {
    return gulp.src('./templates/user-report.jade')
      .pipe(data(function () {
        return json;
      }))
      .pipe(jade())
      .pipe(gulp.dest(destPath));
  });

  gulp.task('pdf', ['html'], () => {
    let html = fs.readFileSync(destPath + '/user-report.html', 'utf8')
    let options = {
      format: 'A4',
      orientation: "landscape",
      footer: {
        height: "15mm",
        contents: '<span style="color: #444;"><small>Printed: ' + new Date() + '</small></span>'
      }
    };

    let pdfName = `./templates/pdf/user-report-${moment().format('x')}.pdf`;

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

    // get user info
  Employee.getInfo(req.db, req.params.id)
    .then(rows => {
      let user = rows[0];

      json.fullname = user.fullname;
      json.departmentName = user.main_name;
      json.subDepartmentName = user.sub_name;

      return Meetings.getExportData(req.db, req.params.id, req.params.start, req.params.end);
    })
    .then(rows => {
      //json.data = rows;
      console.log(rows);
      let meetings = [];

      rows.forEach(v => {
        let obj = {};
        obj.title = v.title;
        obj.owner = v.owner;
        obj.place = v.place;
        obj.start_date = moment(v.start_date).format('DD/MM') + '/' + (moment(v.start_date).get('year') + 543);
        obj.end_date = moment(v.end_date).format('DD/MM') + '/' + (moment(v.end_date).get('year') + 543);
        obj.score = numeral(v.score).format('0,0.00');
        obj.price = numeral(v.price).format('0,0.00');
        obj.type_meetings_name = v.type_meetings_name;
        obj.money_name = v.money_name;
        meetings.push(obj);
      });

      json.meetings = meetings;
      // Convert html to pdf
      gulp.start('pdf');

    })

    .catch(err => res.send({ ok: false, msg: err }));
});


module.exports = router;
