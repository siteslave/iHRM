'use strict';

angular.module('app.admin.controllers.dialogs.StaffUpdate', [])
  .controller('StaffUpdateCtrl', ($scope, $rootScope, $mdDialog, $mdToast, EmployeeService, StaffService) => {
    // console.log('initial new ctrl');

    $scope.staff = {};
    $scope.staffId = $rootScope.staffId;
    StaffService.detail($scope.staffId)
      .then(res => {
        let data = res.data;
        if (data.ok) {
          let staff = data.rows;
          $scope.staff.username = staff.username;
          $scope.staff.password = '111111';
          $scope.staff.firstName = staff.first_name;
          $scope.staff.lastName = staff.last_name;
          $scope.staff.titleId = staff.title_id;
          $scope.staff.departmentId = staff.department_id;
          $scope.staff.positionId = staff.position_id;
          $scope.staff.active = staff.active_status == 'Y' ? true : false;
        } else {
          console.log(data.msg);
        }
      }, () => {
        console.log('Connection failed');
      });

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
      $scope.staff.staffId = $scope.staffId;

      if ($scope.staff.firstName && $scope.staff.lastName) {
        StaffService.update($scope.staff)
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