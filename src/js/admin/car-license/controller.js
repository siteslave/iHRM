'use strict';

angular.module('app.CarLicense.Controller', [])
  .controller('CarLicenseCtrl', ($scope, $rootScope, $mdDialog, $mdToast, CarLicenseService) => {

    $rootScope.showLoading = false;

    $scope.getList = () => {
      $rootScope.showLoading = true;
      $scope.licenses = [];

      CarLicenseService.getList()
        .then(data => {
          if (data.ok) {
            console.log(data.rows);
            $scope.licenses = data.rows;
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

      var confirm = $mdDialog.prompt()
        .title('ระบุชื่อตำแหน่ง?')
        .textContent('ระบุตำแหน่งที่ต้องการ.')
        .placeholder('...')
        .ariaLabel('Position name')
        // .initialValue('Buddy')
        .targetEvent(ev)
        .ok('ตกลง')
        .cancel('ยกเลิก');

      $mdDialog.show(confirm).then(function (name) {
        if (name) {
          CarLicenseService.save(name)
            .then(data => {
              if (data.ok) {
                $mdToast.show(
                  $mdToast.simple()
                    .textContent('Saved')
                    .position('right top')
                    .hideDelay(3000)
                );

                $scope.getList();

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
      }, function () {
        $scope.status = 'You didn\'t name your dog.';
      });


    };

    $scope.remove = (license) => {

      var confirm = $mdDialog.confirm()
        .title('Are you sure?')
        .textContent('คุณต้องการลบรายการ "' + license.name + '" ใช่หรือไม่?')
        .ariaLabel('Confirmation')
        .ok('ใช่, ฉันต้องการลบ!')
        .cancel('ไม่ใช่, ยกเลิก');

      $mdDialog.show(confirm).then(function () {
        $rootScope.showLoading = true;
        // remove
        CarLicenseService.remove(license.id)
          .then(data => {
            if (data.ok) {
              $mdToast.show(
                $mdToast.simple()
                  .textContent(license.name + ' deleted!')
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

    $scope.edit = (license) => {
      let name = prompt('ระบุชื่อหน่วยงานใหม่', license.name);
      let id = license.id;

      if (name) {
        CarLicenseService.update(id, name)
          .then(data => {
            if (data.ok) {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('เปลี่ยนข้อมูลเรียบร้อยแล้ว')
                  .position('right top')
                  .hideDelay(3000)
              );

              $scope.getList();

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

    $scope.getList();

  });