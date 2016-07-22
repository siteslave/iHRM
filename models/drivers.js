'use strict';

module.exports = {
  save(db, driver) {
    return db('drivers')
      .insert(driver);
  },
  update(db, driverId, driver) {
    return db('drivers')
      .update(driver)
      .where('id', driverId);
  },
  list(db) {
    return db('drivers as d')
      .select('d.*', 't.name as title_name')
      .leftJoin('l_titles as t', 't.id', 'd.title_id');
  },

  remove(db, driverId) {
    return db('drivers')
      .where('id', driverId)
      .del();
  }
}