'use strict'; 

angular.module('app.users.controllers.dialogs.CarRequestUpdate', [])
  .controller('CarRequestUpdateCtrl', ($scope, $rootScope, $mdDialog, $mdToast, CarRequestService) => {
  
    $scope.request = {};
    $scope.request.id = $rootScope.currentRequest.id;
    $scope.request.startDate = new Date(moment($rootScope.currentRequest.startDate2).format());
    $scope.request.endDate = new Date(moment($rootScope.currentRequest.endDate2).format());
    $scope.request.startTime = moment($rootScope.currentRequest.startTime, 'HH:mm:ss').format('HH.mm');
    $scope.request.endTime = moment($rootScope.currentRequest.endTime, 'HH:mm:ss').format('HH.mm');
    $scope.request.requestDate = new Date(moment($rootScope.currentRequest.requestDate2).format());
    $scope.request.cause = $rootScope.currentRequest.cause;
    $scope.request.targetName = $rootScope.currentRequest.targetName;
    $scope.request.travelerNum = $rootScope.currentRequest.travelerNum;
    $scope.request.responsibleName = $rootScope.currentRequest.responsibleName;

    $scope.hide = function () {
      $mdDialog.hide();
    };

    $scope.cancel = function () {
      $mdDialog.cancel();
    };

    $scope.save = () => {
      let _request = {};
      _request.id = $scope.request.id;
      _request.startDate = moment($scope.request.startDate).format('YYYY-MM-DD');
      _request.endDate = moment($scope.request.endDate).format('YYYY-MM-DD');
      _request.startTime = moment($scope.request.startTime, 'HH.mm').format('HH:mm:ss');
      _request.endTime = moment($scope.request.endTime, 'HH.mm').format('HH:mm:ss');
      _request.targetName = $scope.request.targetName;
      _request.travelerNum = $scope.request.travelerNum;
      _request.responsibleName = $scope.request.responsibleName;
      _request.cause = $scope.request.cause;

      console.log(_request);
      CarRequestService.update(_request)
        .then(res => {
          let data = res.data;
          if (data.ok) {
            $mdToast.show(
              $mdToast.simple()
                .textContent('บันทึกรายการเสร็จเรียบร้อย!')
                .position('right top')
                .hideDelay(3000)
            );
            $mdDialog.hide();
          } else {
            $mdToast.show(
              $mdToast.simple()
                .textContent('เกิดข้อผิดพลาด: ' + JSON.stringify(data.msg))
                .position('right top')
                .hideDelay(3000)
            );
          }
        }, () => {
          $mdToast.show(
            $mdToast.simple()
              .textContent('เกิดข้อผิดพลาดในการเชื่อมต่อ')
              .position('right top')
              .hideDelay(3000)
          );
        });
    };
    
  });