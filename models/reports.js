'use strict';

module.exports = {
  // รายงานสรุปแยกตามหัวข้อประชุม/อบรม
  reportByMeeting(db, meetingId) {
    let sql = `
    select mr.price, mr.register_date, mr.score,
    concat(t.name, " ", e.first_name, " ", e.last_name) as employee_name,
    p.name as position_name, m.name as money_name, ld.name as department_name
    from meeting_register as mr
    inner join meetings as mt on mt.id=mr.meeting_id
    left join employees as e on e.id=mr.employee_id
    left join l_titles as t on t.id=e.title_id
    left join l_positions as p on p.id=e.position_id
    left join l_money as m on m.id=mr.money_id
    left join l_sub_departments as ld on ld.id=e.sub_department_id
    where mr.approve_status='Y'
    and mr.meeting_id=?
    order by e.first_name, e.last_name
    `;

    return db.raw(sql, [meetingId]);

  },

  // รายงานสรุปแยกตามแผนก 
  reportByDepartment(db, departmentId, start, end) {
    let sql = `
      select mr.price, mr.register_date, mt.start_date, mt.end_date, mt.title, mt.place, mt.owner,
      mr.score, lt.name as type_meetings_name,
      concat(t.name, " ", e.first_name, " ", e.last_name) as employee_name,
      p.name as position_name, m.name as money_name, ld.name as department_name
      from meeting_register as mr
      inner join meetings as mt on mt.id=mr.meeting_id
      left join employees as e on e.id=mr.employee_id
      left join l_titles as t on t.id=e.title_id
      left join l_positions as p on p.id=e.position_id
      left join l_money as m on m.id=mr.money_id
      left join l_sub_departments as ld on ld.id=e.sub_department_id
      left join l_departments as d on d.id=ld.department_id
      left join l_type_meetings as lt on lt.id=mt.type_meetings_id
      where mr.approve_status='Y'
      and d.id=?
      and mt.start_date between ? and ?
      order by e.first_name, e.last_name
    `;

    return db.raw(sql, [departmentId, start, end])
  },

  getEmployeeNotMeetings(db, departmentId, start, end) {
    let sql = `
      select e.employee_code, t.name as title_name, e.first_name, e.last_name, s.name as sub_department_name
      from employees as e
      left join l_sub_departments as s on s.id=e.sub_department_id
      left join l_titles as t on t.id=e.title_id
      where e.id not in (select distinct employee_id from meeting_register where approve_status='Y' and register_date between ? and ?)
      and e.sub_department_id in (select id from l_sub_departments where department_id=?)
      order by e.sub_department_id, e.first_name
    `;

    return db.raw(sql, [start, end, departmentId])
  },

  // รายงานสรุปแยกตามรายชื่อเจ้าหน้าที่
  reportByEmployee(db, employeeId, start, end) {

  }
}