require('dotenv').config();

let moment = require('moment');
const MomentRange = require('moment-range');
const momentRange = MomentRange.extendMoment(moment)

const _s = '2016-10-01';
const _e = '2017-09-30';

let db = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    charset: 'utf8'
  }
});

let getMeeting = () => {
  // get all meetings
  let sql1 = `select * from meetings where start_date between ? and ?`;

  return new Promise((resolve, reject) => {
    db.raw(sql1, [_s, _e])
      .then((result) => {
        let meetings = [];
        result[0].forEach((v) => {
          meetings.push({ id: v.id, start: v.start_date, end: v.end_date });
        });
        resolve(meetings);
      });

  })
}

let getEmployees = (meetingId) => {
  // get all meetings
  let sql = `select * from meeting_register
   where meeting_id=? and approve_status='Y'`;

  return new Promise((resolve, reject) => {
    db.raw(sql, [meetingId])
      .then((result) => {
        let employees = [];
        result[0].forEach((v) => {
          if (v.employee_id) employees.push(v.employee_id);
        });
        resolve(employees);
      });

  })
}

let saveMeetings = (datas) => {
  return new Promise((resolve, reject) => {
    db('meeting_approve_dates')
      .insert(datas)
      .then((result) => {
        resolve();
      });

  })
}

let removeOldMeetings = () => {
  return new Promise((resolve, reject) => {
    db('meeting_approve_dates')
      .whereBetween('meeting_date', [_s, _e])
      .del()
      .then((result) => {
        resolve();
      });

  })
}

let meetingsData = [];

let doGetEmployee = async () => {
  let meetings = await getMeeting();

  await Promise.all(meetings.map(async (m) => {
    const employees = await getEmployees(m.id);
    if (employees.length) {
      let obj = {};
      obj.start = m.start;
      obj.end = m.end;
      obj.meeting_id = m.id;
      obj.employees = employees;
      meetingsData.push(obj);
    }
  }));

}

let startMigrate = async () => {
  let datas = [];
  try {
    await removeOldMeetings();
    await doGetEmployee();
  
    meetingsData.forEach(m => {
      const startDate = m.start;
      const endDate = m.end;
  
      const start = moment(startDate);
      const end = moment(endDate);
      const range = momentRange.range(start, end);
  
      const days = Array.from(range.by('days'));
  
      m.employees.forEach(v => {
        days.map(d => {
          let obj = {};
          obj.meeting_id = m.meeting_id;
          obj.employee_id = v
          obj.meeting_date = d.format('YYYY-MM-DD');
          datas.push(obj);
        });
      });
    });
  
    await saveMeetings(datas);
    console.log('Success');
  } catch (error) {
    console.error(error.message);
  }

}
// start
startMigrate();
