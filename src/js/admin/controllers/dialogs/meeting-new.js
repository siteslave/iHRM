'use strict';

angular.module('app.admin.controllers.dialogs.MeetingNew', [])
  .controller('MeetingNewCtrl', ($scope, $mdDialog, $mdToast, MeetingService) => {

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

      MeetingService.save(meeting)
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
