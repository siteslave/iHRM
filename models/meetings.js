'use strict';

module.exports = {

  save(db, meeting) {
    return db('meetings')
      .insert(meeting);
  },

  checkDuplicated(db, bookNo) {
    return db('meetings')
      .where('book_no', bookNo)
      .count('* as total');
  },

  checkDuplicatedUpdate(db, id, bookNo) {
    return db('meetings')
      .where('book_no', bookNo)
      .whereNot('id', id)
      .count('* as total');
  },

  updateAdmin(db, meeting) {
    return db('meetings')
      .update({
        book_no: meeting.book_no,
        book_date: meeting.book_date,
        title: meeting.title,
        owner: meeting.owner,
        place: meeting.place,
        start_date: meeting.start_date,
        end_date: meeting.end_date,
        type_meetings_id: meeting.type_meetings_id,
        updated_at: meeting.updated_at
      })
      .where('id', meeting.id);
  },

  totalAdmin(db) {
    return db('meetings')
      .count('* as total');
  },

  listAdmin(db, limit, offset) {

    return db('meetings as m')
      .select('m.*', 't.name as type_meetings_name',
      db.raw('(select count(*) from meeting_assign where meeting_id=m.id) as total'),
      db.raw('(select count(*) from meeting_register where meeting_id=m.id) as total_registered'),
      db.raw('(select count(*) from meeting_register where meeting_id=m.id and approve_status="Y") as total_approve'))
      .leftJoin('l_type_meetings as t', 't.id', 'm.type_meetings_id')
      .groupBy('m.id')
      .limit(limit)
      .offset(offset)
      .orderBy('m.start_date')
  },

  searchAdmin(db, query) {
    let _query = `%${query}%`;
    return db('meetings as m')
      .select('m.*', 't.name as type_meetings_name',
      db.raw('(select count(*) from meeting_assign where meeting_id=m.id) as total'),
      db.raw('(select count(*) from meeting_register where meeting_id=m.id) as total_registered'),
      db.raw('(select count(*) from meeting_register where meeting_id=m.id and approve_status="Y") as total_approve'))
      .leftJoin('l_type_meetings as t', 't.id', 'm.type_meetings_id')
      .where('m.title', 'like', _query)
      .groupBy('m.id')
      .orderBy('m.start_date')
      .limit(100);
  },

  clearAssign(db, meetingId) {
    return db('meeting_assign')
      .where('meeting_id', meetingId)
      .del();
  },

  saveAssign(db, assigns) {
    return db('meeting_assign')
      .insert(assigns);
  },

  getAssign(db, id) {
    return db('meeting_assign')
      .select('department_id')
      .where('meeting_id', id);
  },

  getAssignList(db, departmentId, limit, offset) {
    return db('meetings as m')
      .select('m.id', 'm.book_no', 'm.book_date', 'm.title', 'm.owner', 'm.place',
      'm.start_date', 'm.end_date', 'mr.score', 'm.type_meetings_id', 'mr.employee_id')
      .innerJoin('meeting_assign as ms', 'ms.meeting_id', 'm.id')
      .leftJoin('meeting_register as mr', 'mr.meeting_id', 'm.id')
      .where('ms.department_id', departmentId)
      .whereNull('mr.employee_id')
      .orderBy('m.start_date')
      .groupBy('m.id')
      .limit(limit)
      .offset(offset);
  },

  getAssignTotal(db, departmentId) {
    return db('meetings as m')
      .count('* as total')
      .innerJoin('meeting_assign as ms', 'ms.meeting_id', 'm.id')
      .leftJoin('meeting_register as mr', 'mr.meeting_id', 'm.id')
      .where('ms.department_id', departmentId)
      .whereNull('mr.employee_id');
  },

  doRegister(db, register) {
    return db('meeting_register')
      .insert(register);
  },

  // userDoRegister(db, register) {
  //   return db('meeting_register')
  //     .where('meeting_id', register.meeting_id)
  //     .update({
  //       money_id: register.money_id,
  //       transport_id: register.transport_id,
  //       price: register.price,
  //       employee_id: register.employee_id,
  //       register_date: register.register_date,
  //       approve_status: register.approve_status,
  //       score: register.score
  //     });
  // },

  updateRegister(db, register) {
    return db('meeting_register')
      .where('meeting_id', register.meeting_id)
      .where('employee_id', register.employee_id)
      .update({
        money_id: register.money_id,
        transport_id: register.transport_id,
        price: register.price,
        updated_at: register.updated_at
      });
  },

  doUnRegister(db, meetingId, employeeId) {
    return db('meeting_register')
      .where({
        meeting_id: meetingId,
        employee_id: employeeId
      })
      .del();
  },

  isRegisterDuplicated(db, meetingId, employeeId) {
    return db('meeting_register')
      .where({
        meeting_id: meetingId,
        employee_id: employeeId
      })
      .count('* as total');
  },

  getRegisteredList(db, employeeId, limit, offset) {
    return db('meetings as m')
      .select('m.id', 'm.book_no', 'm.book_date', 'm.title', 'm.owner', 'm.place',
      'm.start_date', 'm.end_date', 'mr.score', 'm.type_meetings_id',
      'mr.employee_id', 'mr.approve_status', 'mr.money_id', 'mr.transport_id', 'mr.price')
      .innerJoin('meeting_assign as ms', 'ms.meeting_id', 'm.id')
      .leftJoin('meeting_register as mr', 'mr.meeting_id', 'm.id')
      .where('mr.employee_id', employeeId)
      .orderBy('m.start_date')
      .groupBy('m.id')
      .limit(limit)
      .offset(offset);
  },

  getRegisteredTotal(db, employeeId) {
    return db('meetings as m')
      .count('* as total')
      .leftJoin('meeting_register as mr', 'mr.meeting_id', 'm.id')
      .where('mr.employee_id', employeeId);
  },

  list(db, employee_id, limit, offset) {

    return db('meetings as m')
      .select('m.*', 't.name as type_meetings_name')
      .where('m.employee_id', employee_id)
      .leftJoin('l_type_meetings as t', 't.id', 'm.type_meetings_id')
      .limit(limit)
      .offset(offset)
      .orderBy('m.start_date')
  },

  userReportTotal(db, employee_id, startDate, endDate) {
    return db('meeting_register as mr')
      .count('* as total')
      .innerJoin('meetings as m', 'm.id', 'mr.meeting_id')
      .whereBetween('m.start_date', [startDate, endDate])
      .where('mr.employee_id', employee_id)
      .where('mr.approve_status', 'Y');
  },

  userReportList(db, employee_id, startDate, endDate, limit, offset) {

    return db('meeting_register as mr')
      .select('mr.meeting_id', 'mr.money_id', 'mr.register_date', 'mr.approve_status',
      'mr.transport_id', 'mr.price', 'mr.score', 'm.title', 'm.owner', 'm.place',
      'm.end_date', 'm.start_date', 'm.book_date', 'm.type_meetings_id',
      'm.book_no', 'lm.name as money_name', 'lt.name as transport_name')
      .innerJoin('meetings as m', 'm.id', 'mr.meeting_id')
      .leftJoin('l_money as lm', 'lm.id', 'mr.money_id')
      .leftJoin('l_transports as lt', 'lt.id', 'mr.transport_id')
      .whereBetween('m.start_date', [startDate, endDate])
      .where('mr.employee_id', employee_id)
      .where('mr.approve_status', 'Y')
      .limit(limit)
      .offset(offset)
      .orderBy('m.start_date');
  },

  remove(db, id) {

    return db('meetings')
      .where('id', id)
      .del();
  },

  userSearch(db, employee_id, query) {

    let _query = `%${query}%`;
    return db('meeting_register as mr')
      .select('mr.meeting_id', 'mr.money_id', 'mr.register_date', 'mr.approve_status',
      'mr.transport_id', 'mr.price', 'm.title', 'm.owner', 'm.place', 'm.end_date', 'm.start_date', 'm.book_date', 'm.type_meetings_id',
      'm.book_no', 'lm.name as money_name', 'lt.name as transport_name')
      .innerJoin('meetings as m', 'm.id', 'mr.meeting_id')
      .leftJoin('l_money as lm', 'lm.id', 'mr.money_id')
      .leftJoin('l_transports as lt', 'lt.id', 'mr.transport_id')
      .whereBetween('m.start_date', [startDate, endDate])
      .where('mr.employee_id', employee_id)
      .where('mr.approve_status', 'Y')
      .where('m.title', 'like', _query)
      .orderBy('m.start_date');
  },

  getExportData(db, employeeId, startDate, endDate) {

    return db('meetings as m')
      .select('m.*', 'mr.score', 'mr.price', 't.name as type_meetings_name', 'lm.name as money_name')
      .innerJoin('meeting_register as mr', 'mr.meeting_id', 'm.id')
      .leftJoin('l_type_meetings as t', 't.id', 'm.type_meetings_id')
      .leftJoin('l_money as lm', 'lm.id', 'mr.money_id')
      .where('mr.employee_id', employeeId)
      .where('mr.approve_status', 'Y')
      .whereBetween('m.start_date', [startDate, endDate])
      .orderBy('m.start_date');
  },

  getMeetingRegisteredDetail(db, meetingId, employeeId) {
    let sql = `select concat(lt.name, " ", e.first_name, " ", e.last_name) as fullname, ls.name as sub_name, ld.name as main_name, lp.name as position_name,
      m.book_no, m.book_date, m.title, m.owner, m.place, m.start_date, m.end_date, mr.score, mr.price,
      timestampdiff(day, m.start_date, m.end_date) + 1 as total_days, ltt.name as transport_name
      from employees as e
      inner join meeting_register as mr on mr.employee_id=e.id
      left join meetings as m on m.id=mr.meeting_id
      left join l_sub_departments as ls on ls.id=e.sub_department_id
      left join l_departments as ld on ld.id=ls.department_id
      left join l_positions as lp on lp.id=e.position_id
      left join l_titles as lt on lt.id=e.title_id
      left join l_transports as ltt on ltt.id=mr.transport_id
      where e.id=? and mr.meeting_id=?`;

    return db.raw(sql, [employeeId, meetingId]);
  },

  getEmployeeRegistered(db, meetingId) {
    let sql = `select mr.meeting_id, mr.employee_id, mr.register_date, mr.transport_id, mr.price, mr.approve_status,
      t.name as title_name, e.first_name, e.last_name, ls.name as sub_name, lp.name as position_name, lt.name as transport_name
      from meeting_register as mr
      left join employees as e on e.id=mr.employee_id
      left join l_sub_departments as ls on ls.id=e.sub_department_id
      left join l_positions as lp on lp.id=e.position_id
      left join l_transports as lt on lt.id=mr.transport_id
      left join l_titles as t on t.id=e.title_id
      where mr.meeting_id=?
      `;

    return db.raw(sql, [meetingId]);
  },

  getEmployeeRegisteredApproved(db, meetingId) {
    return db('meeting_register')
      .select('employee_id')
      .where('approve_status', 'Y')
      .where('meeting_id', meetingId);
  },

  approveRegister(db, meetingId, employees) {
    return db('meeting_register')
      .where('meeting_id', meetingId)
      .whereIn('employee_id', employees)
      .update('approve_status', 'Y');
  },

  clearApproveRegister(db, meetingId) {
    return db('meeting_register')
      .where('meeting_id', meetingId)
      .update('approve_status', 'N');
  }, 

  getMeetingInfo(db, meetingId) {
    return db('meetings as m')
      .select('m.*', 'tm.name as type_meetings_name')
      .leftJoin('l_type_meetings as tm', 'tm.id', 'm.type_meetings_id')
      .where('m.id', meetingId);
  },

  /** Reports */


  reportMeetingList(db, start, end) {

    return db('meetings as m')
      .select('m.*', 't.name as type_meetings_name')
      .leftJoin('l_type_meetings as t', 't.id', 'm.type_meetings_id')
      .whereBetween('m.start_date', [start, end])
      .orderBy('m.start_date');
  },

  reportDepartmentList(db, departmentId, start, end) {
    let sql = `
      select t.name as title_name, e.first_name, e.last_name, p.name as position_name,
      m.title, m.place, m.owner, m.start_date, m.end_date
      from meeting_register as mr
      inner join meetings as m on m.id=mr.meeting_id
      inner join employees as e on e.id=mr.employee_id
      inner join l_sub_departments as l on l.id=e.sub_department_id
      inner join l_departments as d on d.id=l.department_id
      left join l_titles as t on t.id=e.title_id
      left join l_positions as p on p.id=e.position_id
      where d.id=?
      and m.start_date between ? and ?
      order by m.title
    `;

    return db.raw(sql, [departmentId, start, end]);
  }
};
