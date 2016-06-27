'use strict';

angular.module('app.admin.controllers.dialogs.MeetingUpdate', [])
  .controller('MeetingUpdateCtrl', ($scope, $rootScope, $mdDialog, $mdToast, MeetingService) => {

    $scope.hide = function () {
      $mdDialog.hide();
    };
    $scope.cancel = function () {
      $mdDialog.cancel();
    };
    
    // console.log($rootScope.currentMeeting);
    $scope.meetings = {};
    $scope.meetings.id = $rootScope.currentMeeting.id;
    $scope.meetings.book_no = $rootScope.currentMeeting.book_no;
    $scope.meetings.book_date = new Date(moment($rootScope.currentMeeting.book_date1).format());
    $scope.meetings.start_date = new Date(moment($rootScope.currentMeeting.start_date1).format());
    $scope.meetings.end_date = new Date(moment($rootScope.currentMeeting.end_date1).format());
    $scope.meetings.title = $rootScope.currentMeeting.title;
    $scope.meetings.owner = $rootScope.currentMeeting.owner;
    $scope.meetings.place = $rootScope.currentMeeting.place;
    $scope.meetings.type_meetings_id = $rootScope.currentMeeting.type_meetings_id;

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

      let meeting = {};

      meeting.id = $scope.meetings.id
      meeting.book_no = $scope.meetings.book_no;
      meeting.book_date = moment($scope.meetings.book_date).format('YYYY-MM-DD'); 
      meeting.start_date = moment($scope.meetings.start_date).format('YYYY-MM-DD');
      meeting.end_date = $scope.meetings.end_date = moment($scope.meetings.end_date).format('YYYY-MM-DD');
      meeting.title = $scope.meetings.title;
      meeting.owner = $scope.meetings.owner;
      meeting.place = $scope.meetings.place;
      meeting.type_meetings_id = $scope.meetings.type_meetings_id;
      
      MeetingService.update(meeting)
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
              .textContent('Error: ' + JSON.stringify(data.msg))
              .position('right top')
              .hideDelay(3000)
            );
          }
        }, err => {
          $mdToast.show(
            $mdToast.simple()
            .textContent('Error: Connection error')
            .position('right top')
            .hideDelay(3000)
          );
        });
    }

  });
