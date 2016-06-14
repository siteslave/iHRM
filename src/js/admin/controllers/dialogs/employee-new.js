'use strict';

angular.module('app.admin.controllers.dialogs.EmployeeNew', [])
  .controller('EmployeeNewCtrl', ($scope, $rootScope, $mdDialog, $mdToast, EmployeeService) => {
    console.log('initial new ctrl');

    $scope.employee = {};
    $scope.isUpdate = false;

    $scope.getSubDepartment = () => {
      let mainId = $scope.employee.mainDepId;
      EmployeeService.getSubDepartment(mainId)
      .then(res => {
        let data = res.data;
        $scope.subDepartments = data.rows;
      }, () => {
        // connection error
      });
    };

    EmployeeService.getTitle()
      .then(res => {
        let data = res.data;

        $scope.titles = data.rows;
      }, () => {
        // connection error
      });

    EmployeeService.getPosition()
      .then(res => {
        let data = res.data;

        $scope.positions = data.rows;
      }, () => {
        // connection error
      });

    EmployeeService.getDepartment()
      .then(res => {
        let data = res.data;
        $scope.departments = data.rows;
      }, () => {
        // connection error
      });

    // Save employee
    $scope.save = () => {
      //console.log($scope.employee);
      if ($scope.employee.name && $scope.employee.username && $scope.employee.password) {
        EmployeeService.save($scope.employee)
          .then(res => {
            let data = res.data;
            if (data.ok) {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('บันทึกรายการเสร็จเรียบร้อยแล้ว')
                  .position('right top')
                  .hideDelay(3000)
              );
              $mdDialog.hide();
            } else {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('ERROR: ' + JSON.stringify(data.msg))
                  .position('right top')
                  .hideDelay(3000)
              );
            }
          }, () => {
            $mdToast.show(
              $mdToast.simple()
                .textContent('ERROR: Connection error')
                .position('right top')
                .hideDelay(3000)
            );
          });
      } else {
        $mdToast.show(
          $mdToast.simple()
            .textContent('ERROR: กรุณากรอกข้อมูลให้ครบถ้วน')
            .position('right top')
            .hideDelay(3000)
        );
      }
    };

    $scope.hide = function () {
      $mdDialog.hide();
    };
    $scope.cancel = function () {
      $mdDialog.cancel();
    };


  });