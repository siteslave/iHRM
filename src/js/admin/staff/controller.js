'use strict';

angular.module('app.Staff.Controller', [])
  .controller('StaffCtrl', ($scope, $rootScope, $mdDialog, $mdToast, StaffService) => {

    $scope.showLoading = false;
    $scope.showPaging = true;
    $scope.staffs = [];
    $scope.total = 0;

    $scope.query = {
      limit: 20,
      page: 1
    };

    $scope.onPaginate = (page, limit) => {
      console.log(page, limit);
      let offset = (page - 1) * limit;
      $scope.getList(limit, offset);
    };

    $scope.getTotal = () => {
      StaffService.total()
        .then(res => {
          let data = res.data;
          $scope.total = data.total;
        }, err => {
          // connection error
        });
    };

    $scope.initialData = () => {

      let limit = $scope.query.limit;
      let offset = ($scope.query.page - 1) * $scope.query.limit;

      $scope.getTotal();
      $scope.getList(limit, offset);
    };

    $scope.getList = (limit, offset) => {
      $scope.showLoading = true;
      $scope.showPaging = true;
      $scope.staffs = [];

      StaffService.list(limit, offset)
        .then(res => {
          let data = res.data;
          if (data.ok) {
            $scope.showLoading = false;

            data.rows.forEach(v => {
              let obj = {};
              obj.id = v.id;
              obj.fullname = `${v.title_name} ${v.first_name} ${v.last_name}`;
              obj.departmentName = v.department_name;
              obj.positionName = v.position_name;
              obj.activeStatus = v.active_status;

              $scope.staffs.push(obj);

            });

          } else {
            $scope.showLoading = false;
            console.log(data.msg);
          }
        });
    };


    $scope.doSearch = (event) => {
      if (event.charCode == 13) {
        $scope.showLoading = true;
        $scope.showPaging = false;
        $scope.staffs = [];

        if ($scope.searchQuery) {
          StaffService.search($scope.searchQuery)
            .then(res => {
              let data = res.data;
              if (data.ok) {
                $scope.showLoading = false;

                data.rows.forEach(v => {
                  let obj = {};
                  obj.id = v.id;
                  obj.fullname = `${v.title_name} ${v.first_name} ${v.last_name}`;
                  obj.departmentName = v.department_name;
                  obj.positionName = v.position_name;
                  obj.activeStatus = v.active_status;

                  $scope.staffs.push(obj);

                });

              } else {
                $scope.showLoading = false;
                console.log(data.msg);
              }
            });

        } else {
          $scope.initialData();
        }
      }

    };


    $scope.addNew = (ev) => {

      $mdDialog.show({
        controller: 'StaffNewCtrl',
        templateUrl: '/partials/admin/staff/dialog/new',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false
      })
        .then(() => {
          $scope.initialData();
        }, () => {

        });
    };


    $scope.update = (ev, staffId) => {
      $rootScope.staffId = staffId;

      $mdDialog.show({
        controller: 'StaffUpdateCtrl',
        templateUrl: '/partials/admin/staff/dialog/update',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false
      })
        .then(() => {
          $scope.initialData();
        }, () => {

        });
    };

    $scope.remove = (ev, staff) => {
      let id = staff.id;

      let confirm = $mdDialog.confirm()
        .title('Are you sure?')
        .textContent('คุณต้องการลบ "' + staff.fullname + '" หรือไม่?')
        .ariaLabel('Remove confirmation')
        .targetEvent(ev)
        .ok('ลบรายการ')
        .cancel('ยกเลิก');

      $mdDialog.show(confirm).then(() => {
        StaffService.remove(id)
          .then(res => {
            let data = res.data;
            if (data.ok) {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('Deleted!')
                  .position('right top')
                  .hideDelay(3000)
              );

              $scope.initialData();

            } else {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('ERROR: ' + JSON.stringify(data.msg))
                  .position('right top')
                  .hideDelay(3000)
              );
            }
          }, () => {
            $mdToast.show(
              $mdToast.simple()
                .textContent('ERROR: Connection error!')
                .position('right top')
                .hideDelay(3000)
            );
          });
      }, () => {
        // no action
      });

    };

    $scope.changePassword = (ev, staff) => {
      var confirm = $mdDialog.prompt()
        .title('เปลี่ยนรหัสผ่านใหม่?')
        .textContent('ระบุรหัสผ่านที่ต้องการเปลี่ยนสำหรับ "' + staff.fullname + '"')
        .placeholder('...')
        .ariaLabel('Department name')
        .targetEvent(ev)
        .ok('ตกลง')
        .cancel('ยกเลิก');

      $mdDialog.show(confirm).then(function (password) {
        StaffService.changePassword(staff.id, password)
          .then(res => {
            let data = res.data;
            if (data.ok) {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('Changed!')
                  .position('right top')
                  .hideDelay(3000)
              );
            } else {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('ERROR: ' + JSON.stringify(data.msg))
                  .position('right top')
                  .hideDelay(3000)
              );
            }
          }, () => {
            $mdToast.show(
              $mdToast.simple()
                .textContent('ERROR: Connection error!')
                .position('right top')
                .hideDelay(3000)
            );
          });
      });
    };

    $scope.initialData();

  });