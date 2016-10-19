'use strict';

angular.module('app', [
  'ui.router',
  'ngMaterial',
  'md.data.table',
  'app.Configure',
  'app.SideNav',
  'app.Toolbar',
  'app.SubDepartment',
  'app.Staff',
  'app.Report',
  'app.Money',
  'app.Position',
  'app.CarLicense',
  'app.Meeting',
  'app.Employee',
  'app.Driver',
  'app.Department',
  'app.CareRequest',
  'app.AskPermission'
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
      return `${moment(date).format('DD/MM')}/${moment(date).get('year') + 543}`;
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
      .state('position', {
        url: '/position',
        templateUrl: '/partials/admin/position',
        controller: 'PositionCtrl'
      })
      .state('car-license', {
        url: '/car-license',
        templateUrl: '/partials/admin/car-license',
        controller: 'CarLicenseCtrl'
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
      .state('ask-permission', {
        url: '/ask-permission',
        templateUrl: '/partials/admin/ask-permission',
        controller: 'AskPermissionCtrl'
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
