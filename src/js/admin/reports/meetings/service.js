'use strict'; 

angular.module('app.Reports.Meeting.Service', [])
  .factory('ReportsMeetingService', ($http) => {
    return {
      getList(start, end) {
        return $http.post('/admin/reports/meetings/list', { start: start, end: end });
      },

      getNotMeetingList(departmentId, start, end) {
        return $http.post('/admin/reports/meetings/not-meeting-list', { departmentId: departmentId, start: start, end: end });
      },
      getDepartmentList() {
        return $http.get('/admin/department/list');
      }

    }
  });