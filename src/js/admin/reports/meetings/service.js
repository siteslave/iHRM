'use strict'; 

angular.module('app.Reports.Meeting.Service', [])
  .factory('ReportsMeetingService', ($http) => {
    return {
      getList(start, end) {
        return $http.post('/admin/reports/meetings/list', { start: start, end: end });
      },

      getNotMeetingList(departmentId, start, end, positions) {
        return $http.post('/admin/reports/meetings/not-meeting-list', {
          departmentId: departmentId,
          start: start,
          end: end,
          positions: positions
        });
      },
      getDepartmentList() {
        return $http.get('/admin/department/list');
      },
      getPositionList(departmentId) {
        return $http.post('/admin/reports/employee-position/list', { departmentId: departmentId });
      }

    }
  });