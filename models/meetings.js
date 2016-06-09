'use strict';

module.exports = {

  save(db, meeting) {
    return db('meetings')
      .insert(meeting);
  },

  total(db) {
    return db('meetings')
      .count('* as total');
  },

  list(db, limit, offset) {

    return db('meetings')
      .select()
      .limit(limit)
      .offset(offset);
  },

};