'use strict';

angular.module('app.staff.controllers.Job', ['app.staff.services.Job'])
  .controller('JobCtrl', ($scope, $state, JobService, $mdDialog) => {

    $scope.showLoading = false;
    $scope.selectedService = [];
    $scope.serviceType = {};


    $scope.initialEmployee = () => {
      $scope.getList();
    };

    $scope.months = [];
    $scope.years = [];

    $scope.years.push({ year: '2016', name: '2559' });
    $scope.years.push({ year: '2017', name: '2560' });
    $scope.years.push({ year: '2018', name: '2561' });
    $scope.years.push({ year: '2019', name: '2562' });

    $scope.months.push({ month: '01', name: 'มกราคม' });
    $scope.months.push({ month: '02', name: 'กุมภาพันธ์' });
    $scope.months.push({ month: '03', name: 'มีนาคม' });
    $scope.months.push({ month: '04', name: 'เมษายน' });
    $scope.months.push({ month: '05', name: 'พฤษภาคม' });
    $scope.months.push({ month: '06', name: 'มิถุนายน' });
    $scope.months.push({ month: '07', name: 'กรกฎาคม' });
    $scope.months.push({ month: '08', name: 'สิงหาคม' });
    $scope.months.push({ month: '09', name: 'กันยายน' });
    $scope.months.push({ month: '10', name: 'ตุลาคม' });
    $scope.months.push({ month: '11', name: 'พฤศจิกายน' });
    $scope.months.push({ month: '12', name: 'ธันวาคม' });

    $scope.getList = () => {
      $scope.showLoading = true;
      $scope.showPaging = true;
      JobService.listAll()
        .then(res => {
          let data = res.data;
          if (data.ok) {
            $scope.showLoading = false;
            $scope.employees = [];
            data.rows.forEach(v => {
              let obj = {};
              obj.fullname = `${v.title_name}${v.first_name} ${v.last_name}`;
              obj.employee_code = v.employee_code;
              obj.employee_id = v.id;

              $scope.employees.push(obj);
            })
          } else {
            $scope.showLoading = false;
            console.log(data.msg);
          }
        });
    };

    $scope.selectedItemChange = (employee) => {
      $scope._employee = employee;
    };

    $scope.showServiceDate = () => {
      // $scope.employeeCode = $scope._employee.employee_code;
      console.log($scope.employeeDetail);
      $scope.employeeCode = $scope.employeeDetail.employee_code;
      console.log($scope.employeeCode);
      // console.log($scope.monthCode);
      // console.log($scope.yearCode);

      $scope.selectedService = [];

      let serviceDate = `${$scope.yearCode}-${$scope.monthCode}-01`;
      let _startDate = +moment(serviceDate, 'YYYY-MM-DD').startOf('month').format('DD');
      let _endDate = +moment(serviceDate, 'YYYY-MM-DD').endOf('month').format('DD');
      $scope.serviceDates = [];

      for (let x = 0; x <= _endDate - 1; x++) {
        let obj = {};
        obj.date = moment(serviceDate, 'YYYY-MM-DD').add(x, "days").format("YYYY-MM-DD");
        obj.thdate = `${moment(serviceDate, 'YYYY-MM-DD').add(x, "days").format("DD/MM")}/${moment(serviceDate, 'YYYY-MM-DD').add(x, "days").get('year') + 543}`;
        $scope.serviceDates.push(obj);
      }

      // get job detail

      JobService.getDetail($scope.employeeCode, $scope.yearCode, $scope.monthCode)
        .then(res => {
          let data = res.data;
          if (data.ok) {
            data.rows.forEach(v => {
              let date = moment(v.date_serve).format('YYYY-MM-DD');
              $scope.selectedService.push({ date_serve: date, service_type: v.service_type, employee_code: v.employee_code });
            });
          }
        });

    };

    $scope.toggle = (date, type) => {
      let idx = _.findIndex($scope.selectedService, { date_serve: date, service_type: type });
      if (idx > -1) {
        $scope.selectedService.splice(idx, 1);
        let idx2 = _.findIndex($scope.selectedService, { date_serve: date, service_type: type });
        if (idx2 > -1) $scope.selectedService.splice(idx2, 1);
        let idx3 = _.findIndex($scope.selectedService, { date_serve: date, service_type: type });
        if (idx3 > -1) $scope.selectedService.splice(idx3, 1);
      }
      else {
        $scope.selectedService.push({ date_serve: date, service_type: type, employee_code: $scope.employeeCode });
      }
    };

    $scope.isChecked = (date, type) => {
      let idx = _.findIndex($scope.selectedService, { date_serve: date, service_type: type, employee_code: $scope.employeeCode });
      return idx > -1;
    };

    $scope.saveService = () => {
      let data = [];

      $scope.selectedService.forEach(v => {
        let idx = _.findIndex(data, { date_serve: v.date_serve, service_type: v.service_type });
        if (idx == -1) {
          data.push(v);
        }
      });

      // console.log(data);

      if (data.length) {
        JobService.save($scope.employeeCode, $scope.yearCode, $scope.monthCode, data)
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


    // $scope.toggleAllMorning = () => {
    //   console.log($scope.toggleAllM);
    //     if ($scope.selected.length === $scope.items.length) {
    //     $scope.selected = [];
    //     } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
    //       $scope.selected = $scope.items.slice(0);
    //     }

    // };


    let createFilterFor = (query) => {


    }

    $scope.querySearch = (query) => {
      let results = [];
      $scope.employees.forEach(v => {
        if (v.fullname.includes(query.toLowerCase())) results.push(v);
      });

      return results;
    }
    // initial data
    $scope.initialEmployee();



  });