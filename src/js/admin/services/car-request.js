'use strict';

angular.module('app.admin.services.CarRequest', [])
  .factory('CarRequestService', ($http) => {
    return {
      list(approveStatus, startDate, endDate, limit, offset) {
        return $http.post('/admin/car-request/list', {
          approveStatus: approveStatus,
          startDate: startDate,
          endDate: endDate,
          limit: limit,
          offset: offset
        });
      },

      total(approveStatus, startDate, endDate) {
        return $http.post('/admin/car-request/total', {
          approveStatus: approveStatus,
          startDate: startDate,
          endDate: endDate
        });
      },

      approve(approve) {
        return $http.put('/admin/car-request/approve', {
          requestId: approve.requestId,
          carLicense: approve.carLicense,
          driverId: approve.driverId
        });
      },

      cancelApprove(requestId) {
        return $http.delete('/admin/car-request/approve/' + requestId);
      },

      remove(requestId) {
        return $http.delete('/admin/car-request/' + requestId);
      },


    }
  });