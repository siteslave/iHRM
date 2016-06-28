'use strict';

angular.module('app.admin.services.Staff', [])
  .factory('StaffService', ($http, Configure) => {
     let url = Configure.getUrl();

     return {
       list(limit, offset) {
         let _url = `/admin/staff/list`;
         return $http.post(_url, {limit: limit, offset: offset});
       },

       total() {
         let _url = `/admin/staff/total`;
         return $http.post(_url);
       },

       save(staff) {
         let _url = `/admin/staff`;
         return $http.post(_url, staff);
       },

       update(staff) {
         let _url = `/admin/staff`;
         return $http.put(_url, staff);
       },

       detail(staffId) {
         let _url = `/admin/staff/detail/${staffId}`;
         return $http.get(_url);
       },

       search(query) {
         let _url = `/admin/staff/search`;
         return $http.post(_url, {query: query});
       },

       changePassword(staffId, password) {
         let _url = `/admin/staff/changepass`;
         return $http.post(_url, { staffId: staffId, password: password });
       },

       remove(staffId) {
         let _url = `/admin/staff/${staffId}`;
         return $http.delete(_url, { staffId: staffId });
       }

     }
  });