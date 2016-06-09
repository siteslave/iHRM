'use strict';

module.exports = {
  total(db) {
    return db('employees')
      .count('* as total');
  },

  list(db, limit, offset) {

    return db('employees as e')
      .select(
        'e.fullname', 'e.id', 'e.title_id', 'e.position_id', 'e.sub_department_id',
        'e.username', 'sd.department_id as main_id', 'sd.id as sub_id',
        'sd.name as sub_name', 't.name as title_name', 'p.name as position_name'
      )
      .leftJoin('l_titles as t', 't.id', 'e.title_id')
      .leftJoin('l_positions as p', 'p.id', 'e.position_id')
      .leftJoin('l_sub_departments as sd', 'sd.id', 'e.sub_department_id')
      .limit(limit)
      .offset(offset);
  },

  search(db, query) {

    let _query = `%${query}%`;
    return db('employees as e')
      .select(
      'e.fullname', 'e.id', 'e.title_id', 'e.position_id', 'e.sub_department_id',
      'e.username', 'sd.department_id as main_id', 'sd.id as sub_id',
      'sd.name as sub_name', 't.name as title_name', 'p.name as position_name'
      )
      .leftJoin('l_titles as t', 't.id', 'e.title_id')
      .leftJoin('l_positions as p', 'p.id', 'e.position_id')
      .leftJoin('l_sub_departments as sd', 'sd.id', 'e.sub_department_id')
      .where('fullname', 'like', _query);
  },

  save(db, employee) {
    return db('employees')
      .insert(employee);
  },

  update(db, employee) {
    return db('employees')
      .update({
        fullname: employee.fullname,
        title_id: employee.title_id,
        position_id: employee.position_id,
        sub_department_id: employee.sub_department_id
      })
      .where('id', employee.id);
  },

  changePassword(db, id, password) {
    return db('employees')
      .where('id', id)
      .update({ password: password });
  },

  remove(db, id) {
    return db('employees')
      .where('id', id)
      .del();
  },

  isDuplicated(db, id, fullname) {
    return db('employees')
      .count('* as total')
      .whereNot('id', id)
      .where('fullname', fullname);
  }
}