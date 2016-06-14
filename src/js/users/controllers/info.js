'use strict';

angular.module('app.users.controllers.Info', ['app.users.services.Info'])
.controller('InfoCtrl', ($scope, InfoService, $mdDialog) => {
    $scope.info = {};
    $scope.getInfo = () => {
      InfoService.getInfo()
        .then(res => {
          let data = res.data;
          if (data.ok) {
            $scope.info = data.info;
          } else {
            console.log(data.msg);
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
                // success
              } else {
                alert('ERROR: ' + JSON.stringify(data.msg))
              }
          })
        } else {
          alert('กรุณาระบุรหัสผ่านมากกว่า 4 ตัวอักษร')
        }
      }, function () {
        //
      });
    };
  
  $scope.getInfo();

});