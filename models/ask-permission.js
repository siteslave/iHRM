'use strict';

module.exports = {
  list(db, employeeId, limit, offset) {
    return db('ask_permission')
      .where('employee_id', employeeId)
      .orderBy('ask_date', 'desc')
      .limit(limit)
      .offset(offset);
  }, 
  
  total(db, employeeId) {
    return db('ask_permission')
      .where('employee_id', employeeId)
      .count('* as total');
  },

  getEmployeeSelectedList(db, askId) {
    return db('ask_permission_employee as a')
      .select('e.id', 'e.first_name', 'e.last_name')
      .leftJoin('employees as e', 'e.id', 'a.employee_id')
      .where('a.ask_permission_id', askId);
  },

  adminList(db, approveStatus, startDate, endDate, limit, offset) {
    return db('ask_permission as c')
      .select('c.id', 'c.target_name', 'c.cause', 'c.start_date', 'c.end_date', 'c.start_time', 'c.end_time',
        'c.request_date', 'c.car_license', 'c.driver_id', 't.name as title_name', 'e.first_name', 'e.last_name', 'c.approve_status')
      .leftJoin('employees as e', 'e.id', 'c.employee_id')
      .leftJoin('l_titles as t', 't.id', 'e.title_id')
      .where('c.approve_status', approveStatus)
      .whereBetween('c.start_date', [startDate, endDate])
      .orderBy('c.start_date', 'desc')
      .limit(limit)
      .offset(offset);
  }, 
  
  adminTotal(db, approveStatus, startDate, endDate) {
    return db('ask_permission')
      .whereBetween('start_date', [startDate, endDate])
      .where('approve_status', approveStatus)
      .count('* as total');
  },
  
  adminApprove(db, requestId, approve) {
    return db('ask_permission')
      .where('id', requestId)
      .update(approve);
  },
  
  adminCancelApprove(db, requestId) {
    return db('ask_permission')
      .where('id', requestId)
      .update({
        approve_status: 'N',
        approved_at: '',
        car_license: '',
        driver_id: ''
      });
  },

  save(db, request) {
    return db('ask_permission')
      .insert(request)
      .returning('id');
  },

  saveEmployee(db, employee) {
    return db('ask_permission_employee')
      .insert(employee);
  },

  removeEmployee(db, askId) {
    return db('ask_permission_employee')
      .where('ask_permission_id', askId)
      .del();
  },
  
  update(db, askId, ask) {
    return db('ask_permission')
      .where('id', askId)
      .update(ask);
  },

  remove(db, requestId) {
    return db('ask_permission')
      .where('id', requestId)
      .del();
  }
}