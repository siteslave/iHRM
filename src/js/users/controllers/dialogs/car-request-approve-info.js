'use strict';

angular.module('app.users.controllers.dialogs.CarRequestApproveInfo', [])
  .controller('CarRequestApproveInfoCtrl', ($scope, $rootScope, $mdDialog) => {
    console.log($rootScope.currentApprove);
    $scope.carLicense = $rootScope.currentApprove.carLicense;
    $scope.driverName = $rootScope.currentApprove.driverName;

    $scope.hide = function () {
      $mdDialog.hide();
    };

    $scope.cancel = function () {
      $mdDialog.cancel();
    };
    
  });