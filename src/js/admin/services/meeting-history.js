'use strict';

angular.module('app.admin.services.MeetingHistory', [])
  .factory('MeetingHistoryervice', ($http, Configure) => {
     let url = Configure.getUrl();

     return {
       list(id, startDate, endDate, limit, offset) {
         let _url = `${url}/admin/employee/history/list`;
         return $http.post(_url, {
           id: id,
           start: startDate,
           end: endDate,
           limit: limit,
           offset: offset
         });
       },

       total(id, startDate, endDate) {
         let _url = `${url}/admin/employee/history/total`;
         return $http.post(_url, {
           id: id,
           start: startDate,
           end: endDate
         });
       }
     }
  });