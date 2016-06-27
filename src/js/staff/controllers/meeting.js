'use strict';

angular.module('app.staff.controllers.Meeting', ['app.staff.services.Meeting'])
  .controller('MeetingCtrl', ($scope, $stateParams, $rootScope, $mdDialog, $mdToast, MeetingService) => {

    $scope.employeeId = $stateParams.employeeId;

    console.log($stateParams);

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

      MeetingService.total($scope.employeeId, startDate, endDate)
        .then(res => {
          let data = res.data;
          console.log(data);
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

      MeetingService.list($scope.employeeId, startDate, endDate, limit, offset)
        .then(res => {
          let data = res.data;
          if (data.ok) {
            $scope.showLoading = false;

            data.rows.forEach(v => {
              let obj = {};
              obj.start_date = moment(v.start_date).format('DD/MM/YYYY');
              obj.end_date = moment(v.end_date).format('DD/MM/YYYY');
              obj.title = v.title;
              obj.owner = v.owner;
              obj.place = v.place;
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


    //print
    $scope.pdfExport = () => {
      let startDate = moment($scope.startDate).format('YYYY-MM-DD');
      let endDate = moment($scope.endDate).format('YYYY-MM-DD');

      window.location.href = `/staff/meeting/print/${$scope.employeeId}/${startDate}/${endDate}`;
    }
    //
    $scope.initialData();

  });