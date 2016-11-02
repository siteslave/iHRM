'use strict'; 

angular.module('app.users.controllers.dialogs.AskPermissionNew', [])
  .controller('AskPermissionNewCtrl', ($scope, $rootScope, $mdDialog, $mdToast, $q, AskPermissionService) => {
  
    $scope.ask = {};
    $scope.employees = [];
    $scope.selectedEmployee = {};
    $scope.selectedEmployees = [];
        
    $scope.hide = function () {
      $mdDialog.hide();
    };

    $scope.cancel = function () {
      $mdDialog.cancel();
    };

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
    
    $scope.selectEmployee = (employee) => {
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
    
    $scope.save = () => {
      let ask = {};
      ask.startDate = moment($scope.ask.startDate).format('YYYY-MM-DD');
      ask.endDate = moment($scope.ask.endDate).format('YYYY-MM-DD');
      ask.startTime = moment($scope.ask.startTime, 'HH.mm').format('HH:mm:ss');
      ask.endTime = moment($scope.ask.endTime, 'HH.mm').format('HH:mm:ss');
      ask.targetName = $scope.ask.targetName;
      ask.distance = $scope.ask.distance;
      ask.cause = $scope.ask.cause;
      ask.isCarRequest = $scope.ask.isCarRequest ? 'Y' : 'N';
      ask.responsibleName = $scope.ask.responsibleName;
      // console.log(ask);
      // console.log($scope.selectedEmployees);
      let _employees = [];

      $scope.selectedEmployees.forEach(v => {
        _employees.push(v.id);
      });

      ask.employees = _employees;
    
      // let querySearch = (query) => {
      //   let _employees = [];
      //   let q = $q.defer();

      //   $scope.employees.forEach(v => {
      //     if (v.indexOf(query)) _employees.push(v)
      //   })
        
      //   let data = _employees.length ? _employees : $scope.employees;
      //   q.resolve(data);
      //   return q.promise;
      //   //return query ? $scope.employees.filter(createFilterFor(query)) : $scope.employees;
      // }

      AskPermissionService.save(ask)
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