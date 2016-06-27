'use strict';

angular.module('app.users.services.Reports', [])
.factory('ReportsService', ($http, Configure) => {

  let url = Configure.getUrl();

  return {
    list(startDate, endDate, limit, offset) {
      let _url = `${url}/users/meetings/reports/list`;
      return $http.post(_url, {
        start: startDate,
        end: endDate,
        limit: limit,
        offset: offset
      });
    },

    total(startDate, endDate) {
      let _url = `${url}/users/meetings/reports/total`;
      return $http.post(_url, {
        start: startDate,
        end: endDate
      });
    }
  }
});