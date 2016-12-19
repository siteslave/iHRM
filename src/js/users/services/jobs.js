'use strict';

angular.module('app.users.services.Job', [])
  .factory('JobService', ($q, $http, Configure) => {

    let url = Configure.getUrl();

    return {
      getDetail(year, month) {
        let _url = `/users/jobs/detail`;
        return $http.post(_url, { year: year, month: month });
      },

      // listAll() {
      //   let _url = `/users/jobs/list-all`;
      //   return $http.post(_url);
      // },

      save(year, month, data) {
        let _url = `/users/jobs/save`;
        return $http.post(_url, { year: year, month: month, data: data });
      },

      printTime(startDate, endDate) {
        let _url = `/users/jobs/print/${startDate}/${endDate}`;
        window.open(_url, '_blank');
      }

    }
  });