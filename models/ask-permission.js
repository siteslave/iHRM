'use strict';

module.exports = {
  list(db, employeeId, limit, offset) {
    return db('ask_permission')
      .where('employee_id', employeeId)
      .orderBy('ask_date', 'desc')
      .limit(limit)
      .offset(offset);
  }, 
  
  total(db, employeeId) {
    return db('ask_permission')
      .where('employee_id', employeeId)
      .count('* as total');
  },

  
  getEmployeesList(db, id) {
    let sql = `
    select concat(t.name, " ", e.first_name, " ", e.last_name) as fullname, p.name as position_name
    from ask_permission_employee as ae
    inner join employees as e on e.id=ae.employee_id
    left join l_titles as t on t.id=e.title_id
    left join l_positions as p on p.id=e.position_id

    where ae.ask_permission_id=?
    order by ae.id
    `;

    return db.raw(sql, [id])

  },
  
  getEmployeeSelectedList(db, askId) {
    return db('ask_permission_employee as a')
      .select('e.id', 'e.first_name', 'e.last_name')
      .leftJoin('employees as e', 'e.id', 'a.employee_id')
      .where('a.ask_permission_id', askId);
  },
  
  getDriversList(db) {
    let sql = `select concat(t.name,d.first_name, " ", d.last_name) as fullname
      from drivers as d
      left join l_titles as t on t.id=d.title_id
      where d.is_active='Y'`;
    return db.raw(sql, []);
  },

  adminList(db, approveStatus, startDate, endDate, limit, offset) {
    return db('ask_permission as a')
      .select('a.id', 'a.target_name', 'a.cause', 'a.start_date', 'a.end_date', 'a.start_time', 'a.end_time',
        'a.ask_date', 't.name as title_name', 'e.first_name', 'e.last_name', 'a.approve_status')
      .leftJoin('employees as e', 'e.id', 'a.employee_id')
      .leftJoin('l_titles as t', 't.id', 'e.title_id')
      .where('a.approve_status', approveStatus)
      .whereBetween('a.start_date', [startDate, endDate])
      .orderBy('a.start_date', 'desc')
      .limit(limit)
      .offset(offset);
  }, 
  
  adminTotal(db, approveStatus, startDate, endDate) {
    return db('ask_permission')
      .whereBetween('start_date', [startDate, endDate])
      .where('approve_status', approveStatus)
      .count('* as total');
  },
  
  adminApprove(db, askId, approve) {
    return db('ask_permission')
      .where('id', askId)
      .update(approve);
  },
  
  adminCancelApprove(db, requestId) {
    return db('ask_permission')
      .where('id', requestId)
      .update({
        approve_status: 'N',
        approved_at: '',
        car_license: '',
        driver_id: ''
      });
  },

  save(db, request) {
    return db('ask_permission')
      .insert(request)
      .returning('id');
  },

  saveEmployee(db, employee) {
    return db('ask_permission_employee')
      .insert(employee);
  },

  removeEmployee(db, askId) {
    return db('ask_permission_employee')
      .where('ask_permission_id', askId)
      .del();
  },
  
  update(db, askId, ask) {
    return db('ask_permission')
      .where('id', askId)
      .update(ask);
  },

  remove(db, requestId) {
    return db('ask_permission')
      .where('id', requestId)
      .del();
  },

  getPrintInfo(db, id) {
    let sql = `
    select a.*, concat(t.name,e.first_name, " ", e.last_name) as fullname,
    p.name as position_name, timestampdiff(day, a.start_date, a.end_date)+1 as total_day
    from ask_permission as a
    inner join employees as e on e.id=a.employee_id
    left join l_titles as t on t.id=e.title_id
    left join l_positions as p on p.id=e.position_id
    where a.id=?
    `;

    return db.raw(sql, [id]);
  },

  getPrintEmployeeList(db, id) {
    let sql = `
    select concat(t.name,e.first_name, " ", e.last_name) as fullname, p.name as position_name
    from ask_permission_employee as ae
    inner join employees as e on e.id=ae.employee_id
    left join l_titles as t on t.id=e.title_id
    left join l_positions as p on p.id=e.position_id

    where ae.ask_permission_id=?
    order by ae.id
    `;

    return db.raw(sql, [id])

  }
}