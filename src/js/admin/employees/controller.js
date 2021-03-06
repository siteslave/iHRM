'use strict';

angular.module('app.Employee.Controller', [])
  .controller('EmployeeCtrl', ($scope, $state, $rootScope, $mdDialog, $mdToast, EmployeeService) => {

    $scope.showLoading = false;
    $scope.showPaging = true;

    $scope.openMenu = ($mdOpenMenu, ev) => {
      $mdOpenMenu(ev);
    };

    $scope.history = (e) => {
      console.log(e);
      $state.go('meeting-history', { id: e.id });
    };

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
      EmployeeService.total()
        .then(res => {
          let data = res.data;
          $scope.total = data.total;
        }, err => {
          // connection error
        });
    };

    $scope.initialEmployee = () => {

      let limit = $scope.query.limit;
      let offset = ($scope.query.page - 1) * $scope.query.limit;

      $scope.getList(limit, offset);
    };

    $scope.refresh = () => {
      $scope.initialEmployee();
    };

    $scope.getList = (limit, offset) => {
      $scope.showLoading = true;
      $scope.showPaging = true;
      EmployeeService.list(limit, offset)
        .then(res => {
          let data = res.data;
          if (data.ok) {
            $scope.showLoading = false;
            $scope.employees = data.rows;
          } else {
            $scope.showLoading = false;
            console.log(data.msg);
          }
        });
    };

    $scope.searchList = (query) => {
      $scope.showLoading = true;
      $scope.showPaging = false;
      EmployeeService.search(query)
        .then(res => {
          let data = res.data;
          if (data.ok) {
            $scope.showLoading = false;
            $scope.employees = data.rows;
          } else {
            $scope.showLoading = false;
            console.log(data.msg);
          }
        });
    };

    $scope.addNew = (ev) => {

      $mdDialog.show({
        controller: 'EmployeeNewCtrl',
        templateUrl: '/partials/admin/employee/dialog/new',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false
      })
        .then(() => {
          $scope.getTotal();
          $scope.initialEmployee();
        }, () => {

        });
    };

    $scope.remove = (ev, employee) => {
      let id = employee.id;

      let confirm = $mdDialog.confirm()
        .title('Are you sure?')
        .textContent(`คุณต้องการลบ ${employee.first_name} ${employee.last_name} หรือไม่?`)
        .ariaLabel('Remove confirmation')
        .targetEvent(ev)
        .ok('ลบรายการ')
        .cancel('ยกเลิก');

      $mdDialog.show(confirm).then(() => {
        EmployeeService.remove(id)
          .then(res => {
            let data = res.data;
            if (data.ok) {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('Deleted!')
                  .position('right top')
                  .hideDelay(3000)
              );

              $scope.getTotal();
              $scope.initialEmployee();

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

    $scope.edit = (ev, employee) => {
      console.log(employee)
      $rootScope.currentEmployee = employee;

      $mdDialog.show({
        controller: 'EmployeeUpdateCtrl',
        templateUrl: '/partials/admin/employee/dialog/new',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false
      })
        .then(() => {
          $scope.getTotal();
          $scope.initialEmployee();
        }, () => {

        });
    };

    $scope.changePassword = (ev, employee) => {
      var confirm = $mdDialog.prompt()
        .title('เปลี่ยนรหัสผ่าน')
        .textContent(`ระบุรหัสผ่านที่ต้องการเปลี่ยนสำหรับ ${employee.first_name} ${employee.last_name}`)
        .placeholder('...')
        .ariaLabel('Change password')
        .targetEvent(ev)
        .ok('ตกลง')
        .cancel('ยกเลิก');

      $mdDialog.show(confirm).then(function (password) {
        EmployeeService.changePassword(employee.id, password)
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

    $scope.doSearch = (e) => {
      if (e.charCode == 13) {
        if ($scope.searchQuery) {
          $scope.searchList($scope.searchQuery);
        } else {
          $scope.refresh();
        }
      }
    };

    $scope.getTotal();
    $scope.initialEmployee();

  });