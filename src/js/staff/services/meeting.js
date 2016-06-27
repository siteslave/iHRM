'use strict';

angular.module('app.staff.services.Meeting', [])
  .factory('MeetingService', ($http, Configure) => {
    let url = Configure.getUrl();

     return {
       list(employeeId, startDate, endDate, limit, offset) {
         let _url = `${url}/staff/meeting/list`;
         return $http.post(_url, {
           employeeId: employeeId,
           start: startDate,
           end: endDate,
           limit: limit,
           offset: offset
         });
       },

       total(employeeId, startDate, endDate) {
         let _url = `${url}/staff/meeting/total`;
         return $http.post(_url, {
           employeeId: employeeId,
           start: startDate,
           end: endDate
         });
       }
     }
  });