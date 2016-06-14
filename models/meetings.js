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

  update(db, meeting) {
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
      .select('m.*', 't.name as type_meetings_name')
      .leftJoin('l_type_meetings as t', 't.id', 'm.type_meetings_id')
      .limit(limit)
      .offset(offset)
      .orderBy('m.start_date')
  },

  total(db, employee_id) {
    return db('meetings')
      .count('* as total')
      .where('employee_id', employee_id);
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
  }

};
