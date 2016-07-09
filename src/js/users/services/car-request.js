'use strict';

angular.module('app.users.services.CarRequest', [])
  .factory('CarRequestService', ($http) => {
    return {
      list(limit, offset) {
        return $http.post('/users/car-request/list', { limit: limit, offset: offset });
      },

      total() {
        return $http.post('/users/car-request/total');
      },

      save(request) {
        return $http.post('/users/car-request', request);
      },

      remove(id) {
        return $http.delete('/users/car-request/' + id);
      },

      update(request) {
        return $http.put('/users/car-request', request);
      }
    }
  });