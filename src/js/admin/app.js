'use strict';

angular.module('app', [
  'ui.router',
  'ngMaterial',
  'md.data.table',
  'app.Configure',
  'app.controllers.SideNav',
  'app.controllers.Toolbar',
  'app.admin.controllers.Money',
  'app.admin.controllers.Department',
  'app.admin.controllers.SubDepartment',
  'app.admin.controllers.Employee',
  'app.admin.controllers.MeetingHistory',
  'app.admin.controllers.Meetings',
  'app.admin.controllers.Staff',
  'app.admin.controllers.ReportsMeeting',
  'app.admin.controllers.ReportsDepartment',
  'app.admin.controllers.Drivers',
  'app.admin.controllers.CarRequest'

])
  .config(($mdThemingProvider, $stateProvider, $urlRouterProvider, $mdDateLocaleProvider) => {

  $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    // If you specify less than all of the keys, it will inherit from the
    // default shades
    .accentPalette('pink');


    let shortMonths = ['ม.ค', 'ก.พ', 'มี.ค', 'เม.ย', 'พ.ค', 'มิ.ย', 'ก.ค', 'ส.ค', 'ก.ย', 'ต.ค', 'พ.ย', 'ธ.ค'];

    $mdDateLocaleProvider.months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    $mdDateLocaleProvider.shortMonths = shortMonths;
    $mdDateLocaleProvider.days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    $mdDateLocaleProvider.shortDays = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

    $mdDateLocaleProvider.monthHeaderFormatter = function (date) {
      return shortMonths[date.getMonth()] + ' ' + (date.getFullYear() + 543);
    };

    $mdDateLocaleProvider.formatDate = function (date) {
      return moment(date).format('DD/MM/YYYY');
    };

    $mdDateLocaleProvider.parseDate = function (dateString) {
      var m = moment(dateString, 'L', true);
      return m.isValid() ? m.toDate() : new Date(NaN);
    };


    // Routing Setting
    $urlRouterProvider.otherwise('/meetings');

    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: '/partials/admin/main'
      })
      .state('employee', {
        url: '/employee',
        templateUrl: '/partials/admin/employee',
        controller: 'EmployeeCtrl'
      })
      .state('meetings', {
        url: '/meetings',
        templateUrl: '/partials/admin/meetings',
        controller: 'MeetingsCtrl'
      })
      .state('staff', {
        url: '/staff',
        templateUrl: '/partials/admin/staff',
        controller: 'StaffCtrl'
      })
      .state('money', {
        url: '/money',
        templateUrl: '/partials/admin/money',
        controller: 'MoneyCtrl'
      })
      .state('department', {
        url: '/department',
        templateUrl: '/partials/admin/department',
        controller: 'DepartmentCtrl'
      })
      .state('meeting-history', {
        url: '/meeting-history/:id',
        templateUrl: '/partials/admin/meeting-history',
        controller: 'MeetingHistoryCtrl'
      })
      .state('sub-department', {
        url: '/sub-department',
        templateUrl: '/partials/admin/sub-department',
        controller: 'SubDepartmentCtrl'
      })
      .state('drivers', {
        url: '/drivers',
        templateUrl: '/partials/admin/drivers',
        controller: 'DriverCtrl'
      })
      .state('car-request', {
        url: '/car-request',
        templateUrl: '/partials/admin/car-request',
        controller: 'CarRequestCtrl'
      })
      .state('reports', {
        url: '/reports',
        templateUrl: '/partials/admin/reports'
      })
      .state('reports-meeting', {
        url: '/reports-meeting',
        templateUrl: '/partials/admin/reports/meeting',
        controller: 'ReportsMeetingCtrl'
      })
      .state('reports-department', {
        url: '/reports-department',
        templateUrl: '/partials/admin/reports/department',
        controller: 'ReportsDepartmentCtrl'
      });

  });
  // .run(($rootScope) => {
  //   $rootScope.url = 'http://localhost:3000';
  // });
