'use strict';

angular.module('app.Driver.Service', [])
  .factory('DriverService', ($http) => {
    return {
      list() {
        return $http.post('/admin/drivers/list');
      }, 
      save(driver) {
        return $http.post('/admin/drivers', driver);
      },
      update(driver) {
        return $http.put('/admin/drivers', driver);
      }, 
      remove(id) {
        return $http.delete('/admin/drivers/' + id);
      }
    }
  })