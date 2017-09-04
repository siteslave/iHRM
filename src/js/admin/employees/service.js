'use strict';

angular.module('app.Employee.Service', [])
  .factory('EmployeeService', ($q, $http, Configure) => {

    // let url = Configure.getUrl();

    return {
      search(query) {
        let _url = `/admin/employee/search`;
        return $http.post(_url, {query: query});
      },

      list(limit, offset) {
        let _url = `/admin/employee/list`;
        return $http.post(_url, {limit: limit, offset: offset});
      },

      total() {
        let _url = `/admin/employee/total`;
        return $http.post(_url);
      },

      getTitle() {
        let _url = `/basic/title`;
        return $http.get(_url);
      },

      getPosition() {
        let _url = `/basic/position`;

        return $http.get(_url);
      },

      getDepartment() {
        let _url = `/basic/department`;

        return $http.get(_url);
      },

      getSubDepartment(id) {
        let _url = `/basic/sub-department/${id}`;

        return $http.get(_url);
      },

      save(employee) {
        let _url = `/admin/employee/save`;

        return $http.post(_url, {
          firstName: employee.firstName,
          lastName: employee.lastName,
          position: employee.position,
          department: employee.subDepId,
          title: employee.title,
          cid: employee.cid,
          username: employee.username,
          password: employee.password,
          isActive: employee.isActive
        });
      },

      update(employee) {
        let _url = `/admin/employee/save`;

        return $http.put(_url, {
          firstName: employee.firstName,
          lastName: employee.lastName,
          position: employee.position,
          department: employee.subDepId,
          title: employee.title,
          cid: employee.cid,
          id: employee.id,
          isActive: employee.isActive
        });
      },

      remove(id) {
        let _url = `/admin/employee/delete/${id}`;
        return $http.delete(_url);
      },

      changePassword(id, password) {
        let _url = `/admin/employee/changepass/`;
        return $http.put(_url, {id: id, password: password});
      }

    }
  });