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
  'app.admin.controllers.Meetings'
])
  .config(($mdThemingProvider, $stateProvider, $urlRouterProvider, $mdDateLocaleProvider) => {

  $mdThemingProvider.theme('default')
    .primaryPalette('pink', {
      'default': '400', // by default use shade 400 from the pink palette for primary intentions
      'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
      'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
      'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
    })
    // If you specify less than all of the keys, it will inherit from the
    // default shades
    .accentPalette('purple', {
      'default': '200' // use shade 200 for default, and keep all other shades the same
    });


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
      });

  });
  // .run(($rootScope) => {
  //   $rootScope.url = 'http://localhost:3000';
  // });
