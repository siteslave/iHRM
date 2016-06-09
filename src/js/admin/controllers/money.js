'use strict';

angular.module('app.admin.controllers.Money', ['app.admin.services.Money'])
  .controller('MoneyCtrl', ($scope, $rootScope, $mdDialog, $mdToast, MoneyService) => {

    $rootScope.showLoading = false;

    $scope.getList = () => {
      $rootScope.showLoading = true;
      $scope.money = [];

      MoneyService.getList()
        .then(data => {
          if (data.ok) {
            //console.log(data.rows);
            $scope.money = data.rows;
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
        .title('ระบุชื่องบประมาณ?')
        .textContent('งบประมาณที่ใช้ในการเข้าร่วมประชุม.')
        .placeholder('...')
        .ariaLabel('Money name')
        // .initialValue('Buddy')
        .targetEvent(ev)
        .ok('ตกลง')
        .cancel('ยกเลิก');

      $mdDialog.show(confirm).then(function (name) {
        if (name) {
          MoneyService.save(name)
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

    $scope.remove = (money) => {

      var confirm = $mdDialog.confirm()
        .title('Are you sure?')
        .textContent('คุณต้องการลบรายการ "' + money.name + '" ใช่หรือไม่?')
        .ariaLabel('Confirmation')
        .ok('ใช่, ฉันต้องการลบ!')
        .cancel('ไม่ใช่, ยกเลิก');

      $mdDialog.show(confirm).then(function () {
        $rootScope.showLoading = true;
        // remove
        MoneyService.remove(money.id)
          .then(data => {
            if (data.ok) {
              $mdToast.show(
                $mdToast.simple()
                  .textContent(money.name + ' deleted!')
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

    $scope.edit = (money) => {
      let name = prompt('ระบุชื่อหน่วยงานใหม่', money.name);
      let id = money.id;

      if (name) {
        MoneyService.update(id, name)
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