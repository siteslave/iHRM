'use strict';

angular.module('app.Staff.dialog.New', [])
  .controller('StaffNewCtrl', ($scope, $rootScope, $mdDialog, $mdToast, EmployeeService, StaffService) => {
    // console.log('initial new ctrl');

    $scope.staff = {};
    $scope.isUpdate = false;

    // $scope.getSubDepartment = () => {
    //   let mainId = $scope.employee.mainDepId;
    //   EmployeeService.getSubDepartment(mainId)
    //   .then(res => {
    //     let data = res.data;
    //     $scope.subDepartments = data.rows;
    //   }, () => {
    //     // connection error
    //   });
    // };

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

    // Save staff
    $scope.save = () => {
      console.log($scope.staff);
      $scope.staff.activeStatus = $scope.staff.active ? 'Y' : 'N';

      if ($scope.staff.firstName && $scope.staff.lastName &&
        $scope.staff.username && $scope.staff.password &&
        $scope.staff.departmentId) {
        StaffService.save($scope.staff)
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