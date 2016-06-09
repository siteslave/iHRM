'use strict';

angular.module('app.users.controllers.Meetings', [
  'app.users.controllers.dialog.NewMeetings',
  'app.users.services.Meetings'
])
  .controller('MeetingsCtrl', ($scope, $rootScope, $mdDialog, MeetingsService) => {


    $scope.openMenu = ($mdOpenMenu, ev) => {
      $mdOpenMenu(ev);
    };

    $scope.showLoading = false;
    $scope.showPaging = true;
    $scope.meetings = [];
    $scope.total = 0;

    $scope.query = {
      limit: 20,
      page: 1
    };

    $scope.onPaginate = (page, limit) => {
      let offset = (page - 1) * limit;
      $scope.getList(limit, offset);
    };

    $scope.getTotal = () => {
      MeetingsService.total()
        .then(res => {
          let data = res.data;
          $scope.total = data.total;
        }, err => {
          // connection error
        });
    };

    $scope.initialData = () => {

      let limit = $scope.query.limit;
      let offset = ($scope.query.page - 1) * $scope.query.limit;

      $scope.getList(limit, offset);
    };

    $scope.refresh = () => {
      $scope.initialData();
    };

    $scope.getList = (limit, offset) => {
      $scope.showLoading = true;
      $scope.showPaging = true;
      $scope.meetings = [];

      MeetingsService.list(limit, offset)
        .then(res => {
          let data = res.data;
          if (data.ok) {
            $scope.showLoading = false;

            data.rows.forEach(v => {
              let obj = {};
              obj.start_date = moment(v.start_date).format('DD/MM/YYYY');
              obj.end_date = moment(v.end_date).format('DD/MM/YYYY');
              obj.meeting_title = v.meeting_title;
              obj.meeting_owner = v.meeting_owner;
              obj.meeting_place = v.meeting_place;
              obj.score = v.score;

              $scope.meetings.push(obj);

            });

            console.log($scope.meetings);

          } else {
            $scope.showLoading = false;
            console.log(data.msg);
          }
        });
    };


    $scope.addNew = (ev) => {

      $mdDialog.show({
        controller: 'NewMeetingsCtrl',
        templateUrl: '/partials/users/dialogs/new-meetings',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false
      })
        .then(() => {
          $scope.getTotal();
          $scope.initialData();
        }, () => {

        });
    };

    $scope.getList();
    $scope.getTotal();

  });