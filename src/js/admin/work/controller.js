angular.module('app.work.Controller', [])
  .controller('WorkCtrl', ($scope, $rootScope, WorkService, $mdDialog) => {
  
    $scope.attendances = [];

    $scope.startDate = new Date(moment().startOf('month').format());
    $scope.endDate = new Date(moment().endOf('month').format());

    $scope.openMenu = ($mdOpenMenu, ev) => {
      $mdOpenMenu(ev);
    };


    $scope._doProcess = () => {
      $scope.showLoading = true;
      let start = moment($scope.startDate).format('YYYY-MM-DD');
      let end = moment($scope.endDate).format('YYYY-MM-DD');

      WorkService.doProcess(start, end)
        .then(data => {
          $scope.attendances = data.rows;
          $scope.showLoading = false;
        }, err => {
          $scope.showLoading = false;
          alert(JSON.stringify(err));
        });
    }

    $scope.doProcess = (ev) => {

      let confirm = $mdDialog.confirm()
        .title('ต้องการประมวลผลข้อมูล ใช่หรือไม่?')
        .textContent('คุณกำลังประมวลผลข้อมูลการสแกนลายนิ้วมือ')
        .ariaLabel('Confirm')
        .targetEvent(ev)
        .ok('ใช่, ต้องการประมวลผล!')
        .cancel('ไม่ใช่, ยกเลิก');

      $mdDialog.show(confirm).then(() => {
        $scope._doProcess();
      }, () => {
        // cancel
      });
    }

    $scope.exportData = () => {
      if ($scope.attendances) {
        let start = moment($scope.startDate).format('YYYY-MM-DD');
        let end = moment($scope.endDate).format('YYYY-MM-DD');
        // url for print
        let url = `/admin/works/print-summary/${start}/${end}`;
        window.open(url, '_blank');
      } else {
        alert('ไม่พบข้อมูลที่ต้องการส่งออก')
      }
    };

    $scope.printSummary = (ev, employee) => {
      let start = moment($scope.startDate).format('YYYY-MM-DD');
      let end = moment($scope.endDate).format('YYYY-MM-DD');

      let url = `/admin/works/print/${employee.employee_code}/${start}/${end}`;

      window.open(url, '_blank');
    }

    $scope.showWorklateDetail = (ev, employee) => {
       let start = moment($scope.startDate).format('YYYY-MM-DD');
       let end = moment($scope.endDate).format('YYYY-MM-DD');

        $rootScope.employee_code = employee.employee_code;
        $rootScope.start = start;
        $rootScope.end = end;
        $rootScope.type = 'late';

        $mdDialog.show({
          controller: 'DialogReportWorkLoadDetail',
          templateUrl: '/partials/admin/work/dialog/worklate-detail',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true
        })
          .then(() => {
            //$scope.status = 'You said the information was "' + answer + '".';
          }, () => {
            //$scope.status = 'You cancelled the dialog.';
          });
    }

    $scope.showExitDetail = (ev, employee) => {
       let start = moment($scope.startDate).format('YYYY-MM-DD');
       let end = moment($scope.endDate).format('YYYY-MM-DD');

        $rootScope.employee_code = employee.employee_code;
        $rootScope.start = start;
        $rootScope.end = end;
        $rootScope.type = 'exit';

        $mdDialog.show({
          controller: 'DialogReportWorkLoadDetail',
          templateUrl: '/partials/admin/work/dialog/worklate-detail',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true
        })
          .then(() => {
            //$scope.status = 'You said the information was "' + answer + '".';
          }, () => {
            //$scope.status = 'You cancelled the dialog.';
          });
    }

    $scope.showNotExitDetail = (ev, employee) => {
       let start = moment($scope.startDate).format('YYYY-MM-DD');
       let end = moment($scope.endDate).format('YYYY-MM-DD');

        $rootScope.employee_code = employee.employee_code;
        $rootScope.start = start;
        $rootScope.end = end;
        $rootScope.type = 'notExit';

        $mdDialog.show({
          controller: 'DialogReportWorkLoadDetail',
          templateUrl: '/partials/admin/work/dialog/worklate-detail',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true
        })
          .then(() => {
            //$scope.status = 'You said the information was "' + answer + '".';
          }, () => {
            //$scope.status = 'You cancelled the dialog.';
          });
    }

  })

  .controller('DialogReportWorkLoadDetail', ($scope, $rootScope, $mdDialog, WorkService) => {
    let employee_code = $rootScope.employee_code;
    let start = $rootScope.start;
    let end = $rootScope.end;

    $scope.details = [];

    if ($rootScope.type == 'late') {
      WorkService.getWorkLateDetail(employee_code, start, end)
        .then(data => {
          let rows = data.rows;
          rows.forEach(v => {
            let obj = {};
            obj.checkin_date = moment(v.date_serve).format('DD/MM') + '/' + (moment(v.date_serve).get('year') + 543);
            obj.in_time = v.in_morning;
            obj.out_time = v.out_morning;

            $scope.details.push(obj);
          })
        });
    } else if ($rootScope.type == 'exit') {
      WorkService.getExitDetail(employee_code, start, end)
        .then(data => {
          let rows = data.rows;
          rows.forEach(v => {
            let obj = {};
            obj.checkin_date = moment(v.date_serve).format('DD/MM') + '/' + (moment(v.date_serve).get('year') + 543);
            obj.in_time = v.in_morning;
            obj.out_time = v.out_morning;

            $scope.details.push(obj);
          })
        });
    } else {
       WorkService.getNotExitDetail(employee_code, start, end)
         .then(data => {
           let rows = data.rows;
           rows.forEach(v => {
             let obj = {};
             obj.checkin_date = moment(v.date_serve).format('DD/MM') + '/' + (moment(v.date_serve).get('year') + 543);
             obj.in_time = v.in_morning;
             obj.out_time = v.out_morning;

             $scope.details.push(obj);
           });
        });
    }

    $scope.cancel = function () {
      $mdDialog.cancel();
    };

  });
