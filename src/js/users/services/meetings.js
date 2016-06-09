'use strict';

angular.module('app.users.services.Meetings', [])
  .factory('MeetingsService', ($http, Configure) => {

    let url = Configure.getUrl();

    return {
      getMoney() {
        let _url = `${url}/basic/money`;
        return $http.get(_url);
      },

      save(meeting) {
        let _url = `${url}/users/meetings/save`;

        let data = {};
        data.end = moment(meeting.end).format('YYYY-MM-DD');
        data.money_id = meeting.money_id;
        data.owner = meeting.owner;
        data.place = meeting.place;
        data.price = meeting.price;
        data.score = meeting.score;
        data.start = moment(meeting.start).format('YYYY-MM-DD');
        data.title = meeting.title;

        return $http.post(_url, data);
      },

      list(limit, offset) {
        let _url = `${url}/users/meetings/list`;
        return $http.post(_url, { limit: limit, offset: offset });
      },

      total() {
        let _url = `${url}/users/meetings/total`;
        return $http.post(_url);
      }
    }

  });