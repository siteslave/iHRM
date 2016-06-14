'use strict';

module.exports = {
  userLogin(db, username, password) {
    return db('employees as e')
      .select('e.*', 'ls.name as sub_department_name', 'ld.name as department_name')
      .leftJoin('l_sub_departments as ls', 'ls.id', 'e.sub_department_id')
      .leftJoin('l_departments as ld', 'ld.id', 'ls.department_id')
      .where('e.username', username)
      .where('e.password', password)
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