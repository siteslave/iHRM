'use strict'; 

angular.module('app.Reports.Meeting.Service', [])
  .factory('ReportsMeetingService', ($http) => {
    return {
      getList(start, end) {
        return $http.post('/admin/reports/meetings/list', { start: start, end: end });
      }   
    }
  });