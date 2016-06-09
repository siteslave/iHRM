'use strict';

module.exports = {
  list(db) {
    return db('l_titles')
      .select();
  }
}