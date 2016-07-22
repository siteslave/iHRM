'use strict';

module.exports = {
  save(db, education) {
    return db('education_request')
      .insert(education);
  },
  update(db, educationId, education) {
    return db('education_request')
      .where('id', educationId)
      .update(education);
  },
  remove(db, educationId) {
    return db('education_request')
      .where('id', educationId)
      .update({deleted_status: 'Y'});
  },
  list(db, limit, offset) {
    return db('education_request')
      .where('deleted_status', 'N')
      .limit(limit)
      .offset(offset)
      .orderBy('request_year', 'desc'); 
  },

  total(db) {
    return db('education_request')
      .where('deleted_status', 'N')
      .count('* as total');
  }
}