'use strict';

module.exports = {
  save(db, staff) {
    return db('staff')
      .insert(staff);
  },

  update(db, staffId, staff) {
    return db('staff')
      .where('id', staffId)
      .update(staff);
  },

  isExist(db, username) {
    return db('staff')
      .count('* as total')
      .where('username', username)
  },

  staffSearchEmployee(db, departmentId, query) {

    let _query = `%${query}%`;
    return db('employees as e')
      .select('e.id', 'lt.name as title_name', 'e.fullname', 'ls.name as sub_department_name',
      'lp.name as position_name')
      .leftJoin('l_positions as lp', 'lp.id', 'e.position_id')
      .leftJoin('l_titles as lt', 'lt.id', 'e.title_id')
      .leftJoin('l_sub_departments as ls', 'ls.id', 'e.sub_department_id')
      .leftJoin('l_departments as ld', 'ld.id', 'ls.department_id')
      .where('ld.id', departmentId)
      .where('e.fullname', 'like', _query)
      .limit(20)
  },

  list(db, limit, offset) {
    return db('staff as s')
      .select('s.id', 'lt.name as title_name', 's.first_name', 's.last_name', 'ld.name as department_name',
      'lp.name as position_name')
      .leftJoin('l_positions as lp', 'lp.id', 's.position_id')
      .leftJoin('l_titles as lt', 'lt.id', 's.title_id')
      .leftJoin('l_departments as ld', 'ld.id', 's.department_id')
      .limit(limit)
      .offset(offset);
  },

  listAll(db) {
    return db('staff as s')
      .select('s.id', 'lt.name as title_name', 's.first_name', 's.last_name', 'ld.name as department_name',
      'lp.name as position_name')
      .leftJoin('l_positions as lp', 'lp.id', 's.position_id')
      .leftJoin('l_titles as lt', 'lt.id', 's.title_id')
      .leftJoin('l_departments as ld', 'ld.id', 's.department_id');
  },

  total(db) {
    return db('staff')
      .count('* as total');
  },

  getStaffDetail(db, staffId) {
    return db('staff')
      .select('id', 'first_name', 'last_name', 'title_id', 'position_id', 'department_id',
        'username', 'active_status')
      .where('id', staffId)
      .limit(1);
  },

  getStaffFullDetail(db, staffId) {
    return db('staff as s')
      .select('s.id', 's.username', 'lt.name as title_name', 's.first_name', 's.last_name', 'ld.name as department_name',
      'lp.name as position_name')
      .leftJoin('l_positions as lp', 'lp.id', 's.position_id')
      .leftJoin('l_titles as lt', 'lt.id', 's.title_id')
      .leftJoin('l_departments as ld', 'ld.id', 's.department_id')
      .where('s.id', staffId)
      .limit(1);
  },

  search(db, query) {
    let _query = `%${query}%`;

    return db('staff as s')
      .select('s.id', 'lt.name as title_name', 's.first_name', 's.last_name', 'ld.name as department_name',
      'lp.name as position_name')
      .leftJoin('l_positions as lp', 'lp.id', 's.position_id')
      .leftJoin('l_titles as lt', 'lt.id', 's.title_id')
      .leftJoin('l_departments as ld', 'ld.id', 's.department_id')
      .where('s.first_name', 'like', _query)
      .limit(20);
  },

  changePassword(db, staffId, password) {
    return db('staff')
      .where('id', staffId)
      .update('password', password);
  },

  remove(db, staffId) {
    return db('staff')
      .where('id', staffId)
      .del();
  },

  getEmployeeList(db, departmentId, limit, offset) {
    return db('employees as e')
      .select('e.id', 'lt.name as title_name', 'e.first_name', 'e.last_name', 'ls.name as sub_department_name',
      'lp.name as position_name')
      .leftJoin('l_positions as lp', 'lp.id', 'e.position_id')
      .leftJoin('l_titles as lt', 'lt.id', 'e.title_id')
      .leftJoin('l_sub_departments as ls', 'ls.id', 'e.sub_department_id')
      .leftJoin('l_departments as ld', 'ld.id', 'ls.department_id')
      .where('ld.id', departmentId)
      .limit(limit)
      .offset(offset);
  },

  getEmployeeListAll(db, departmentId) {
    return db('employees as e')
      .select('e.id', 'e.employee_code', 'lt.name as title_name', 'e.first_name', 'e.last_name', 'ls.name as sub_department_name',
      'lp.name as position_name')
      .leftJoin('l_positions as lp', 'lp.id', 'e.position_id')
      .leftJoin('l_titles as lt', 'lt.id', 'e.title_id')
      .leftJoin('l_sub_departments as ls', 'ls.id', 'e.sub_department_id')
      .leftJoin('l_departments as ld', 'ld.id', 'ls.department_id')
      .where('ld.id', departmentId)
      .orderBy('e.first_name');
  },

  getEmployeeTotal(db, departmentId) {
    return db('employees as e')
      .leftJoin('l_positions as lp', 'lp.id', 'e.position_id')
      .leftJoin('l_titles as lt', 'lt.id', 'e.title_id')
      .leftJoin('l_sub_departments as ls', 'ls.id', 'e.sub_department_id')
      .leftJoin('l_departments as ld', 'ld.id', 'ls.department_id')
      .where('ld.id', departmentId)
      .count('* as total');
  },

  getJobHistory(db, employeeCode, start, end) {
    return db('service_type_attendances')
      .where('employee_code', employeeCode)
      .whereBetween('date_serve', [start, end]);
  },

  removeOldJob(db, employeeCode, start, end) {
    return db('service_type_attendances')
      .where('employee_code', employeeCode)
      .whereBetween('date_serve', [start, end])
      .del();
  },

  saveJob(db, data) {
    return db('service_type_attendances')
      .insert(data);
  }

}