'use strict';

angular.module('app', [
  'ui.router',
  'ngMaterial',
  'md.data.table',
  'app.Configure',
  'app.staff.controllers.SideNav',
  'app.staff.controllers.Toolbar',
  'app.staff.controllers.Employee',
  'app.staff.controllers.Meeting',
  'app.staff.controller.Info'
])
  .config(($mdThemingProvider, $stateProvider, $urlRouterProvider, $mdDateLocaleProvider) => {

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

 $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('pink');

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: '/partials/staff/main',
        controller: 'EmployeeCtrl'
      })
      .state('meeting-detail', {
        url: '/meeting/:employeeId',
        templateUrl: '/partials/staff/meeting',
        controller: 'MeetingCtrl'
      })
      .state('info', {
        url: '/info',
        templateUrl: '/partials/staff/info',
        controller: 'InfoCtrl'
      })

  });
  // .run(($rootScope) => {
  //   $rootScope.url = 'http://localhost:3000';
  // });
