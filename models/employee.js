'use strict';

module.exports = {

  total(db) {
    return db('employees')
      .count('* as total');
  },

  list(db, limit, offset) {

    return db('employees as e')
      .select(
        'e.first_name', 'e.last_name', 'e.id', 'e.title_id', 'e.position_id', 'e.sub_department_id',
        'e.username', 'sd.department_id as main_id', 'sd.id as sub_id',
        'sd.name as sub_name', 't.name as title_name', 'p.name as position_name'
      )
      .leftJoin('l_titles as t', 't.id', 'e.title_id')
      .leftJoin('l_positions as p', 'p.id', 'e.position_id')
      .leftJoin('l_sub_departments as sd', 'sd.id', 'e.sub_department_id')
      .limit(limit)
      .offset(offset);
  },

  listAll(db) {

    return db('employees as e')
      .select(
      'e.first_name', 'e.last_name', 'e.id', 'e.title_id', 'e.position_id', 'e.sub_department_id',
      'e.username', 'sd.department_id as main_id', 'sd.id as sub_id',
      'sd.name as sub_name', 't.name as title_name', 'p.name as position_name'
      )
      .leftJoin('l_titles as t', 't.id', 'e.title_id')
      .leftJoin('l_positions as p', 'p.id', 'e.position_id')
      .leftJoin('l_sub_departments as sd', 'sd.id', 'e.sub_department_id')
      .orderBy('e.first_name');
  },

  search(db, query) {

    let _query = `%${query}%`;
    return db('employees as e')
      .select(
      'e.first_name', 'e.last_name', 'e.id', 'e.title_id', 'e.position_id', 'e.sub_department_id',
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
        first_name: employee.first_name,
        last_name: employee.last_name,
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

  isDuplicated(db, id, first_name, last_name) {
    return db('employees')
      .count('* as total')
      .whereNot('id', id)
      .where('first_name', first_name)
      .where('last_name', last_name);
  },

  getInfo(db, id) {

    return db('employees as e')
      .select('e.first_name', 'e.last_name', 'e.id', 'e.username', 't.name as title_name',
        'p.name as position_name', 's.name as sub_name', 'd.name as main_name')
      .leftJoin('l_titles as t', 't.id', 'e.title_id')
      .leftJoin('l_positions as p', 'p.id', 'e.position_id')
      .leftJoin('l_sub_departments as s', 's.id', 'e.sub_department_id')
      .leftJoin('l_departments as d', 'd.id', 's.department_id')
      .where('e.id', id);

  }
};