'use strict';

angular.module('app.users.controllers.Job', ['app.users.services.Job'])
  .controller('JobCtrl', ($scope, $state, JobService, $mdDialog) => {

    $scope.showLoading = false;
    $scope.selectedService = [];
    $scope.serviceType = {};


    // $scope.initialEmployee = () => {
    //   $scope.getList();
    // };

    $scope.servicesDate = [];
    JobService.getAllowed()
      .then(res => {
        let data = res.data;
        if (data.ok) {
          data.rows.forEach(v => {
            let obj = {};
            obj.year = v.ayear;
            obj.month = v.amonth;
            obj.shortMonth = `${v.ayear}-${v.amonth}`;
            let shortDate = `${v.ayear}-${v.amonth}`;
            let _monthName = moment(shortDate, 'YYYY-MM').locale('th').format('MMMM');
            let _yearName = +v.ayear + 543;
            obj.name = `${_monthName} ${_yearName}`;
            $scope.servicesDate.push(obj);
          });
        }
      });


    $scope.selectedItemChange = (employee) => {
      $scope._employee = employee;
    };

    $scope.showServiceDate = () => {
      $scope.showLoading = true;

      let serviceDate = `${$scope.serviceDateCode}-01`;
      let _startDate = +moment(serviceDate, 'YYYY-MM-DD').startOf('month').format('DD');
      let _endDate = +moment(serviceDate, 'YYYY-MM-DD').endOf('month').format('DD');
      
      // console.log(serviceDate, _startDate, _endDate);
      $scope.serviceDates = [];
      $scope.originalSevices = [];
      $scope.selectedService = [];

      for (let x = 0; x <= _endDate - 1; x++) {
        let obj = {};
        obj.date = moment(serviceDate, 'YYYY-MM-DD').add(x, "days").format("YYYY-MM-DD");
        obj.thdate = `${moment(serviceDate, 'YYYY-MM-DD').add(x, "days").format("DD/MM")}/${moment(serviceDate, 'YYYY-MM-DD').add(x, "days").get('year') + 543}`;
        obj.is_process = 'N';
        $scope.serviceDates.push(obj);
      }

      // get job detail

      let dataDates = $scope.serviceDateCode.split('-');
      let _year = dataDates[0];
      let _month = dataDates[1];

      //console.log(_year, _month);
      JobService.getDetail(_year, _month)
        .then(res => {
          let data = res.data;
          if (data.ok) {
            data.rows.forEach(v => {
              let date = moment(v.date_serve).format('YYYY-MM-DD');
              let _idx = _.findIndex($scope.serviceDates, { date: date });
              if (_idx > -1) $scope.serviceDates[_idx].is_process = v.is_process;
              // console.log(v);
              let obj = {};
              obj.date_serve = date;
              obj.service_type = v.service_type;
              obj.is_process = v.is_process;
              $scope.selectedService.push(obj);
            });
            // $scope.originalSevices = $scope.selectedService;
          }

          $scope.showLoading = false;
        });

    };

    $scope.toggle = (date, type) => {
      let idx = _.findIndex($scope.selectedService, { date_serve: date, service_type: type });
      // console.log($scope.selectedService[idx]);
      if (idx > -1) {
        $scope.selectedService.splice(idx, 1);
        let idx2 = _.findIndex($scope.selectedService, { date_serve: date, service_type: type});
        if (idx2 > -1) $scope.selectedService.splice(idx2, 1);
        let idx3 = _.findIndex($scope.selectedService, { date_serve: date, service_type: type});
        if (idx3 > -1) $scope.selectedService.splice(idx3, 1);
      }
      else {
        $scope.selectedService.push({ date_serve: date, service_type: type, is_process: 'N' });
      }
    };

    $scope.isChecked = (date, type) => {
      let idx = _.findIndex($scope.selectedService, { date_serve: date, service_type: type });
      return idx > -1;
    };

    $scope.saveService = () => {
      let data = [];
      // console.log($scope.selectedService);
      $scope.selectedService.forEach(v => {
        let obj = {};
        obj.date_serve = v.date_serve;
        obj.service_type = v.service_type;
        obj.is_process = v.is_process;
        data.push(obj);
      });

      // console.log(data);
      // console.log(data);
      if (data.length) {
        let serviceDate = `${$scope.serviceDateCode}-01`;
        let dataDates = $scope.serviceDateCode.split('-');
        let _year = dataDates[0];
        let _month = dataDates[1];
        
        JobService.save(_year, _month, data)
          .then(res => {

            let _data = res.data;
            if (_data.ok) {
              $mdDialog.show(
                $mdDialog.alert()
                  .clickOutsideToClose(true)
                  .title('Success')
                  .textContent('บันทึกข้อมูลเสร็จเรียบร้อยแล้ว')
                  .ariaLabel('Alert Dialog')
                  .ok('ตกลง')
              );
            }

          });
      }
    };

    $scope.clearSelectedService = () => {
      $scope.selectedService = [];
    };

    $scope.print = () => {
      let serviceDate = `${$scope.serviceDateCode}-01`;
      let _startDate = moment(serviceDate, 'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD');
      let _endDate = moment(serviceDate, 'YYYY-MM-DD').endOf('month').format('YYYY-MM-DD');
      JobService.printTime(_startDate, _endDate);
    }

  });