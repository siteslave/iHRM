'use strict';

angular.module('app.AskPermission.dialog.Employees', [])
  .controller('AskPermissionDialogEmployeeCtrl', ($scope, $rootScope, $mdDialog) => {
    $scope.employees = $rootScope.currentEmployees;
    
    $scope.hide = function () {
      $mdDialog.hide();
    };

    $scope.cancel = function () {
      $mdDialog.cancel();
    };
    
  });