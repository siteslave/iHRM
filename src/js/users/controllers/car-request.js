'use strict'; 

angular.module('app.users.controllers.CarRequest', [
  'app.users.services.CarRequest',
  'app.users.controllers.dialogs.CarRequestNew',
  'app.users.controllers.dialogs.CarRequestUpdate'
])
  .controller('CarRequestCtrl', ($scope, $rootScope, $mdDialog, $mdToast, CarRequestService) => {
      
    $scope.openMenu = ($mdOpenMenu, ev) => {
      $mdOpenMenu(ev);
    };

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
      CarRequestService.total()
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

      CarRequestService.list(limit, offset)
        .then(res => {
          let data = res.data;
          if (data.ok) {
            data.rows.forEach(v => {
              let obj = {};
              obj.id = v.id;
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
              obj.approveStatus = v.approve_status;
              $scope.requests.push(obj);
            });

            $scope.showLoading = false;
          } else {
            $scope.showLoading = false;
            console.log(data.msg);
          }
        });
    };
    

    $scope.addNew = (ev) => {
      $mdDialog.show({
        controller: 'CarRequestNewCtrl',
        templateUrl: '/partials/users/car-request/dialogs/new',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false
      })
        .then(() => {
          $scope.getList();
        }, () => {

        });
    };

    $scope.edit = (ev, request) => {
      $rootScope.currentRequest = request;

      $mdDialog.show({
        controller: 'CarRequestUpdateCtrl',
        templateUrl: '/partials/users/car-request/dialogs/new',
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
        .title('Are sure?')
        .textContent('คุณต้องการลบรายการนี้ [' + request.targetName + '] ใช่หรือไม่?')
        .ariaLabel('Confirm delete')
        .targetEvent(ev)
        .ok('ใช่, ต้องการลบ!')
        .cancel('ไม่ใช่, ยกเลิก');
      
      $mdDialog.show(confirm).then(function () {
        CarRequestService.remove(request.id)
          .then(res => {
            let data = res.data;
            if (data.ok) {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('ลบรายการเสร็จเรียบร้อยแล้ว!')
                  .position('right top')
                  .hideDelay(3000)
              );
              $mdDialog.hide();
              $scope.getList();
            } else {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('ไม่สามารถลบรายการได้ : ' + JSON.stringify(data.msg))
                  .position('right top')
                  .hideDelay(3000)
              );
            }
          })
      }, function () {
        //
      });
      
    };



    $scope.initialData();

    
  });