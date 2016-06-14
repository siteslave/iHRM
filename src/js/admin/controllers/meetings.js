'use strict';

angular.module('app.admin.controllers.Meetings', [
  'app.admin.services.Meeting',
  'app.admin.controllers.dialogs.NewMeetings',
  'app.admin.controllers.dialogs.UpdateMeetings',
  'app.admin.controllers.dialogs.MeetingAssign',
  'app.admin.services.Department'
])
  .controller('MeetingsCtrl', ($scope, $rootScope, $mdDialog, MeetingService) => {

    $scope.openMenu = ($mdOpenMenu, ev) => {
      $mdOpenMenu(ev);
    };
    
    $scope.addNew = (ev) => {

      $mdDialog.show({
        controller: 'NewMeetingsCtrl',
        templateUrl: '/partials/admin/meetings/dialog/new',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false
      })
        .then(() => {
          $scope.initialData();
        }, () => {

        });
    };

    $scope.assignDepartment = (ev, meeting) => {

      $rootScope.currentMeeting = meeting;
      
      $mdDialog.show({
        controller: 'MeetingAssignCtrl',
        templateUrl: '/partials/admin/meetings/dialog/assign',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false
      })
        .then(() => {
          $scope.initialData();
        }, () => {

        });
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
      MeetingService.total()
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
      $scope.showLoading = true;
      $scope.showPaging = true;
      $scope.meetings = [];

      MeetingService.list(limit, offset)
        .then(res => {
          let data = res.data;
          if (data.ok) {
            $scope.showLoading = false;

            data.rows.forEach(v => {
              let obj = {};
              obj.start_date = moment(v.start_date).format('DD/MM') + '/' + (moment(v.start_date).get('year')+543);
              obj.end_date = moment(v.end_date).format('DD/MM') + '/' + (moment(v.end_date).get('year')+543);
              obj.title = v.title;
              obj.owner = v.owner;
              obj.place = v.place;
              obj.type_meetings_name = v.type_meetings_name;
              obj.type_meetings_id = v.type_meetings_id;
              obj.book_no = v.book_no;
              obj.book_date = moment(v.book_date).format('DD/MM') + '/' + (moment(v.book_date).get('year')+543);

              obj.id = v.id;

              $scope.meetings.push(obj);

            });

          } else {
            $scope.showLoading = false;
            console.log(data.msg);
          }
        });
    };

    $scope.getTotal();
    $scope.getList();


  });
