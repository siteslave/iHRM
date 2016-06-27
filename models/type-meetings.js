'use strict';


module.exports = {
  list(db) {
    return db('l_type_meetings')
      .select()
      .orderBy('name');
  }
};