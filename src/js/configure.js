'use strict';

angular.module('app.Configure', [])
  .factory('Configure', ($q) => {
    return {
      getUrl() {
        return 'http://localhost:3000'
      }
    }
  });