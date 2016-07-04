'use strict';

angular.module('app.admin.controllers.Drivers', [
  'app.admin.services.Drivers',
  'app.admin.controllers.dialogs.DriverNew',
  'app.admin.controllers.dialogs.DriverUpdate',
  'app.admin.services.Employee'
])
  .controller('DriverCtrl', ($scope, $rootScope, $mdToast, $mdDialog, DriverService) => {
  
    $scope.drivers = [];
    $scope.isLoading = false;

    $scope.getList = () => {
      $scope.drivers = [];
      $scope.isLoading = true;
      DriverService.list()
        .then(res => {
          let data = res.data;
          $scope.drivers = data.rows;
        }, err => {
          $scope.isLoading = false;
          $mdToast.show(
            $mdToast.simple()
              .textContent('เกิดข้อผิดพลาดในการเชื่อมต่อ!')
              .position('right top')
              .hideDelay(3000)
          );
        });
      
    };

    $scope.addNew = (ev) => {
      $mdDialog.show({
        controller: 'DriverNewCtrl',
        templateUrl: '/partials/admin/drivers/dialog/new',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false
      })
        .then(() => {
          $scope.getList();
        }, () => {

        });
    };

    $scope.edit = (ev, driver) => {
      $rootScope.currentDriver = driver;

      $mdDialog.show({
        controller: 'DriverUpdateCtrl',
        templateUrl: '/partials/admin/drivers/dialog/new',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false
      })
        .then(() => {
          $scope.getList();
        }, () => {

        });
    };


    $scope.remove = (ev, driver) => {
      
      var confirm = $mdDialog.confirm()
        .title('Are sure?')
        .textContent('คุณต้องการลบรายการนี้ [' + driver.title_name + driver.first_name + ' ' + driver.last_name +'] ใช่หรือไม่?')
        .ariaLabel('Confirm delete')
        .targetEvent(ev)
        .ok('ใช่, ต้องการลบ!')
        .cancel('ไม่ใช่, ยกเลิก');
      
      $mdDialog.show(confirm).then(function () {
        DriverService.remove(driver.id)
          .then(res => {
            let data = res.data;
            if (data.ok) {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('ลบรายการเสร็จเรียบร้อยแล้ว!')
                  .position('right top')
                  .hideDelay(3000)
              );
              $mdDialog.hide();
              $scope.getList();
            } else {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('ไม่สามารถลบรายการได้ : ' + JSON.stringify(data.msg))
                  .position('right top')
                  .hideDelay(3000)
              );
            }
        })
      }, function () {
        //
      });
      
    };
    
    $scope.getList();

  });