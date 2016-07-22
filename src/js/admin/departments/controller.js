'use strict';

angular.module('app.Department.Controller', [])
  .controller('DepartmentCtrl', ($scope, $rootScope, $mdDialog, $mdToast, DepartmentService) => {

    $rootScope.showLoading = false;

    $scope.getList = () => {
      $rootScope.showLoading = true;
      $scope.departments = [];

      DepartmentService.getList()
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
      var confirm = $mdDialog.prompt()
        .title('ระบุชื่อหน่วยงาน?')
        .textContent('ระบุชื่อหน่วยงานที่ต้องการเพิ่ม')
        .placeholder('...')
        .ariaLabel('Department name')
        .targetEvent(ev)
        .ok('ตกลง')
        .cancel('ยกเลิก');

      $mdDialog.show(confirm).then(function (result) {
         if (result) {
           DepartmentService.save(result)
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

      });
    };

    $scope.edit = (ev, department) => {
      let name = prompt('ระบุชื่อหน่วยงานใหม่', department.name);
      let id = department.id;
      //let name = department.name;

      if (name) {
            DepartmentService.update(id, name)
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
        DepartmentService.remove(department.id)
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

  });