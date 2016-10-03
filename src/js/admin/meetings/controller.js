'use strict';

angular.module('app.Meeting.Controller', [])
  .controller('MeetingsCtrl', ($scope, $rootScope, $mdToast, $mdDialog, MeetingService) => {

    $scope.openMenu = ($mdOpenMenu, ev) => {
      $mdOpenMenu(ev);
    };

    $scope.addNew = (ev) => {

      $mdDialog.show({
        controller: 'MeetingNewCtrl',
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

    $scope.update = (ev, meeting) => {

      $rootScope.currentMeeting = meeting;

      $mdDialog.show({
        controller: 'MeetingUpdateCtrl',
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

    $scope.showRegistered = (ev, meeting) => {

      $rootScope.currentMeeting = meeting;

      $mdDialog.show({
        controller: 'MeetingRegisteredCtrl',
        templateUrl: '/partials/admin/meetings/dialog/registered-list',
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
              obj.start_date1 = v.start_date;
              obj.end_date1 = v.end_date;
              obj.book_date1 = v.book_date;

              obj.start_date = moment(v.start_date).format('D/M') + '/' + (moment(v.start_date).get('year') + 543);
              obj.end_date = moment(v.end_date).format('D/M') + '/' + (moment(v.end_date).get('year') + 543);
              obj.title = v.title;
              obj.owner = v.owner;
              obj.place = v.place;
              obj.type_meetings_name = v.type_meetings_name;
              obj.type_meetings_id = v.type_meetings_id;
              obj.book_no = v.book_no;
              obj.book_date = moment(v.book_date).format('D/M') + '/' + (moment(v.book_date).get('year') + 543);
              obj.total = v.total;
              obj.total_registered = v.total_registered;
              obj.total_approve = v.total_approve;
              obj.id = v.id;

              $scope.meetings.push(obj);

            });

          } else {
            $scope.showLoading = false;
            console.log(data.msg);
          }
        });
    };

    $scope.remove = (ev, meeting) => {
      let id = meeting.id;

      let confirm = $mdDialog.confirm()
        .title('Are you sure?')
        .textContent('คุณต้องการลบ "' + meeting.title + '" หรือไม่?')
        .ariaLabel('Remove confirmation')
        .targetEvent(ev)
        .ok('ลบรายการ')
        .cancel('ยกเลิก');

      $mdDialog.show(confirm).then(() => {
        MeetingService.remove(id)
          .then(res => {
            let data = res.data;
            if (data.ok) {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('Deleted!')
                  .position('right top')
                  .hideDelay(3000)
              );

              $scope.initialData();

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


    $scope.doSearch = (event) => {

      if (event.keyCode == 13) {
        let query = $scope.searchQuery;
        if (query.length >= 3 ) {
          $scope.getSearchResult(query);
        }
      }
    };

    $scope.getSearchResult = (query) => {
      $scope.showLoading = true;
      $scope.showPaging = false;
      $scope.meetings = [];

      MeetingService.search(query)
        .then(res => {
          $scope.showLoading = false;
          let data = res.data;
          if (data.ok) {
            $scope.showLoading = false;

            data.rows.forEach(v => {
              let obj = {};
              obj.start_date1 = v.start_date;
              obj.end_date1 = v.end_date;
              obj.book_date1 = v.book_date;

              obj.start_date = moment(v.start_date).format('D/M') + '/' + (moment(v.start_date).get('year') + 543);
              obj.end_date = moment(v.end_date).format('D/M') + '/' + (moment(v.end_date).get('year') + 543);
              obj.title = v.title;
              obj.owner = v.owner;
              obj.place = v.place;
              obj.type_meetings_name = v.type_meetings_name;
              obj.type_meetings_id = v.type_meetings_id;
              obj.book_no = v.book_no;
              obj.book_date = moment(v.book_date).format('D/M') + '/' + (moment(v.book_date).get('year') + 543);
              obj.total = v.total;
              obj.total_registered = v.total_registered;
              obj.total_approve = v.total_approve;
              obj.id = v.id;

              $scope.meetings.push(obj);
            });

          } else {
            console.log(data.msg);
          }
        });
    };

    $scope.initialData();

  })
  
  .controller('MeetingHistoryCtrl', ($scope, $stateParams, $rootScope, $mdDialog, $mdToast, MeetingHistoryervice) => {

    $scope.userId = $stateParams.id;

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

      MeetingHistoryervice.total($scope.userId, startDate, endDate)
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

      MeetingHistoryervice.list($scope.userId, startDate, endDate, limit, offset)
        .then(res => {
          let data = res.data;
          if (data.ok) {
            $scope.showLoading = false;

            data.rows.forEach(v => {
              let obj = {};
              obj.start_date = moment(v.start_date).format('DD/MM/YYYY');
              obj.start_date1 = v.start_date;
              obj.end_date = moment(v.end_date).format('DD/MM/YYYY');
              obj.end_date1 = v.end_date;

              obj.title = v.title;
              obj.owner = v.owner;
              obj.place = v.place;
              obj.score = v.score;
              obj.price = v.price;
              obj.id = v.id;
              obj.money_id = v.money_id;

              $scope.meetings.push(obj);

            });

            console.log($scope.meetings)

          } else {
            $scope.showLoading = false;
            console.log(data.msg);
          }
        });
    };


    //print
    $scope.pdfExport = () => {
      let startDate = moment($scope.startDate).format('YYYY-MM-DD');
      let endDate = moment($scope.endDate).format('YYYY-MM-DD');

      window.location.href = `/admin/employee/pdf/${$scope.userId}/${startDate}/${endDate}`;
    }

    $scope.initialData();

  });
