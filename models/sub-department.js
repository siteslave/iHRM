'use strict';

let Q = require('q');

module.exports = {
  list(db) {
    let q = Q.defer();
    db('l_sub_departments as s')
      .select('s.name as sub_name', 's.id as sub_id', 's.department_id as main_id', 'd.name as main_name')
      .leftJoin('l_departments as d', 'd.id', 's.department_id')
      .orderBy('s.name')
      .then(rows => q.resolve(rows))
      .catch(err => q.reject(err));

    return q.promise;
  },
  listByMain(db, mainId) {
    let q = Q.defer();
    db('l_sub_departments as s')
      .select('s.name as sub_name', 's.id as sub_id', 's.department_id as main_id', 'd.name as main_name')
      .leftJoin('l_departments as d', 'd.id', 's.department_id')
      .where('s.department_id', mainId)
      .orderBy('s.name')
      .then(rows => q.resolve(rows))
      .catch(err => q.reject(err));

    return q.promise;
  },

  duplicated(db, id, name) {
    let q = Q.defer();
    db('l_sub_departments')
      .count('* as total')
      .whereNot('id', id)
      .where('name', name)
      .then(rows => q.resolve(rows[0].total))
      .catch(err => q.reject(err));

    return q.promise;
  },

  save(db, id, name) {
    let q = Q.defer();
    db('l_sub_departments')
      .insert({
        name: name,
        department_id: id
      })
      .then(() => q.resolve())
      .catch(err => q.reject(err));

    return q.promise;
  },

  update(db, mainId, subId, name) {
    let q = Q.defer();
    db('l_sub_departments')
      .update({
        name: name,
        department_id: mainId
      })
      .where('id', subId)
      .then(() => q.resolve())
      .catch(err => q.reject(err));

    return q.promise;
  },

  remove(db, id) {
    let q = Q.defer();
    db('l_sub_departments')
      .where('id', id)
      .del()
      .then(() => q.resolve())
      .catch(err => q.reject(err));

    return q.promise;
  }

};