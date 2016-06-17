'use strict';

angular.module('app.admin.services.Meeting', [])
  .factory('MeetingService', ($http, Configure) => {

    let url = Configure.getUrl();

    return {
      getTypeMeetings() {
        let _url = `${url}/basic/type-meetings`;

        return $http.get(_url);
      },
      update(meetings) {
        let _url = `${url}/admin/meetings/save`;

        return $http.put(_url, meetings);
      },
      save(meetings) {
        let _url = `${url}/admin/meetings/save`;

        return $http.post(_url, meetings);
      },

      assign(id, departments) {
        let _url = `${url}/admin/meetings/assign`;

        return $http.post(_url, {id: id, departments: departments});
      },

      assignList(id) {
        let _url = `${url}/admin/meetings/assign/department`;

        return $http.post(_url, {id: id});
      },

      list(limit, offset) {
        let _url = `${url}/admin/meetings/list`;
        return $http.post(_url, { limit: limit, offset: offset });
      },

      search(query) {
        let _url = `${url}/admin/meetings/search`;
        return $http.post(_url, { query: query });
      },

      remove(id) {
        let _url = `${url}/admin/meetings/delete/${id}`;
        return $http.delete(_url);
      },

      total() {
        let _url = `${url}/admin/meetings/total`;
        return $http.post(_url);
      }

    }
  });
