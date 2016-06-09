'use strict';

module.exports = {
  list(db) {
    return db('l_positions')
      .select();
  }
}