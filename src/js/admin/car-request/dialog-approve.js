'use strict';

angular.module('app.CareRequest.dialog.Approve', [])
  .controller('CarRequestApproveCtrl', ($scope, $rootScope, $mdDialog, $mdToast, DriverService, CarRequestService) => {
    
    $scope.drivers = [];

    $scope.hide = function () {
      $mdDialog.hide();
    };

    $scope.cancel = function () {
      $mdDialog.cancel();
    };

    // Get driver list 
    DriverService.list()
      .then(res => {
        let data = res.data;
        if (data.ok) {
          $scope.drivers = data.rows;
        }
      });
    
    $scope.driver = {};
    $scope.driver.requestId = $rootScope.currentRequest.id;
    $scope.driver.driverId = $rootScope.currentRequest.driverId;
    $scope.driver.carLicense = $rootScope.currentRequest.carLicense;
      
    $scope.approve = () => {
      CarRequestService.approve($scope.driver)
        .then(res => {
          let data = res.data;
          if (data.ok) {
            $mdToast.show(
              $mdToast.simple()
                .textContent('ทำรายการเสร็จเรียบร้อย')
                .position('right top')
                .hideDelay(3000)
            );
            $mdDialog.hide();
          } else {
            $mdToast.show(
              $mdToast.simple()
                .textContent('ไม่สามารถดำเนินการได้ :' + JSON.stringify(data.msg))
                .position('right top')
                .hideDelay(3000)
            );
          }
        });
    };

    $scope.cancelApprove = () => {
      CarRequestService.cancelApprove($scope.driver.requestId)
        .then(res => {
          let data = res.data;
          if (data.ok) {
            $mdToast.show(
              $mdToast.simple()
                .textContent('ทำรายการเสร็จเรียบร้อย')
                .position('right top')
                .hideDelay(3000)
            );
            $mdDialog.hide();
          } else {
            $mdToast.show(
              $mdToast.simple()
                .textContent('ไม่สามารถดำเนินการได้ :' + JSON.stringify(data.msg))
                .position('right top')
                .hideDelay(3000)
            );
          }
        });
    };

  });