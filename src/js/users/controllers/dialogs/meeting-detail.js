'use strict';

angular.module('app.users.controllers.dialog.MeetingDetail', [])
  .controller('MeetingDetailCtrl', ($scope, $rootScope, $mdDialog, $mdToast, MeetingsService) => {

    $scope.meetings = {};
    $scope.meetings = $rootScope.currentMeeting;

    $scope.meetings.start = new Date(moment($rootScope.currentMeeting.start_date1).format());
    $scope.meetings.end = new Date(moment($rootScope.currentMeeting.end_date1).format());
    $scope.meetings.book_date = new Date(moment($rootScope.currentMeeting.book_date).format());

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


    MeetingsService.getTypeMeetings()
      .then(res => {
        let data = res.data;
        $scope.typeMeetings = data.rows;
      });

    $scope.hide = function () {
      $mdDialog.hide();
    };

    $scope.cancel = function () {
      $mdDialog.cancel();
    };

  });