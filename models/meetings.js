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
      .select('m.*', 't.name as type_meetings_name', db.raw('(select count(*) from meeting_assign where meeting_id=m.id) as total'))
      .leftJoin('l_type_meetings as t', 't.id', 'm.type_meetings_id')
      .groupBy('m.id')
      .limit(limit)
      .offset(offset)
      .orderBy('m.start_date')
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
      'm.start_date', 'm.end_date', 'm.score', 'm.type_meetings_id', 'mr.employee_id')
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
      'm.start_date', 'm.end_date', 'm.score', 'm.type_meetings_id',
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

  reportTotal(db, employee_id, startDate, endDate) {
    return db('meetings')
      .count('* as total')
      .whereBetween('start_date', [startDate, endDate])
      .where('employee_id', employee_id);
  },

  reportList(db, employee_id, startDate, endDate, limit, offset) {

    return db('meetings')
      .select()
      .whereBetween('start_date', [startDate, endDate])
      .where('employee_id', employee_id)
      .limit(limit)
      .offset(offset)
      .orderBy('start_date');
  },

  remove(db, id) {

    return db('meetings')
      .where('id', id)
      .del();
  },

  search(db, employee_id, query) {

    let _query = `%${query}%`;
    return db('meetings as m')
      .select('m.*', 't.name as type_meetings_name')
      .leftJoin('l_type_meetings as t', 't.id', 'm.type_meetings_id')
      .where('m.employee_id', employee_id)
      .where('m.meeting_title', 'like', _query)
      .orderBy('m.start_date');
  },

  getExportData(db, employee_id, startDate, endDate) {

    return db('meetings as m')
      .select('m.*', 't.name as type_meetings_name', 'lm.name as money_name')
      .leftJoin('l_type_meetings as t', 't.id', 'm.type_meetings_id')
      .leftJoin('l_money as lm', 'lm.id', 'm.money_id')
      .where('m.employee_id', employee_id)
      .whereBetween('m.start_date', [startDate, endDate])
      .orderBy('m.start_date')
  }

};
