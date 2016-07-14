'use strict';

angular.module('app.Reports.Meeting.Controller', [])
  .controller('ReportsMeetingCtrl', ($scope, ReportsMeetingService, $mdToast) => {
  
    $scope.startDate = new Date(moment().startOf('month').format());
    $scope.endDate = new Date(moment().endOf('month').format());
    $scope.showLoading = false;

    $scope.meetings = [];

    // get list 
    $scope.getList = () => {

      $scope.meetings = [];
      $scope.showLoading = true;

      if ($scope.startDate && $scope.endDate) {
        let start = moment($scope.startDate).format('YYYY-MM-DD');
        let end = moment($scope.endDate).format('YYYY-MM-DD');

        ReportsMeetingService.getList(start, end)
          .then(res => {
            let data = res.data;
            if (data.ok) {
              
              data.rows.forEach(v => {
                let obj = {};
                obj.id = v.id;
                obj.startDate = `${moment(v.start_date).format('DD/MM')}/${moment(v.start_date).get('year') + 543}`;
                obj.endDate = `${moment(v.end_date).format('DD/MM')}/${moment(v.end_date).get('year') + 543}`;
                obj.title = v.title;
                obj.owner = v.owner;
                obj.place = v.place;

                $scope.meetings.push(obj);
              });

              $scope.showLoading = false;
              
            } else {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('เกิดข้อผิดพลาด: ' + JSON.stringify(data.msg))
                  .position('bottom right')
                  .hideDelay(3000)
              );
              $scope.showLoading = false;
            }
          }, () => {
            $mdToast.show(
              $mdToast.simple()
                .textContent('เกิดข้อผิดพลาดในการเชื่อมต่อ')
                .position('bottom right')
                .hideDelay(3000)
            );
          });
      }
      
    };

    // initial data
    $scope.getList();

  });