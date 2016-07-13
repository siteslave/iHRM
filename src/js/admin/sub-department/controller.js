'use strict';

angular.module('app.SubDepartment.Controller', [])
  .controller('SubDepartmentCtrl', ($scope, $rootScope, $mdDialog, $mdToast,
    SubDepartmentService, DepartmentService) => {

    $rootScope.showLoading = false;
    $rootScope.mainDeps = [];

    $scope.getDepartmentList = () => {
      DepartmentService.getList()
        .then(data => $rootScope.mainDeps = data.rows)
    };

    $scope.getSubDepartment = () => {
      console.log($scope.mainDepId);
      $scope.getListById($scope.mainDepId);
    };

    $scope.getList = () => {
      $rootScope.showLoading = true;
      $scope.departments = [];

      SubDepartmentService.getList()
        .then(data => {
          if (data.ok) {
            //console.log(data.rows);
            $scope.departments = data.rows;
            $rootScope.showLoading = false;
          } else {
            console.log(data.msg);
            $rootScope.showLoading = false;
          }
        }, err => {
          console.log(err);
          $rootScope.showLoading = false;
        });
    };

    $scope.getListById = (id) => {
      $rootScope.showLoading = true;
      $scope.departments = [];

      SubDepartmentService.getListById(id)
        .then(data => {
          if (data.ok) {
            //console.log(data.rows);
            $scope.departments = data.rows;
            $rootScope.showLoading = false;
          } else {
            console.log(data.msg);
            $rootScope.showLoading = false;
          }
        }, err => {
          console.log(err);
          $rootScope.showLoading = false;
        });
    };

    $scope.addNew = (ev) => {

      $mdDialog.show({
        controller: 'DialogSubDepartmentCtrl',
        templateUrl: '/partials/admin/sub-department/dialog/new',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false
      })
        .then(function () {
          $scope.getList();
        }, function () {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    $scope.edit = (ev, department) => {

      $rootScope.currentSup = department;

      $mdDialog.show({
        controller: 'DialogSubDepartmentUpdateCtrl',
        templateUrl: '/partials/admin/sub-department/dialog/new',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false
      })
        .then(function () {
          $scope.getList();
        }, function () {
          $scope.status = 'You cancelled the dialog.';
        });
    };

    $scope.remove = (department) => {

      var confirm = $mdDialog.confirm()
        .title('Are you sure?')
        .textContent('คุณต้องการลบรายการ "' + department.name + '" ใช่หรือไม่?')
        .ariaLabel('Confirmation')
        .ok('ใช่, ฉันต้องการลบ!')
        .cancel('ไม่ใช่, ยกเลิก');

      $mdDialog.show(confirm).then(function () {
        $rootScope.showLoading = true;
        // remove
        SubDepartmentService.remove(department.id)
          .then(data => {
            if (data.ok) {
              $mdToast.show(
                $mdToast.simple()
                  .textContent(department.name + ' deleted!')
                  .position('right top')
                  .hideDelay(3000)
              );
              $rootScope.showLoading = false;
              // Get new list
              $scope.getList();

            } else {
              $rootScope.showLoading = false;
              $mdToast.show(
                $mdToast.simple()
                  .textContent('Error: ' + JSON.stringify(data.msg))
                  .position('right top')
                  .hideDelay(3000)
              );
            };
          }, err => {
            $rootScope.showLoading = false;
            $mdToast.show(
              $mdToast.simple()
                .textContent('Error: ' + JSON.stringify(err))
                .position('right top')
                .hideDelay(3000)
            );
          });

      }, function () {
        // cancel
      });

    };

    $scope.getList();
    $scope.getDepartmentList();

  });