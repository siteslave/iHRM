'use strict'; 

angular.module('app.CareRequest.Controller', [])
  .controller('CarRequestCtrl', ($scope, $rootScope, $mdDialog, $mdToast, CarRequestService) => {
      
    $scope.openMenu = ($mdOpenMenu, ev) => {
      $mdOpenMenu(ev);
    };

    $scope.approved = false;
    $scope.startDate = new Date(moment().startOf('month').format());
    $scope.endDate = new Date(moment().endOf('month').format());
    
    $scope.showLoading = false;
    $scope.requests = [];
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
      let approveStatus = $scope.approved ? 'Y' : 'N';
      let startDate = moment($scope.startDate).format('YYYY-MM-DD');
      let endDate = moment($scope.endDate).format('YYYY-MM-DD');

      CarRequestService.total(approveStatus, startDate, endDate)
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
      $scope.requests = [];

      let approveStatus = $scope.approved ? 'Y' : 'N';
      let startDate = moment($scope.startDate).format('YYYY-MM-DD');
      let endDate = moment($scope.endDate).format('YYYY-MM-DD');

      CarRequestService.list(approveStatus, startDate, endDate, limit, offset)
        .then(res => {
          let data = res.data;
          if (data.ok) {
            data.rows.forEach(v => {
              let obj = {};
              obj.id = v.id;
              obj.carLicenseId = v.car_license_id;
              obj.carLicenseName = v.car_license_name;
              obj.driverId = v.driver_id;
              obj.startDate2 = v.start_date;
              obj.endDate2 = v.end_date;
              obj.requestDate2 = v.request_date;
              
              obj.startDate = `${moment(v.start_date).format('D/M')}/${moment(v.start_date).get('year') + 543}`;
              obj.endDate = `${moment(v.end_date).format('D/M')}/${moment(v.end_date).get('year') + 543}`;

              obj.startTime = v.start_time;
              obj.endTime = v.end_time;
              obj.cause = v.cause;
              obj.targetName = v.target_name;
              obj.travelerNum = v.traveler_num;
              obj.responsibleName = v.responsible_name;
              obj.requestDate = `${moment(v.request_date).format('D/M')}/${moment(v.request_date).get('year') + 543}`;
              // console.log(obj);
              obj.titleName = v.title_name;
              obj.firstName = v.first_name;
              obj.lastName = v.last_name;
              obj.approveStatus = v.approve_status;
              console.log(obj);
              $scope.requests.push(obj);
            });

            $scope.showLoading = false;
          } else {
            $scope.showLoading = false;
            console.log(data.msg);
          }
        });
    };

    $scope.approve = (ev, request) => {
      $rootScope.currentRequest = request;

      $mdDialog.show({
        controller: 'CarRequestApproveCtrl',
        templateUrl: '/partials/admin/car-request/dialogs/approve',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false
      })
        .then(() => {
          $scope.getList();
        }, () => {

        });
    };

    $scope.remove = (ev, request) => {

      var confirm = $mdDialog.confirm()
        .title('Are you sure?')
        .textContent('คุณต้องการลบรายการ ["' + request.targetName + '"] ใช่หรือไม่?')
        .ariaLabel('Confirmation')
        .targetEvent(ev)
        .ok('ใช่, ฉันต้องการลบ!')
        .cancel('ไม่ใช่, ยกเลิก');

      $mdDialog.show(confirm).then(function () {
        $rootScope.showLoading = true;
        // remove
        CarRequestService.remove(request.id)
          .then(res => {
            let data = res.data;
            if (data.ok) {
              $mdToast.show(
                $mdToast.simple()
                  .textContent(request.targetName + ' deleted!')
                  .position('right top')
                  .hideDelay(3000)
              );
              $rootScope.showLoading = false;
              // Get new list
              $scope.getList();

            } else {
              $rootScope.showLoading = false;
              $mdToast.show(
                $mdToast.simple()
                  .textContent('Error: ' + JSON.stringify(data.msg))
                  .position('right top')
                  .hideDelay(3000)
              );
            };
          }, err => {
            $rootScope.showLoading = false;
            $mdToast.show(
              $mdToast.simple()
                .textContent('Error: ' + JSON.stringify(err))
                .position('right top')
                .hideDelay(3000)
            );
          });

      }, function () {
        // cancel
      });

    };
    

    $scope.initialData();

    
  });