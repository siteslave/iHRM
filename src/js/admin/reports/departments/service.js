'use strict'; 

angular.module('app.Reports.Department.Service', [])
  .factory('ReportsDepartmentService', ($http) => {
    return {
      getDepartmentList() {
        return $http.get('/basic/department');
      },
      getList(department, start, end) {
        return $http.post('/admin/reports/department/list', { department: department, start: start, end: end });
      }   
    }
  });