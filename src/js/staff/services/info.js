'use strict';

angular.module('app.staff.services.Info', [])
  .factory('InfoService', ($http, Configure) => {

    let url = Configure.getUrl();

    return {
      getInfo() {
        let _url = `${url}/staff/info`;

        return $http.post(_url);
      },

      changePassword(password) {
        let _url = `${url}/staff/changepass`;

        return $http.post(_url, {password: password});
      }
    }
  });