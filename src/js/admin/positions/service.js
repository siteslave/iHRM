'use strict';

angular.module('app.Position.Service', [])
  .factory('PositionService', ($q, $http, Configure) => {
    let url = Configure.getUrl();
    return {
      getList() {
        let q = $q.defer();
        let _url = `/admin/position/list`;

        $http.get(_url)
          .success(data => q.resolve(data))
          .error(() => q.reject('Connection failed!'));

        return q.promise;
      },

      save(name) {
        let q = $q.defer();
        let _url = `/admin/position/save`;

        $http.post(_url, {name: name})
          .success((data) => q.resolve(data))
          .error(() => q.reject('Connection failed!'));

        return q.promise;
      },

      update(id, name) {
        let q = $q.defer();
        let _url = `/admin/position/save`;

        $http.put(_url, { id: id, name: name })
          .success((data) => q.resolve(data))
          .error(() => q.reject('Connection failed!'));

        return q.promise;
      },

      remove(id) {
        let q = $q.defer();
        let _url = `/admin/position/remove/${id}`;

        $http.delete(_url)
          .success(data => q.resolve(data))
          .error(() => q.reject('Connection failed!'));

        return q.promise;
      }
    }
  });