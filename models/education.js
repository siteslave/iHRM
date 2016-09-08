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
  list(db, limit, offset, employeeId) {
    return db('education_request')
      .where('deleted_status', 'N')
      .where('employee_id', employeeId)
      .limit(limit)
      .offset(offset)
      .orderBy('request_year', 'desc'); 
  },

  total(db, employeeId) {
    return db('education_request')
      .where('deleted_status', 'N')
      .where('employee_id', employeeId)
      .count('* as total');
  }
}