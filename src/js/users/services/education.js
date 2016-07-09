'use strict'; 

angular.module('app.users.services.Education', [])
  .factory('EducationService', ($http) => {
    return {
      list(limit, offset) {
        return $http.post('/users/education/list', { limit: limit, offset: offset });
      },
      total() {
        return $http.post('/users/education/total');
      },
      save(education) {
        return $http.post('/users/education', education);
      },
      update(education) {
        return $http.put('/users/education', education)
      },
      remove(id) {
        return $http.delete('/users/education/' + id);
      }
    }
  });