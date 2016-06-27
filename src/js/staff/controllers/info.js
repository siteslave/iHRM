'use strict';

angular.module('app.staff.controller.Info', ['app.staff.services.Info'])
  .controller('InfoCtrl', ($scope, $mdDialog, $mdToast, InfoService) => {

    $scope.info = {};
    $scope.getInfo = () => {
      InfoService.getInfo()
        .then(res => {
          let data = res.data;
          if (data.ok) {
            $scope.info = data.info;
          } else {
            $mdToast.show(
              $mdToast.simple()
                .textContent('เกิดข้อผิดพลาด : ' + JSON.stringify(data.msg))
                .position('right top')
                .hideDelay(3000)
            );
          }
        });
    };


    // change password
    $scope.changePassword = (ev) => {
      var confirm = $mdDialog.prompt()
        .title('ยืนยันการเปลี่ยนรหัสผ่าน?')
        .textContent('รหัสผ่านใหม่ที่คุณต้องการเปลี่ยน.')
        .placeholder('ตัวเลข 4 ตัวขึ้นไป')
        .ariaLabel('change-pass')
        .targetEvent(ev)
        .ok('เปลี่ยนรหัสผ่าน!')
        .cancel('ยกเลิก');

      $mdDialog.show(confirm).then(function (password) {
        if (password.length > 4) {
          InfoService.changePassword(password)
            .then(res => {
              let data = res.data;
              if (data.ok) {
                $mdToast.show(
                  $mdToast.simple()
                    .textContent('เปลี่ยนรหัสผ่านเสร็จเรียบร้อยแล้ว!')
                    .position('right top')
                    .hideDelay(3000)
                );
              } else {
                $mdToast.show(
                  $mdToast.simple()
                    .textContent('เกิดข้อผิดพลาด : ' + JSON.stringify(data.msg))
                    .position('right top')
                    .hideDelay(3000)
                );
              }
            })
        } else {
          $mdToast.show(
            $mdToast.simple()
              .textContent('เกิดข้อผิดพลาดในการเชื่อมต่อ!')
              .position('right top')
              .hideDelay(3000)
          );
        }
      }, function () {
        //
      });
    };

    $scope.getInfo();

  });