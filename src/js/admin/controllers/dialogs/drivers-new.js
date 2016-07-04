'use strict'; 

angular.module('app.admin.controllers.dialogs.DriverNew', [])
  .controller('DriverNewCtrl', ($scope, $mdDialog, $mdToast, DriverService, EmployeeService) => {
  
    $scope.hide = function () {
      $mdDialog.hide();
    };

    $scope.cancel = function () {
      $mdDialog.cancel();
    };

    EmployeeService.getTitle()
      .then(res => {
        let data = res.data;
        $scope.titles = data.rows;
      }, () => {
        // connection error
      });
    
    $scope.save = () => {
      if ($scope.driver.titleId && $scope.driver.firstName && $scope.driver.lastName) {
        DriverService.save($scope.driver)
          .then(res => {
            let data = res.data;
            if (data.ok) {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('Saved!')
                  .position('right top')
                  .hideDelay(3000)
              );
              $mdDialog.hide();
            } else {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('เกิดข้อผิดพลาด: ' + JSON.stringify(data.msg))
                  .position('right top')
                  .hideDelay(3000)
              );
            }
          }, () => {
            $mdToast.show(
              $mdToast.simple()
                .textContent('Connection failed!')
                .position('right top')
                .hideDelay(3000)
            );
          });
      } else {
        $mdToast.show(
          $mdToast.simple()
            .textContent('กรุณาระบุข้อมูลให้ครบถ้วน')
            .position('right top')
            .hideDelay(3000)
        );
      }
    }
    
  });