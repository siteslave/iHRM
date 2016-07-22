'use strict';

angular.module('app.users.services.Meetings', [])
  .factory('MeetingsService', ($http, Configure) => {

    let url = Configure.getUrl();

    return {

      getTransport() {
        let _url = `/basic/transport`;
        return $http.get(_url);
      },

      getMoney() {
        let _url = `/basic/money`;
        return $http.get(_url);
      },

      getTypeMeetings() {
        let _url = `/basic/type-meetings`;

        return $http.get(_url);
      },

      register(meetingId) {
        let _url = `/users/meetings/register`;
        return $http.post(_url, {meetingId: meetingId});
      },

      list(limit, offset) {
        let _url = `/users/meetings/assign/list`;
        return $http.post(_url, { limit: limit, offset: offset });
      },

      total() {
        let _url = `/users/meetings/assign/total`;
        return $http.post(_url);
      },

      registerList(limit, offset) {
        let _url = `/users/meetings/register/list`;
        return $http.post(_url, { limit: limit, offset: offset });
      },

      registerTotal() {
        let _url = `/users/meetings/register/total`;
        return $http.post(_url);
      },

      cancelRegister(meetingId) {
        let _url = `/users/meetings/register/cancel/${meetingId}`;
        return $http.delete(_url);
      },

      saveRegister(meeting) {
        let _url = `/users/meetings/register`;
        return $http.post(_url, meeting);
      },

      updateRegister(meeting) {
        let _url = `/users/meetings/register`;
        return $http.put(_url, meeting);
      },

      search(query) {
        let _url = `/users/meetings/search`;
        return $http.post(_url, { query: query });
      }
    }

  });
