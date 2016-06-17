'use strict';

angular.module('app.users.controllers.dialog.MeetingUpdate', [])
  .controller('MeetingUpdateCtrl', ($scope, $rootScope, $mdDialog, $mdToast, MeetingsService) => {

    $scope.meetings = $rootScope.currentMeeting;

    // $scope.transports = [];
    // $scope.money = [];

    MeetingsService.getMoney()
      .then(res => {
        let data = res.data;
        if (data.ok) {
          $scope.money = data.rows;
        }
      });

    MeetingsService.getTransport()
      .then(res => {
        let data = res.data;
        if (data.ok) $scope.transports = data.rows;
      });

    $scope.save = () => {
      // console.log($scope.meetings);
      MeetingsService.updateRegister($scope.meetings)
        .then(res => {
          let data = res.data;
          if (data.ok) {
            $mdToast.show(
              $mdToast.simple()
                .textContent('Saved!')
                .position('right top')
                .hideDelay(3000)
            );

            $mdDialog.hide();

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
              .textContent('ERROR: Connection error')
              .position('right top')
              .hideDelay(3000)
          );
        });
    };

    $scope.hide = function () {
      $mdDialog.hide();
    };

    $scope.cancel = function () {
      $mdDialog.cancel();
    };

  });