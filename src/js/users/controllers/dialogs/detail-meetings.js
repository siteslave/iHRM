'use strict';

angular.module('app.users.controllers.dialog.DetailMeetings', [])
  .controller('DetailMeetingsCtrl', ($scope, $rootScope, $mdDialog, $mdToast, MeetingsService) => {

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

    $scope.hide = function () {
      $mdDialog.hide();
    };

    $scope.cancel = function () {
      $mdDialog.cancel();
    };

  });