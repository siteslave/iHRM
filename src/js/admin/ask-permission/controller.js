'use strict'; 

angular.module('app.AskPermission.Controller', [])
  .controller('AskPermissionCtrl', ($scope, $rootScope, $mdDialog, $mdToast, AskPermissionService) => {
      
    $scope.openMenu = ($mdOpenMenu, ev) => {
      $mdOpenMenu(ev);
    };

    $scope.approved = false;
    $scope.startDate = new Date(moment().startOf('month').format());
    $scope.endDate = new Date(moment().endOf('month').format());
    
    $scope.showLoading = false;
    $scope.asks = [];
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

      AskPermissionService.total(approveStatus, startDate, endDate)
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
      $scope.asks = [];

      let approveStatus = $scope.approved ? 'Y' : 'N';
      let startDate = moment($scope.startDate).format('YYYY-MM-DD');
      let endDate = moment($scope.endDate).format('YYYY-MM-DD');

      AskPermissionService.list(approveStatus, startDate, endDate, limit, offset)
        .then(res => {
          let data = res.data;
          if (data.ok) {
            data.rows.forEach(v => {
              let obj = {};
              obj.id = v.id;
              obj.carLicense = v.car_license;
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
              $scope.asks.push(obj);
            });

            $scope.showLoading = false;
          } else {
            $scope.showLoading = false;
            console.log(data.msg);
          }
        });
    };

    $scope.employeesList = (ev, id) => {
      $rootScope.currentEmployees = [];
      AskPermissionService.getEmployeeList(id)
        .then(res => {
          let data = res.data;
          if (data.ok) {
            $rootScope.currentEmployees = data.rows;
            $mdDialog.show({
              controller: 'AskPermissionDialogEmployeeCtrl',
              templateUrl: '/partials/admin/ask-permission/dialogs/employee-list',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose: false
            })
              .then(() => { });
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
              .textContent('Connection failed')
              .position('right top')
              .hideDelay(3000)
          );
        });
      
    };

    $scope.approve = (ev, ask) => {
      let status = ask.approveStatus == 'Y' ? 'N' : 'Y';

      let confirm;
      if (status == 'Y') {
        confirm = $mdDialog.confirm()
          .title('Are you sure?')
          .textContent('คุณต้องการอนุมัติรายการนี้ใช่หรือไม่')
          .ariaLabel('Confirmation')
          .targetEvent(ev)
          .ok('ใช่, ฉันต้องการอนุมัติรายการนี้!')
          .cancel('ไม่ใช่, ยกเลิก'); 
      } else {
        confirm = $mdDialog.confirm()
          .title('Are you sure?')
          .textContent('คุณต้องการยกเลิกอนุมัติรายการนี้ใช่หรือไม่')
          .ariaLabel('Confirmation')
          .targetEvent(ev)
          .ok('ใช่, ฉันต้องการยกเลิกอนุมัติรายการนี้!')
          .cancel('ไม่ใช่, ยกเลิก');
      }

      $mdDialog.show(confirm)
        .then(() => {
          $rootScope.showLoading = true;
          let approve = {
            askId: ask.id,
            status: status
          };

          AskPermissionService.approve(approve)
            .then(res => {
              let data = res.data;
              if (data.ok) {
                $mdToast.show(
                  $mdToast.simple()
                    .textContent('อนุมัติ/ยกเลิกอนุมัติ เสร็จเรียบร้อยแล้ว')
                    .position('right top')
                    .hideDelay(3000)
                );
                $rootScope.showLoading = false;
              // Get new list
                $scope.getList();
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
                  .textContent('Connection error')
                  .position('right top')
                  .hideDelay(3000)
              );
            });
        });
    }
    
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
        AskPermissionService.remove(request.id)
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