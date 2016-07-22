'use strict';

angular.module('app.SubDepartment.Service', [])
  .factory('SubDepartmentService', ($q, $http, Configure) => {
    let url = Configure.getUrl();
    return {
      getList() {
        let q = $q.defer();
        let _url = `/admin/sub-department/list`;

        $http.get(_url)
          .success(data => q.resolve(data))
          .error(() => q.reject('Connection failed!'));

        return q.promise;
      },

      getListById(id) {
        let q = $q.defer();
        let _url = `/admin/sub-department/list/${id}`;

        $http.get(_url)
          .success(data => q.resolve(data))
          .error(() => q.reject('Connection failed!'));

        return q.promise;
      },

      save(mainId, name) {
        let q = $q.defer();
        let _url = `/admin/sub-department/save`;

        $http.post(_url, {id: mainId, name: name})
          .success((data) => q.resolve(data))
          .error(() => q.reject('Connection failed!'));

        return q.promise;
      },

      update(mainId, subId, name) {
        let q = $q.defer();
        let _url = `/admin/sub-department/save`;

        $http.put(_url, { mainId: mainId, subId: subId, name: name })
          .success((data) => q.resolve(data))
          .error(() => q.reject('Connection failed!'));

        return q.promise;
      },

      remove(id) {
        let q = $q.defer();
        let _url = `/admin/sub-department/remove/${id}`;

        $http.delete(_url)
          .success(data => q.resolve(data))
          .error(() => q.reject('Connection failed!'));

        return q.promise;
      }
    }
  });