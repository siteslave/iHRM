'use strict';

angular.module('app.SubDepartment.dialog.New', [])
  .controller('DialogSubDepartmentCtrl', ($scope, $rootScope, $mdDialog, $mdToast, SubDepartmentService) => {
    $scope.mainDeps = $rootScope.mainDeps;

    $scope.hide = function () {
      $mdDialog.hide();
    };
    $scope.cancel = function () {
      $mdDialog.cancel();
    };

    $scope.save = function () {

      if ($scope.depName && $scope.mainDepId) {
        SubDepartmentService.save($scope.mainDepId, $scope.depName)
          .then(data => {
            if (data.ok) {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('Saved')
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
          }, err => {
            $mdToast.show(
              $mdToast.simple()
                .textContent('ERROR: ' + JSON.stringify(err))
                .position('right top')
                .hideDelay(3000)
            );
          });
      }

    };
  });