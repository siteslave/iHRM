'use strict';
// work module

module.exports = {

  doProcess(db, start, end) {
    let sql = `
      select e.employee_code, concat(e.first_name, " ", e.last_name) as fullname,
      ls.name as department_name,
      (
        select count(distinct date_serve) as total
        from t_attendances as t
        where t.in_morning is not null
        and t.date_serve between '${start}' and '${end}'
        and t.employee_code=e.employee_code
      ) +
      (
        select count(distinct date_serve) as total
        from t_attendances as t
        where t.in_afternoon is not null
        and t.date_serve between '${start}' and '${end}'
        and t.employee_code=e.employee_code
      )
      +
      (
        select count(distinct date_serve) as total
        from t_attendances as t
        where (t.in_evening is not null or t.in_evening2 is not null)
        and t.date_serve between '${start}' and '${end}'
        and t.employee_code=e.employee_code
      ) as total_work,
      (
        select count(distinct date_serve) as total
        from t_attendances as t
        where t.service_type='1'
        and t.in_morning is not null
        and t.in_morning >= '08:45:59'
        and t.date_serve between '${start}' and '${end}'
        and t.employee_code=e.employee_code
      ) as total_late,
      (
        select count(distinct date_serve) as total
        from t_attendances as t
        where t.service_type='1'
        and t.in_morning is not null
        and t.out_morning <= '15:30:59' and t.out_morning is not null
        and t.date_serve between '${start}' and '${end}'
        and t.employee_code=e.employee_code
      ) as total_exit_before,
      (
        select count(distinct date_serve) as total
        from t_attendances as t
        where t.service_type='1' 
        and t.in_morning is not null 
        and t.out_morning is null
        and t.date_serve between '${start}' and '${end}'
        and t.employee_code=e.employee_code
      ) as total_not_exit

      from employees as e
      left join l_sub_departments as ls on ls.id=e.sub_department_id
      where e.is_active='Y'
      order by fullname
    `;
    // console.log(sql);
    return db.raw(sql, []);
  },

  doPrint(db, start, end) {
    let sql = `
      select e.employee_code, concat(e.first_name, " ", e.last_name) as fullname,
      ls.name as department_name,
      (
        select count(distinct date_serve) as total
        from t_attendances as t
        where t.in_morning is not null
        and t.date_serve between '${start}' and '${end}'
        and t.employee_code=e.employee_code
      ) +
      (
        select count(distinct date_serve) as total
        from t_attendances as t
        where t.in_afternoon is not null
        and t.date_serve between '${start}' and '${end}'
        and t.employee_code=e.employee_code
      )
      +
      (
        select count(distinct date_serve) as total
        from t_attendances as t
        where (t.in_evening is not null or t.in_evening2 is not null)
        and t.date_serve between '${start}' and '${end}'
        and t.employee_code=e.employee_code
      ) as total_work,
      (
        select count(distinct date_serve) as total
        from t_attendances as t
        where t.service_type='1'
        and t.in_morning is not null
        and t.in_morning >= '08:45:59'
        and t.date_serve between '${start}' and '${end}'
        and t.employee_code=e.employee_code
      ) as total_late,
      (
        select count(distinct date_serve) as total
        from t_attendances as t
        where t.service_type='1'
        and t.in_morning is not null
        and t.out_morning <= '15:30:59' and t.out_morning is not null
        and t.date_serve between '${start}' and '${end}'
        and t.employee_code=e.employee_code
      ) as total_exit_before,
      (
        select count(distinct date_serve) as total
        from t_attendances as t
        where t.service_type='1' 
        and t.in_morning is not null 
        and t.out_morning is null
        and t.date_serve between '${start}' and '${end}'
        and t.employee_code=e.employee_code
      ) as total_not_exit

      from employees as e
      left join l_sub_departments as ls on ls.id=e.sub_department_id
      where e.is_active='Y'
      order by e.employee_code
    `;
    // console.log(sql);
    return db.raw(sql, []);
  },

  getWorkLateDetail(db, employee_code, start, end) {
    let sql = `
      select *
      from t_attendances as t
      where t.service_type='1'
      and t.in_morning is not null
      and t.in_morning >= '08:45:59'
      and t.date_serve between ? and ?
      and t.employee_code=?
    `;

    return db.raw(sql, [start, end, employee_code]);
  },

  getExitDetail(db, employee_code, start, end) {
    let sql = `
      select *
      from t_attendances as t
      where t.service_type='1'
      and t.in_morning is not null
      and t.out_morning <= '15:30:59' and t.out_morning is not null
      and t.date_serve between ? and ?
      and t.employee_code=?
    `;

    return db.raw(sql, [start, end, employee_code]);
  },

  getNotExitDetail(db, employee_code, start, end) {
    let sql = `
      select *
      from t_attendances as t
      where t.service_type='1'
      and t.in_morning is not null
      and t.out_morning is null
      and t.date_serve between ? and ?
      and t.employee_code=?
    `;

    return db.raw(sql, [start, end, employee_code]);
  },

  getMeetingTotal(db, employee_code, start, end) {
    let sql = `
    select count(distinct mr.register_date) as total
    from meeting_register as mr
    where mr.employee_id=?
    and mr.register_date between ? and ?
    and mr.approve_status='Y'
    `;

    return db.raw(sql, [employee_code, start, end]);
  },

  getDetailForPrint(db, employee_code, start, end) {
    let sql = `

      select t.date_serve,
      (
        select in_morning from t_attendances where employee_code=t.employee_code and date_serve=t.date_serve
        and service_type='1' limit 1
      ) as in01,
      (
        select in_afternoon from t_attendances where employee_code=t.employee_code and date_serve=t.date_serve
        and service_type='2' limit 1
      ) as in02,
      (
        select in_evening from t_attendances where employee_code=t.employee_code and date_serve=t.date_serve
        and service_type='3' limit 1
      ) as in03,
      (
        select in_evening2 from t_attendances where employee_code=t.employee_code and date_serve=t.date_serve
        and service_type='3' limit 1
      ) as in03_2,
      (
        select out_morning from t_attendances where employee_code=t.employee_code and date_serve=t.date_serve
        and service_type='1' limit 1
      ) as out01,
      (
        select out_afternoon from t_attendances where employee_code=t.employee_code and date_serve=t.date_serve
        and service_type='2' limit 1
      ) as out02,
      (
        select out_afternoon2 from t_attendances where employee_code=t.employee_code and date_serve=t.date_serve
        and service_type='2' limit 1
      ) as out02_2,
      (
        select out_evening from t_attendances where employee_code=t.employee_code and date_serve=t.date_serve
        and service_type='3' limit 1
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