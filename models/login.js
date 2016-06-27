'use strict';

module.exports = {
  userLogin(db, username, password) {
    return db('employees as e')
      .select('e.*', 'ls.department_id', 'ls.name as sub_department_name', 'ld.name as department_name')
      .leftJoin('l_sub_departments as ls', 'ls.id', 'e.sub_department_id')
      .leftJoin('l_departments as ld', 'ld.id', 'ls.department_id')
      .where('e.username', username)
      .where('e.password', password)
      .limit(1);
  },

  staffLogin(db, username, password) {
    return db('staff as s')
      .select('s.id', 's.username', 's.first_name', 's.last_name', 'p.name as position_name', 'd.name as department_name', 's.department_id')
      .leftJoin('l_positions as p', 'p.id', 's.position_id')
      .leftJoin('l_departments as d', 'd.id', 's.department_id')
      .where('s.active_status', 'Y')
      .where('s.username', username)
      .where('s.password', password)
      .limit(1);
  },

  adminLogin(db, username, password) {
    return db('admin')
      .count('* as total')
      .where({
        username: username,
        password: password
      });
  }
};