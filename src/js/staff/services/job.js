'use strict';

angular.module('app.staff.services.Job', [])
  .factory('JobService', ($q, $http, Configure) => {

    let url = Configure.getUrl();

    return {
      getDetail(employeeCode, year, month) {
        let _url = `/staff/job/detail`;
        return $http.post(_url, { employeeCode: employeeCode, year: year, month: month });
      },

      listAll() {
        let _url = `/staff/list-all`;
        return $http.post(_url);
      },

      save(employeeCode, year, month, data) {
        let _url = `/staff/job/save`;
        return $http.post(_url, { employeeCode: employeeCode, year: year, month: month, data: data });
      }

    }
  });