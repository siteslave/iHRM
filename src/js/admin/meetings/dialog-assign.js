'use strict';

angular.module('app.Meeting.dialog.Assign', [])
  .controller('MeetingAssignCtrl', ($scope, $rootScope, $mdToast, $mdDialog, MeetingService, DepartmentService) => {
    
    $scope.id = $rootScope.currentMeeting.id;
    $scope.departmentSelected = [];
    $scope.selected = [];

    $scope.hide = function () {
      $mdDialog.hide();
    };

    $scope.cancel = function () {
      $mdDialog.cancel();
    };
    
    $scope.departments = [];

    MeetingService.assignList($scope.id)
      .then(res => {
        let data = res.data;
        data.rows.forEach(v => {
          $scope.selected.push(v.department_id);
        });
        return DepartmentService.getList();
      })
      .then(res => {
       
        res.rows.forEach(v => {
          let obj = {};
          obj.id = v.id;
          obj.name = v.name;
          $scope.departments.push(obj);
        });

      }, err => {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Error: Connection error')
            .position('right top')
            .hideDelay(3000)
        );
      });

    $scope.toggle = (id) => {
      let idx = $scope.selected.indexOf(id);
      if (idx > -1) {
        $scope.selected.splice(idx, 1);
      } else {
        $scope.selected.push(id);
      }
    };

    $scope.exist = (id) => {
      return $scope.selected.indexOf(id) > -1;
    };

    $scope.save = () => {
      //console.log($scope.selected);
      MeetingService.assign($scope.id, $scope.selected)
        .then(res => {
          $mdToast.show(
            $mdToast.simple()
              .textContent('Saved!')
              .position('right top')
              .hideDelay(3000)
          );
          $mdDialog.hide();
        }, err => {
          $mdToast.show(
            $mdToast.simple()
              .textContent('Error: Connection error!')
              .position('right top')
              .hideDelay(3000)
          );
        });
    }

  });