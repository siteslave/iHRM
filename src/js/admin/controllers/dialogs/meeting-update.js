'use strict';

angular.module('app.admin.controllers.dialogs.UpdateMeetings', ['app.admin.services.Meeting'])
  .controller('UpdateMeetingsCtrl', ($scope, $mdDialog, $mdToast, MeetingService) => {

    $scope.hide = function () {
      $mdDialog.hide();
    };
    $scope.cancel = function () {
      $mdDialog.cancel();
    };

    // Get type meetings
    MeetingService.getTypeMeetings()
      .then(res => {
        let data = res.data;
        $scope.typeMeetings = data.rows;
      })
      .catch(err => {
        $mdToast.show(
          $mdToast.simple()
          .textContent('Error: ' + JSON.stringify(err))
          .position('right top')
          .hideDelay(3000)
        );
      });

    // save meetings
    $scope.save = () => {
      // console.log($scope.meetings);
      MeetingService.save($scope.meetings)
        .then(res => {
          let data = res.data;
          console.log(res);
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
              .textContent('Error: ' + JSON.stringify(data.msg))
              .position('right top')
              .hideDelay(3000)
            );
          }
        }, err => {
          $mdToast.show(
            $mdToast.simple()
            .textContent('Error: ' + JSON.stringify(err))
            .position('right top')
            .hideDelay(3000)
          );
        });
    }

  });
