'use strict'; 

angular.module('app.users.controllers.AskPermission', [
  'app.users.services.AskPermission',
  'app.users.controllers.dialogs.AskPermissionNew',
  'app.users.controllers.dialogs.AskPermissionUpdate'
])
  .controller('AskPermissionCtrl', ($scope, $rootScope, $mdDialog, $mdToast, AskPermissionService) => {
      
    $scope.openMenu = ($mdOpenMenu, ev) => {
      $mdOpenMenu(ev);
    };

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
      AskPermissionService.total()
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

      AskPermissionService.list(limit, offset)
        .then(res => {
          let data = res.data;
          if (data.ok) {
            data.rows.forEach(v => {
              let obj = {};
              obj.id = v.id;
              obj.startDate2 = v.start_date;
              obj.endDate2 = v.end_date;
              obj.askDate2 = v.ask_date;
              
              obj.startDate = `${moment(v.start_date).format('D/M')}/${moment(v.start_date).get('year') + 543}`;
              obj.endDate = `${moment(v.end_date).format('D/M')}/${moment(v.end_date).get('year') + 543}`;

              obj.startTime = v.start_time;
              obj.endTime = v.end_time;
              obj.cause = v.cause;
              obj.targetName = v.target_name;
              obj.distance = v.distance;
              obj.isCarRequest = v.is_car_request;
              obj.responsibleName = v.responsible_name;
              // console.log(obj);
              obj.approveStatus = v.approve_status;
              $scope.asks.push(obj);
            });
            console.log($scope.asks);
            $scope.showLoading = false;
          } else {
            $scope.showLoading = false;
            console.log(data.msg);
          }
        });
    };
    

    $scope.addNew = (ev) => {
      $mdDialog.show({
        controller: 'AskPermissionNewCtrl',
        templateUrl: '/partials/users/ask-permission/dialogs/new',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false
      })
        .then(() => {
          $scope.initialData();
        }, () => {

        });
    };

    $scope.edit = (ev, ask) => {
      $rootScope.currentAsk = ask;
      // console.log(ask);
      $mdDialog.show({
        controller: 'AskPermissionUpdateCtrl',
        templateUrl: '/partials/users/ask-permission/dialogs/new',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false
      })
        .then(() => {
          $scope.initialData();
        }, () => {

        });
    };



    $scope.remove = (ev, ask) => {
      
      var confirm = $mdDialog.confirm()
        .title('Are sure?')
        .textContent('คุณต้องการลบรายการนี้ [' + ask.targetName + '] ใช่หรือไม่?')
        .ariaLabel('Confirm delete')
        .targetEvent(ev)
        .ok('ใช่, ต้องการลบ!')
        .cancel('ไม่ใช่, ยกเลิก');
      
      $mdDialog.show(confirm).then(() => {
        AskPermissionService.remove(ask.id)
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
              $scope.initialData();
            } else {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('ไม่สามารถลบรายการได้ : ' + JSON.stringify(data.msg))
                  .position('right top')
                  .hideDelay(3000)
              );
            }
          })
      }, () => {
        //
      });
      
    };



    $scope.initialData();

    
  });