'use strict';

angular.module('app.Employee.dialog.Update', [])
  .controller('EmployeeUpdateCtrl', ($scope, $rootScope, $mdDialog, $mdToast, EmployeeService) => {

    $scope.employee = {};
    $scope.isUpdate = true;

    let _employee = $rootScope.currentEmployee;
    // console.log($rootScope.currentEmployee)
    $scope.employee.firstName = _employee.first_name;
    $scope.employee.lastName = _employee.last_name;
    $scope.employee.title = _employee.title_id;
    $scope.employee.position = _employee.position_id;
    $scope.employee.username = _employee.username;
    $scope.employee.mainDepId = _employee.main_id;
    $scope.employee.subDepId = _employee.sub_id;
    $scope.employee.cid = _employee.cid;
    $scope.employee.id = _employee.id;
    
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

    EmployeeService.getSubDepartment(_employee.main_id)
      .then(res => {
        let data = res.data;
        $scope.subDepartments = data.rows;
      }, () => {
        // connection error
      });

    $scope.save = () => {
      console.log($scope.employee);
      if ($scope.employee.firstName && $scope.employee.lastName &&
        $scope.employee.mainDepId && $scope.employee.subDepId &&
        $scope.employee.position && $scope.employee.title) {
        EmployeeService.update($scope.employee)
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
        alert('กรุณาระบุข้อมูลให้ครบถ้วน')
      }
    };


    $scope.hide = function () {
      $mdDialog.hide();
    };
    $scope.cancel = function () {
      $mdDialog.cancel();
    };

  });