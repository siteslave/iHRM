'use strict';

module.exports = {

  getJobHistory(db, employeeCode, start, end) {
    return db('service_type_attendances')
      .where('employee_code', employeeCode)
      .whereBetween('date_serve', [start, end]);
  },

  getJobAllowed(db) {
    let sql = `select amonth, ayear, concat(ayear, amonth) as yyyymm
              from service_time_allow
              where is_allow="Y"
              order by yyyymm desc`;
    return db.raw(sql, []);
  },

  removeOldJob(db, employeeCode, start, end) {
    return db('service_type_attendances')
      .where('employee_code', employeeCode)
      .whereBetween('date_serve', [start, end])
      .del();
  },

  saveJob(db, data) {
    return db('service_type_attendances')
      .insert(data);
  },

  getEmployeeDetail(db, employeeCode) {

    return db('employees as e')
      .select('e.employee_code', 'e.first_name', 'e.last_name', 'e.cid', 'e.id', 'e.username', 't.name as title_name',
      'p.name as position_name', 's.name as sub_name', 'd.name as main_name')
      .leftJoin('l_titles as t', 't.id', 'e.title_id')
      .leftJoin('l_positions as p', 'p.id', 'e.position_id')
      .leftJoin('l_sub_departments as s', 's.id', 'e.sub_department_id')
      .leftJoin('l_departments as d', 'd.id', 's.department_id')
      .where('e.employee_code', employeeCode)
      .limit(1);
  },


  getDetailForPrint(db, employee_code, start, end) {
    let sql = `

      select t.date_serve,
      (
        select in_morning from t_attendances where employee_code=t.employee_code and date_serve=t.date_serve
        and service_type='1'
      ) as in01,
      (
        select in_afternoon from t_attendances where employee_code=t.employee_code and date_serve=t.date_serve
        and service_type='2'
      ) as in02,
      (
        select in_evening from t_attendances where employee_code=t.employee_code and date_serve=t.date_serve
        and service_type='3'
      ) as in03,
      (
        select in_evening2 from t_attendances where employee_code=t.employee_code and date_serve=t.date_serve
        and service_type='3'
      ) as in03_2,
      (
        select out_morning from t_attendances where employee_code=t.employee_code and date_serve=t.date_serve
        and service_type='1'
      ) as out01,
      (
        select out_afternoon from t_attendances where employee_code=t.employee_code and date_serve=t.date_serve
        and service_type='2'
      ) as out02,
      (
        select out_afternoon2 from t_attendances where employee_code=t.employee_code and date_serve=t.date_serve
        and service_type='2'
      ) as out02_2,
      (
        select out_evening from t_attendances where employee_code=t.employee_code and date_serve=t.date_serve
        and service_type='3'
      ) as out03
      from t_attendances as t

      where t.employee_code=?
      and t.date_serve between ? and ?
      group by t.date_serve
      order by t.date_serve
    `;

    return db.raw(sql, [employee_code, start, end]);
  }

}