'use strict';

angular.module('app.AskPermission.Service', [])
  .factory('AskPermissionService', ($http) => {
    return {
      list(approveStatus, startDate, endDate, limit, offset) {
        return $http.post('/admin/ask-permission/list', {
          approveStatus: approveStatus,
          startDate: startDate,
          endDate: endDate,
          limit: limit,
          offset: offset
        });
      },

      total(approveStatus, startDate, endDate) {
        return $http.post('/admin/ask-permission/total', {
          approveStatus: approveStatus,
          startDate: startDate,
          endDate: endDate
        });
      },

      getEmployeeList(id) {
        return $http.post('/admin/ask-permission/employee-list', { id: id });
      },

      approve(approve) {
        return $http.put('/admin/ask-permission/approve', {
          askId: approve.askId,
          status: approve.status
        });
      },

      cancelApprove(requestId) {
        return $http.delete('/admin/ask-permission/approve/' + requestId);
      },

      remove(requestId) {
        return $http.delete('/admin/ask-permission/' + requestId);
      },


    }
  });