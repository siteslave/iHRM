'use strict';

angular.module('app.users.controllers.dialog.UpdateMeetings', [])
  .controller('UpdateMeetingsCtrl', ($scope, $rootScope, $mdDialog, $mdToast, MeetingsService) => {

    $scope.meetings = {};

    $scope.meetings.start = new Date(moment($rootScope.currentMeeting.start_date, 'DD/MM/YYYY').format());
    $scope.meetings.end = new Date(moment($rootScope.currentMeeting.end_date, 'DD/MM/YYYY').format());
    $scope.meetings.title = $rootScope.currentMeeting.meeting_title;
    $scope.meetings.place = $rootScope.currentMeeting.meeting_place;
    $scope.meetings.owner = $rootScope.currentMeeting.meeting_owner;
    $scope.meetings.money_id = $rootScope.currentMeeting.money_id;
    $scope.meetings.price = $rootScope.currentMeeting.price;
    $scope.meetings.score = $rootScope.currentMeeting.score;
    $scope.meetings.id = $rootScope.currentMeeting.id;
    $scope.meetings.type_meetings_id = $rootScope.currentMeeting.type_meetings_id;
    
    MeetingsService.getMoney()
      .then(res => {
        let data = res.data;
        if (data.ok) {
          $scope.money = data.rows;
        }
      });

    // Get type meetings    
    MeetingsService.getTypeMeetings()
      .then(res => {
        let data = res.data;
        $scope.typeMeetings = data.rows;
      })
      .catch(err => console.log(err));

    
    $scope.save = () => {
      // console.log($scope.meetings);
      MeetingsService.update($scope.meetings)
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