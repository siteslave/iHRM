'use strict';

let Q = require('q');

module.exports = {
  list(db) {
    let q = Q.defer();
    db('car_license')
      .orderBy('name')
      .then(rows => q.resolve(rows))
      .catch(err => q.reject(err));

    return q.promise;
  },

  duplicated(db, id, name) {
    let q = Q.defer();
    db('car_license')
      .count('* as total')
      .whereNot('id', id)
      .where('name', name)
      .then(rows => q.resolve(rows[0].total))
      .catch(err => q.reject(err));

    return q.promise;
  },

  save(db, name) {
    let q = Q.defer();
    db('car_license')
      .insert({ name: name })
      .then(() => q.resolve())
      .catch(err => q.reject(err));

    return q.promise;
  },

  update(db, id, name) {
    let q = Q.defer();
    db('car_license')
      .update({ name: name })
      .where('id', id)
      .then(() => q.resolve())
      .catch(err => q.reject(err));

    return q.promise;
  },

  remove(db, id) {
    let q = Q.defer();
    db('car_license')
      .where('id', id)
      .del()
      .then(() => q.resolve())
      .catch(err => q.reject(err));

    return q.promise;
  }

};