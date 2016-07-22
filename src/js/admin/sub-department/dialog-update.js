'use strict';

angular.module('app.SubDepartment.dialog.Update', [])
  .controller('DialogSubDepartmentUpdateCtrl', ($scope, $rootScope, $mdDialog, $mdToast, SubDepartmentService) => {
    $scope.mainDeps = $rootScope.mainDeps;

    console.log($rootScope.currentSup);

    //{ sub_name: "e3ewessfdsf", sub_id: 6, main_id: 2, main_name: "ศูนย์ประกัน", $$hashKey: "object:50" }
    $scope.depName = $rootScope.currentSup.sub_name;
    $scope.mainDepId = $rootScope.currentSup.main_id;
    $scope.subDepId = $rootScope.currentSup.sub_id;

    $scope.hide = function () {
      $mdDialog.hide();
    };
    $scope.cancel = function () {
      $mdDialog.cancel();
    };

    $scope.save = function () {

      if ($scope.depName && $scope.mainDepId) {
        //update(mainId, subId, name)
        SubDepartmentService.update($scope.mainDepId, $scope.subDepId, $scope.depName)
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