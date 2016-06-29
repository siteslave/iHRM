'use strict';

let express = require('express');
let router = express.Router();

let gulp = require('gulp');
let data = require('gulp-data');
let jade = require('gulp-jade');
let rimraf = require('rimraf');
let fse = require('fs-extra');
let fs = require('fs');
let path = require('path');
let moment = require('moment');
let pdf = require('html-pdf');
let numeral = require('numeral');
let crypto = require('crypto');

let Staff = require('../../models/staff');
let Meetings = require('../../models/meetings');
let Employee = require('../../models/employee');

router.get('/', (req, res, next) => {
  res.render('staff/index');
});

router.post('/total', (req, res, next) => {
  let db = req.db;
  let departmentId = req.session.departmentId;

  Staff.getEmployeeTotal(db, departmentId)
    .then(rows => {
      // console.log(rows);
      res.send({ ok: true, total: rows[0].total })
    })
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/list', (req, res, next) => {
  let db = req.db;
  let departmentId = req.session.departmentId;
  let limit = req.body.limit;
  let offset = req.body.offset;

  Staff.getEmployeeList(db, departmentId, limit, offset)
    .then(rows => res.send({ ok: true, rows: rows }))
    .catch(err => res.send({ ok: false, msg: err }));

});

router.post('/meeting/total', (req, res, next) => {
  let employeeId = req.body.employeeId;
  let startDate = req.body.start;
  let endDate = req.body.end;
  let db = req.db;

  Meetings.userReportTotal(db, employeeId, startDate, endDate)
    .then(rows => {
      console.log(rows);
      res.send({ ok: true, total: rows[0].total })
    })
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/meeting/list', (req, res, next) => {
  let limit = req.body.limit;
  let offset = req.body.offset;
  let employeeId = req.body.employeeId;
  let startDate = req.body.start;
  let endDate = req.body.end;
  let db = req.db;

  Meetings.userReportList(db, employeeId, startDate, endDate, limit, offset)
    .then(rows => res.send({ ok: true, rows: rows }))
    .catch(err => res.send({ ok: false, msg: err }));
});


router.get('/meeting/print/:employeeId/:start/:end', (req, res, next) => {
  let json = {};
  let startDate = req.params.start;
  let endDate = req.params.end;
  let employeeId = req.params.employeeId;
  let db = req.db;

  json.startDate = moment(startDate).format('DD/MM') + '/' + (moment(startDate).get('year') + 543);
  json.endDate = moment(endDate).format('DD/MM') + '/' + (moment(endDate).get('year') + 543);

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
  Employee.getInfo(db, employeeId)
    .then(rows => {
      let user = rows[0];

      json.fullname = `${user.title_name} ${user.first_name} ${user.last_name}`;
      json.departmentName = user.main_name;
      json.subDepartmentName = user.sub_name;

      return Meetings.getExportData(db, employeeId, startDate, endDate);
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

router.post('/info', (req, res, next) => {
  let db = req.db;
  let staffId = req.session.staffId;

  Staff.getStaffFullDetail(db, staffId)
    .then(rows => {
      console.log(rows);
      //res.send({ ok: true, rows: rows[0] });
      let info = {};
      info.username = rows[0].username;
      info.fullname = `${rows[0].title_name}${rows[0].first_name} ${rows[0].last_name}`;
      info.department = rows[0].department_name;
      info.position = rows[0].position_name;
      res.send({ ok: true, info: info });
    })
    .catch(err => res.send({ ok: false, msg: err }));
});

router.post('/changepass', (req, res, next) => {
  let db = req.db;
  let staffId = req.session.staffId;
  let password = req.body.password;

  if (password) {
    let _password = crypto.createHash('md5').update(password).digest('hex');
    Staff.changePassword(db, staffId, _password)
      .then(() => res.send({ ok: true }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ ok: false, msg: err });
  }

});

router.post('/search', (req, res, next) => {

  let query = req.body.query;
  let db = req.db;
  let departmentId = req.session.departmentId;

  if (query) {
    Staff.staffSearchEmployee(db, departmentId, query)
      .then(rows => res.send({ ok: true, rows: rows }))
      .catch(err => res.send({ ok: false, msg: err }));
  } else {
    res.send({ ok: false, msg: 'ข้อมูลไม่สมบูรณ์'})
  }
});

module.exports = router;
