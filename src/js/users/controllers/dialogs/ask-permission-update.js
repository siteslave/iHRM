'use strict'; 

angular.module('app.users.controllers.dialogs.AskPermissionUpdate', [])
  .controller('AskPermissionUpdateCtrl', ($scope, $rootScope, $mdDialog, $mdToast, AskPermissionService) => {
  
    $scope.selectedEmployees = [];
    $scope.employees = [];

    $scope.ask = {};
    $scope.ask.id = $rootScope.currentAsk.id;
    $scope.ask.startDate = new Date(moment($rootScope.currentAsk.startDate2).format());
    $scope.ask.endDate = new Date(moment($rootScope.currentAsk.endDate2).format());
    $scope.ask.startTime = moment($rootScope.currentAsk.startTime, 'HH:mm:ss').format('HH.mm');
    $scope.ask.endTime = moment($rootScope.currentAsk.endTime, 'HH:mm:ss').format('HH.mm');
    $scope.ask.cause = $rootScope.currentAsk.cause;
    $scope.ask.targetName = $rootScope.currentAsk.targetName;
    $scope.ask.distance = $rootScope.currentAsk.distance

    // Get employees list

    AskPermissionService.getEmployeeSelectedList($scope.ask.id)
      .then(res => {
        let data = res.data;
        if (data.ok) {
          
          data.rows.forEach(v => {
            let fullname = `${v.first_name} ${v.last_name}`;
            $scope.selectedEmployees.push({ id: v.id, fullname: fullname });
          })
        }
      });

    //Get employee list 
    AskPermissionService.getEmployeeList()
      .then(res => {
        let data = res.data;
        data.rows.forEach(v => {
          let obj = {};
          obj.fullname = `${v.first_name} ${v.last_name}`;
          obj.id = v.id;
          $scope.employees.push(obj);

        });
       
      });
    
    $scope.selectedItemChange = (employee) => {
      // console.log(employee);
      if (_.size(employee)) {
        let idx = _.findIndex($scope.selectedEmployees, { id: employee.id });
        if (idx == -1) {
          $scope.selectedEmployees.push({ id: employee.id, fullname: employee.fullname });
        }
      }
    };
    
    $scope.removeSelectedEmployee = (idx) => {
      $scope.selectedEmployees.splice(idx, 1);
    };

    console.log($scope.ask);
    
    $scope.hide = function () {
      $mdDialog.hide();
    };

    $scope.cancel = function () {
      $mdDialog.cancel();
    };

    $scope.save = () => {
      let _ask = {};

      let employees = [];

      $scope.selectedEmployees.forEach(v => {
        employees.push(v.id);
      });

      _ask.employees = employees;

      _ask.id = $scope.ask.id;
      _ask.startDate = moment($scope.ask.startDate).format('YYYY-MM-DD');
      _ask.endDate = moment($scope.ask.endDate).format('YYYY-MM-DD');
      _ask.startTime = moment($scope.ask.startTime, 'HH.mm').format('HH:mm:ss');
      _ask.endTime = moment($scope.ask.endTime, 'HH.mm').format('HH:mm:ss');
      _ask.targetName = $scope.ask.targetName;
      _ask.distance = $scope.ask.distance;
      _ask.cause = $scope.ask.cause;

      console.log(_ask);
      
      AskPermissionService.update(_ask)
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