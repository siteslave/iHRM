'use strict';

angular.module('app.users.controllers.Meetings', [
  'app.users.controllers.dialog.NewMeetings',
  'app.users.services.Meetings',
  'app.users.controllers.dialog.UpdateMeetings'
])
  .controller('MeetingsCtrl', ($scope, $rootScope, $mdDialog, $mdToast, MeetingsService) => {


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
              obj.type_meetings_name = v.type_meetings_name;
              obj.type_meetings_id = v.type_meetings_id;
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
    
    $scope.edit = (ev, meeting) => {
      $rootScope.currentMeeting = meeting;
      
      $mdDialog.show({
        controller: 'UpdateMeetingsCtrl',
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

    $scope.search = (query) => {
      $scope.showLoading = true;
      $scope.showPaging = false;
      $scope.meetings = [];

      MeetingsService.search(query)
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
              obj.type_meetings_name = v.type_meetings_name;
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


    $scope.doSearch = (e) => {
      if (e.charCode == 13) {
        if ($scope.searchQuery) {
          $scope.search($scope.searchQuery);
        } else {
          $scope.refresh();
        }
      }
    };

    $scope.remove = (ev, meeting) => {
      let id = meeting.id;

      let confirm = $mdDialog.confirm()
        .title('Are you sure?')
        .textContent('คุณต้องการลบ "'+ meeting.meeting_title +'" หรือไม่?')
        .ariaLabel('Remove confirmation')
        .targetEvent(ev)
        .ok('ลบรายการ')
        .cancel('ยกเลิก');

      $mdDialog.show(confirm).then(() => {
        MeetingsService.remove(id)
          .then(res => {
            let data = res.data;
            if (data.ok) {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('Deleted!')
                  .position('right top')
                  .hideDelay(3000)
              );

              $scope.refresh();

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
                .textContent('ERROR: Connection error!')
                .position('right top')
                .hideDelay(3000)
            );
          });
      }, () => {
        // no action
      });

    };

    $scope.getList();
    $scope.getTotal();

  });