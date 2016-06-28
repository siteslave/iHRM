'use strict';

angular.module('app.staff.services.Employee', [])
  .factory('EmployeeService', ($q, $http, Configure) => {

    let url = Configure.getUrl();

    return {
      search(query) {
        let _url = `/staff/search`;
        return $http.post(_url, {query: query});
      },

      list(limit, offset) {
        let _url = `/staff/list`;
        return $http.post(_url, {limit: limit, offset: offset});
      },

      total() {
        let _url = `/staff/total`;
        return $http.post(_url);
      }

    }
  });