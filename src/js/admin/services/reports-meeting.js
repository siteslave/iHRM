'use strict'; 

angular.module('app.admin.services.ReportsMeeting', [])
  .factory('ReportsMeetingService', ($http) => {
    return {
      getList(start, end) {
        return $http.post('/admin/reports/meetings/list', { start: start, end: end });
      }   
    }
  });