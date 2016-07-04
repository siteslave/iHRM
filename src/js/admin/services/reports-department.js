'use strict'; 

angular.module('app.admin.services.ReportsDepartment', [])
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