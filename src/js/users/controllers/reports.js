'use strict';

angular.module('app.users.controllers.Reports', [
  'app.users.services.Reports',
  // 'app.users.controllers.dialog.DetailMeetings'
])
  .controller('ReportsCtrl', ($scope, $rootScope, $mdDialog, $mdToast, ReportsService) => {

    $scope.startDate = new Date(moment().startOf('month').format());
    $scope.endDate = new Date(moment().endOf('month').format());

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
      let startDate = moment($scope.startDate).format('YYYY-MM-DD');
      let endDate = moment($scope.endDate).format('YYYY-MM-DD');

      ReportsService.total(startDate, endDate)
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

      $scope.getTotal();
      $scope.getList(limit, offset);
    };

    $scope.refresh = () => {
      $scope.initialData();
    };

    $scope.getList = (limit, offset) => {

      let startDate = moment($scope.startDate).format('YYYY-MM-DD');
      let endDate = moment($scope.endDate).format('YYYY-MM-DD');

      $scope.showLoading = true;
      $scope.showPaging = true;
      $scope.meetings = [];

      ReportsService.list(startDate, endDate, limit, offset)
        .then(res => {
          let data = res.data;
          if (data.ok) {
            $scope.showLoading = false;

            data.rows.forEach(v => {
              let obj = {};
              obj.start_date = moment(v.start_date).format('DD/MM/YYYY');
              obj.end_date = moment(v.end_date).format('DD/MM/YYYY');
              obj.start_date1 = v.start_date;
              obj.end_date1 = v.end_date;
              obj.title = v.title;
              obj.owner = v.owner;
              obj.book_no = v.book_no;
              obj.book_date = v.book_date;
              obj.place = v.place;
              obj.score = v.score;
              obj.money_id = v.money_id;
              obj.transport_id = v.transport_id;
              obj.type_meetings_id = v.type_meetings_id;
              obj.id = v.id;
              obj.money_name = v.money_name;

              $scope.meetings.push(obj);

            });

          } else {
            $scope.showLoading = false;
            console.log(data.msg);
          }
        });
    };


    $scope.search = (query) => {
      $scope.showLoading = true;
      $scope.showPaging = false;
      $scope.meetings = [];

      ReportsService.search(query)
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
              obj.price = v.price;
              obj.id = v.id;
              obj.money_id = v.money_id;

              $scope.meetings.push(obj);

            });

          } else {
            $scope.showLoading = false;
            console.log(data.msg);
          }
        });
    };

    $scope.detail = (ev, meeting) => {
      console.log(meeting);

      $rootScope.currentMeeting = meeting;
      $mdDialog.show({
        controller: 'MeetingDetailCtrl',
        templateUrl: '/partials/users/dialogs/meeting-detail',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false
      });
    };

    //print
    $scope.pdfExport = () => {
      let startDate = moment($scope.startDate).format('YYYY-MM-DD');
      let endDate = moment($scope.endDate).format('YYYY-MM-DD');

      window.location.href = `/users/meetings/print/history/${startDate}/${endDate}`;
    }
    //
    $scope.getList();
    $scope.getTotal();

  });