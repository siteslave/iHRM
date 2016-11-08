'use strict';

module.exports = {
  list(db, employeeId, limit, offset) {
    return db('car_request as c')
      .select('c.*', 'cl.name as car_license_name', db.raw('concat(d.first_name, " ", d.last_name) as driver_name'))
      .leftJoin('drivers as d', 'd.id', 'c.driver_id')
      .leftJoin('car_license as cl', 'cl.id', 'c.car_license_id')
      .where('c.employee_id', employeeId)
      .orderBy('c.request_date', 'desc')
      .limit(limit)
      .offset(offset);
  }, 
  
  total(db, employeeId) {
    return db('car_request')
      .where('employee_id', employeeId)
      .count('* as total');
  },

  getPrintInfo(db, id) {
    let sql = `
    select c.*, concat(t.name, " ", e.first_name, " ", e.last_name) as fullname,
    p.name as position_name
    from car_request as c
    inner join employees as e on e.id=c.employee_id
    left join l_titles as t on t.id=e.title_id
    left join l_positions as p on p.id=e.position_id
    where c.id=?
    `;
    return db.raw(sql, [id]);
  },
  
  adminList(db, approveStatus, startDate, endDate, limit, offset) {
    return db('car_request as c')
      .select('c.id', 'c.target_name', 'cl.name as car_license_name',
        'c.cause', 'c.start_date', 'c.end_date', 'c.start_time', 'c.end_time',
        'c.request_date', 'c.car_license_id', 'c.driver_id', 't.name as title_name', 
        'e.first_name', 'e.last_name', 'c.approve_status')
        .leftJoin('employees as e', 'e.id', 'c.employee_id')
        .leftJoin('l_titles as t', 't.id', 'e.title_id')
        .leftJoin('car_license as cl', 'cl.id', 'c.car_license_id')
        .where('c.approve_status', approveStatus)
        .whereBetween('c.start_date', [startDate, endDate])
        .orderBy('c.start_date', 'desc')
        .limit(limit)
        .offset(offset);
  }, 
  
  adminTotal(db, approveStatus, startDate, endDate) {
    return db('car_request')
      .whereBetween('start_date', [startDate, endDate])
      .where('approve_status', approveStatus)
      .count('* as total');
  },
  
  adminApprove(db, requestId, approve) {
    return db('car_request')
      .where('id', requestId)
      .update(approve);
  },
  
  adminCancelApprove(db, requestId) {
    return db('car_request')
      .where('id', requestId)
      .update({
        approve_status: 'N',
        car_license_id: 0,
        driver_id: 0
      });
  },

  save(db, request) {
    return db('car_request')
      .insert(request);
  },

  update(db, requestId, request) {
    return db('car_request')
      .where('id', requestId)
      .update(request);
  },

  updateWithPermission(db, askPermissionId, request) {
    return db('car_request')
      .where('ask_permission_id', askPermissionId)
      .update(request);
  },

  remove(db, requestId) {
    return db('car_request')
      .where('id', requestId)
      .del();
  },

  removeWithPermission(db, askPermissionId) {
    return db('car_request')
      .where('ask_permission_id', askPermissionId)
      .del();
  },

  isExistWithPermission(db, askPermissionId) {
    return db('car_request')
      .count('* as total')
      .where('ask_permission_id', askPermissionId);
  }
}