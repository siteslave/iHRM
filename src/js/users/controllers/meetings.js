'use strict';

angular.module('app.users.controllers.Meetings', [
  'app.users.controllers.dialog.MeetingRegister',
  'app.users.services.Meetings',
  'app.users.controllers.dialog.MeetingUpdate'
])
  .controller('MeetingsCtrl', ($scope, $rootScope, $mdDialog, $mdToast, MeetingsService) => {


    $scope.openMenu = ($mdOpenMenu, ev) => {
      $mdOpenMenu(ev);
    };

    $scope.showLoading = false;
    $scope.showPaging = true;
    $scope.meetings = [];
    $scope.total = 0;
    $scope.registerTotal = 0;

    $scope.query = {
      limit: 20,
      page: 1
    };

    $scope.queryRegister = {
      limit: 20,
      page: 1
    };

    $scope.onPaginate = (page, limit) => {
      let offset = (page - 1) * limit;
      $scope.getList(limit, offset);
    };

    $scope.onPaginateRegister = (page, limit) => {
      let offset = (page - 1) * limit;
      $scope.getRegisterList(limit, offset);
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

    $scope.getRegisterTotal = () => {
      MeetingsService.registerTotal()
        .then(res => {
          let data = res.data;
          $scope.registerTotal = data.total;
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

    $scope.initialRegisterData = () => {

      let limit = $scope.queryRegister.limit;
      let offset = ($scope.queryRegister.page - 1) * $scope.queryRegister.limit;

      $scope.getRegisterTotal();
      $scope.getRegisterList(limit, offset);
    };

    $scope.refreshRegister = () => {
      $scope.initialRegisterData();
    };

    // $scope.refresh = () => {
    //   $scope.initialData();
    // };

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
              obj.book_no = v.book_no;
              obj.book_date = moment(v.book_date).format('DD/MM/YYYY');
              obj.start_date = moment(v.start_date).format('DD/MM/YYYY');
              obj.end_date = moment(v.end_date).format('DD/MM/YYYY');
              obj.title = v.title;
              obj.owner = v.owner;
              obj.place = v.place;
              obj.type_meetings_name = v.type_meetings_name;
              obj.type_meetings_id = v.type_meetings_id;
              obj.score = v.score;
              obj.id = v.id;

              $scope.meetings.push(obj);

            });

          } else {
            $scope.showLoading = false;
            console.log(data.msg);
          }
        });
    };

    $scope.getRegisterList = (limit, offset) => {
      $scope.showLoading = true;
      $scope.showPaging = true;
      $scope.registers = [];

      MeetingsService.registerList(limit, offset)
        .then(res => {
          let data = res.data;
          if (data.ok) {
            $scope.showLoading = false;

            data.rows.forEach(v => {
              let obj = {};
              obj.book_no = v.book_no;
              obj.book_date = moment(v.book_date).format('DD/MM/YYYY');
              obj.start_date = moment(v.start_date).format('DD/MM/YYYY');
              obj.end_date = moment(v.end_date).format('DD/MM/YYYY');
              obj.title = v.title;
              obj.owner = v.owner;
              obj.place = v.place;
              obj.type_meetings_name = v.type_meetings_name;
              obj.type_meetings_id = v.type_meetings_id;
              obj.score = v.score;
              obj.approve_status = v.approve_status;
              obj.id = v.id;
              obj.money_id = v.money_id;
              obj.transport_id = v.transport_id;
              obj.price = v.price;

              $scope.registers.push(obj);

            });

          } else {
            $scope.showLoading = false;
            console.log(data.msg);
          }
        });
    };

    $scope.register = (ev, meeting) => {
      $rootScope.currentMeeting = meeting;

      $mdDialog.show({
        controller: 'MeetingRegisterCtrl',
        templateUrl: '/partials/users/dialogs/meeting-register',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false
      })
        .then(() => {
          $scope.initialData();
        }, () => {
          // cancel
        });
    };

    $scope.edit = (ev, meeting) => {
      $rootScope.currentMeeting = meeting;

      $mdDialog.show({
        controller: 'MeetingUpdateCtrl',
        templateUrl: '/partials/users/dialogs/meeting-register',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false
      })
        .then(() => {
          $scope.initialRegisterData();
        }, () => {
          // cancel
        });
    };

    $scope.cancelRegister = (ev, meeting) => {
      // console.log(meeting);

      let confirm = $mdDialog.confirm()
        .title('Are you sure?')
        .textContent('คุณต้องการยกเลิกการลงทะเบียนในหัวข้อ "' + meeting.title + '" ใช่หรือไม่?')
        .ariaLabel('Register confirmation')
        .targetEvent(ev)
        .ok('ใช่, ยกเลิก')
        .cancel('ปิด');

      $mdDialog.show(confirm).then(() => {
        MeetingsService.cancelRegister(meeting.id)
          .then(res => {
            let data = res.data;
            if (data.ok) {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('ยกเลิกการลงทะเบียนเสร็จเรียบร้อย!')
                  .position('right top')
                  .hideDelay(3000)
              );
              // refresh list
              $scope.initialRegisterData();

            } else {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('Error: ' + JSON.stringify(data.msg))
                  .position('right top')
                  .hideDelay(3000)
              );
            }
          }, () => {
            $mdToast.show(
              $mdToast.simple()
                .textContent('Connection error, please try again.')
                .position('right top')
                .hideDelay(3000)
            );
          });
      }, () => {
        // no action
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

    // $scope.initialData();

  });
