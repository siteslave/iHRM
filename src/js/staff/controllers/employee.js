'use strict';

angular.module('app.staff.controllers.Employee', ['app.staff.services.Employee'])
  .controller('EmployeeCtrl', ($scope, $state, EmployeeService) => {

    $scope.showLoading = false;
    $scope.showPaging = true;

    $scope.openMenu = ($mdOpenMenu, ev) => {
      $mdOpenMenu(ev);
    };

    $scope.query = {
      limit: 20,
      page: 1
    };

    $scope.onPaginate = (page, limit) => {
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
      $scope.getTotal();
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

    $scope.search = (ev) => {
      if (ev.charCode == 13) {
        if ($scope.searchQuery) {
          $scope.showPaging = false;
          $scope.showLoading = true;
          EmployeeService.search($scope.searchQuery)
            .then(res => {
              let data = res.data;
              if (data.ok) {
                $scope.showLoading = false;
                $scope.employees = data.rows;
              } else {
                $scope.showLoading = false;
                console.log(data.msg);
              }
            }, () => {

            });
        } else {

        }
      }
    }

    $scope.initialEmployee();

  });