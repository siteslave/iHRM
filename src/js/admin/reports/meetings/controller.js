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

  })

  .controller('ReportsNotMeetingCtrl', ($scope, ReportsMeetingService, $mdToast) => {
  
    $scope.startDate = new Date(moment().startOf('month').format());
    $scope.endDate = new Date(moment().endOf('month').format());
    $scope.showLoading = false;
    $scope.positions = [];

    $scope.employees = [];
    $scope.departments = [];
    $scope.selectedPositions = [];

    // ReportsMeetingService.getPositionList()
    //   .then(res => {
    //     let data = res.data;
    //     if (data.ok) {
    //       // console.log(data.rows);
    //       $scope.positions = data.rows;
    //     }
    //   });
    
    ReportsMeetingService.getDepartmentList()
      .then(res => {
        let data = res.data;
        if (data.ok) {
          // console.log(data.rows);
          $scope.departments = data.rows;
        }
      });

    $scope.clearData = () => {
      $scope.employees = [];
      let departmentId = $scope.departmentId;
      ReportsMeetingService.getPositionList(departmentId)
        .then(res => {
          let data = res.data;
          if (data.ok) {
            $scope.positions = data.rows;
          }
        });
    }
    // get list 
    $scope.getList = () => {

      $scope.employees = [];
      $scope.showLoading = true;

      if ($scope.startDate && $scope.endDate) {
        let start = moment($scope.startDate).format('YYYY-MM-DD');
        let end = moment($scope.endDate).format('YYYY-MM-DD');

        ReportsMeetingService.getNotMeetingList($scope.departmentId, start, end, $scope.selectedPositions)
          .then(res => {
            let data = res.data;
            if (data.ok) {
              $scope.employees = data.rows;
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

    $scope.printData = () => {
      let start = moment($scope.startDate).format('YYYY-MM-DD');
      let end = moment($scope.endDate).format('YYYY-MM-DD');
      let departmentId = $scope.departmentId;
      let positions = $scope.selectedPositions.toString();
      // console.log(positions);
      if (departmentId && start && end) {
        window.open(`/admin/reports/print/not-meetings/${departmentId}/${start}/${end}/${positions}`);
      }
    };

    // initial data
    // $scope.getList();

  });