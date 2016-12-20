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
          console.log($scope.servicesDate);
          // let _years = _.uniqBy(data.rows, 'ayear');
          // _years.forEach(v => {
          //   let obj = {};
          //   obj.year = v.year;
          //   obj.name = +v.ayear + 543;
          //   $scope.years.push(obj);
          // });

          // let _month = _.uniqBy(data.rows, 'amonth');
        }
    })

    // $scope.years.push({ year: '2016', name: '2559' });
    // $scope.years.push({ year: '2017', name: '2560' });
    // $scope.years.push({ year: '2018', name: '2561' });
    // $scope.years.push({ year: '2019', name: '2562' });

    // $scope.months.push({ month: '01', name: 'มกราคม' });
    // $scope.months.push({ month: '02', name: 'กุมภาพันธ์' });
    // $scope.months.push({ month: '03', name: 'มีนาคม' });
    // $scope.months.push({ month: '04', name: 'เมษายน' });
    // $scope.months.push({ month: '05', name: 'พฤษภาคม' });
    // $scope.months.push({ month: '06', name: 'มิถุนายน' });
    // $scope.months.push({ month: '07', name: 'กรกฎาคม' });
    // $scope.months.push({ month: '08', name: 'สิงหาคม' });
    // $scope.months.push({ month: '09', name: 'กันยายน' });
    // $scope.months.push({ month: '10', name: 'ตุลาคม' });
    // $scope.months.push({ month: '11', name: 'พฤศจิกายน' });
    // $scope.months.push({ month: '12', name: 'ธันวาคม' });

    // $scope.getList = () => {
    //   $scope.showLoading = true;
    //   $scope.showPaging = true;
    //   JobService.listAll()
    //     .then(res => {
    //       let data = res.data;
    //       if (data.ok) {
    //         $scope.showLoading = false;
    //         $scope.employees = [];
    //         data.rows.forEach(v => {
    //           let obj = {};
    //           obj.fullname = `${v.title_name}${v.first_name} ${v.last_name}`;
    //           obj.employee_code = v.employee_code;
    //           obj.employee_id = v.id;

    //           $scope.employees.push(obj);
    //         })
    //       } else {
    //         $scope.showLoading = false;
    //         console.log(data.msg);
    //       }
    //     });
    // };

    $scope.selectedItemChange = (employee) => {
      $scope._employee = employee;
    };

    $scope.showServiceDate = () => {
      // $scope.employeeCode = $scope._employee.employee_code;
      // console.log($scope.employeeDetail);
      // $scope.employeeCode = $scope.employeeDetail.employee_code;
      // console.log($scope.employeeCode);
      // console.log($scope.monthCode);
      // console.log($scope.yearCode);

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

      console.log(_year, _month);
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