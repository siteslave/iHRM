'use strict';

angular.module('app.admin.controllers.dialogs.EmployeeUpdate', [])
  .controller('EmployeeUpdateCtrl', ($scope, $rootScope, $mdDialog, $mdToast, EmployeeService) => {

    $scope.employee = {};
    $scope.isUpdate = true;

    let employee = $rootScope.currentEmployee;

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

    EmployeeService.getSubDepartment(employee.main_id)
      .then(res => {
        let data = res.data;
        $scope.subDepartments = data.rows;
      }, () => {
        // connection error
      });

    $scope.employee.firstName = employee.first_name;
    $scope.employee.lastName = employee.last_name;
    $scope.employee.title = employee.title_id;
    $scope.employee.position = employee.position_id;
    $scope.employee.username = employee.username;
    $scope.employee.mainDepId = employee.main_id;
    $scope.employee.subDepId = employee.sub_id;
    $scope.employee.id = employee.id;

    //console.log($scope.employee);


    $scope.save = () => {
      //console.log($scope.employee);
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
    };


    $scope.hide = function () {
      $mdDialog.hide();
    };
    $scope.cancel = function () {
      $mdDialog.cancel();
    };

  });