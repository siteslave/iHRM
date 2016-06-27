'use strict';

angular.module('app.users.services.Info', [])
.factory('InfoService', ($http, Configure) => {

  let url = Configure.getUrl();
  
  return {
    getInfo() {
      let _url = `${url}/users/meetings/info`;
      
      return $http.post(_url);
    },

    changePassword(password) {
      let _url = `${url}/users/meetings/changepass`;
      
      return $http.post(_url, {password: password});
    }
  }
});