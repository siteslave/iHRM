'use strict';

angular.module('app.Meeting.dialog.New', [])
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
      console.log($scope.meetings);

      let _meeting = {};

      let startDate = $scope.meetings.start;
      let endDate = $scope.meetings.end;

      _meeting.id = $scope.meetings.id
      _meeting.book_no = $scope.meetings.book_no;
      _meeting.book_date = moment($scope.meetings.book_date).format('YYYY-MM-DD'); 
      _meeting.start_date = moment(startDate).format('YYYY-MM-DD');
      _meeting.end_date = moment(endDate).format('YYYY-MM-DD');
      _meeting.title = $scope.meetings.title;
      _meeting.owner = $scope.meetings.owner;
      _meeting.place = $scope.meetings.place;
      _meeting.type_meetings_id = $scope.meetings.type_meetings_id;
      console.log(_meeting)
      MeetingService.save(_meeting)
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
