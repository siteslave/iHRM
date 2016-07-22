'use strict';

angular.module('app.users.services.AskPermission', [])
  .factory('AskPermissionService', ($http) => {
    return {
      getEmployeeList() {
        return $http.post('/users/ask-permission/employee-list-all');
      },

      list(limit, offset) {
        return $http.post('/users/ask-permission/list', { limit: limit, offset: offset });
      },

      total() {
        return $http.post('/users/ask-permission/total');
      },

      save(ask) {
        return $http.post('/users/ask-permission', ask);
      },

      getEmployeeSelectedList(askId) {
        return $http.post('/users/ask-permission/get-employee-selected', { askId: askId });
      },
      
      remove(id) {
        return $http.delete('/users/ask-permission/' + id);
      },

      update(ask) {
        return $http.put('/users/ask-permission', ask);
      }
    }
  });