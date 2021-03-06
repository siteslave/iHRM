'use strict';

angular.module('app.Position.Controller', [])
  .controller('PositionCtrl', ($scope, $rootScope, $mdDialog, $mdToast, PositionService) => {

    $rootScope.showLoading = false;

    $scope.getList = () => {
      $rootScope.showLoading = true;
      $scope.positions = [];

      PositionService.getList()
        .then(data => {
          if (data.ok) {
            //console.log(data.rows);
            $scope.positions = data.rows;
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
          PositionService.save(name)
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

    $scope.remove = (position) => {

      var confirm = $mdDialog.confirm()
        .title('Are you sure?')
        .textContent('คุณต้องการลบรายการ "' + position.name + '" ใช่หรือไม่?')
        .ariaLabel('Confirmation')
        .ok('ใช่, ฉันต้องการลบ!')
        .cancel('ไม่ใช่, ยกเลิก');

      $mdDialog.show(confirm).then(function () {
        $rootScope.showLoading = true;
        // remove
        PositionService.remove(position.id)
          .then(data => {
            if (data.ok) {
              $mdToast.show(
                $mdToast.simple()
                  .textContent(position.name + ' deleted!')
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

    $scope.edit = (position) => {
      let name = prompt('ระบุชื่อหน่วยงานใหม่', position.name);
      let id = position.id;

      if (name) {
        PositionService.update(id, name)
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