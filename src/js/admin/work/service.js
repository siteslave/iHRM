angular.module('app.work.Service', [])
  .factory('WorkService', ($q, $http, Configure) => {

    let url = Configure.getUrl();

    return {
      doProcess(start, end) {
        let q = $q.defer();
        let _url = `/admin/works/process`;

        $http.post(_url, {start: start, end: end})
          .success(data => q.resolve(data))
          .error(() => q.reject('Connection failed!'));

        return q.promise;
      },
      getWorkLateDetail(employee_code, start, end) {
        let q = $q.defer();
        let _url = `/admin/works/worklate-detail`;

        $http.post(_url, {employee_code: employee_code, start: start, end: end})
          .success(data => q.resolve(data))
          .error(() => q.reject('Connection failed!'));

        return q.promise;
      },
      getExitDetail(employee_code, start, end) {
        let q = $q.defer();
        let _url = `/admin/works/exit-detail`;

        $http.post(_url, {employee_code: employee_code, start: start, end: end})
          .success(data => q.resolve(data))
          .error(() => q.reject('Connection failed!'));

        return q.promise;
      },
      getNotExitDetail(employee_code, start, end) {
        let q = $q.defer();
        let _url = `/admin/works/not-exit-detail`;

        $http.post(_url, {employee_code: employee_code, start: start, end: end})
          .success(data => q.resolve(data))
          .error(() => q.reject('Connection failed!'));

        return q.promise;
      }
    }

  });