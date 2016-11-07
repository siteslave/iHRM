'use strict';

angular.module('app', [
  'ui.router',
  'ngMaterial',
  'md.data.table',
  'app.Configure',
  'app.controllers.SideNav',
  'app.controllers.Toolbar',
  'app.users.controllers.Meetings',
  'app.users.controllers.Reports',
  'app.users.controllers.Info',
  'app.users.controllers.dialog.MeetingDetail',
  'app.users.controllers.Education',
  'app.users.controllers.CarRequest',
  'app.users.controllers.AskPermission'
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
      return `${moment(date).format('DD/MM')}/${moment(date).get('year') + 543}`;
    };

    $mdDateLocaleProvider.parseDate = function (dateString) {
      var m = moment(dateString, 'L', true);
      return m.isValid() ? m.toDate() : new Date(NaN);
    };

 $mdThemingProvider.theme('default')
    .primaryPalette('blue-grey')
    .accentPalette('orange');

    $urlRouterProvider.otherwise('/meetings');

    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: '/partials/users/main'
      })
      .state('meetings', {
        url: '/meetings',
        templateUrl: '/partials/users/meetings',
        controller: 'MeetingsCtrl'
      })
      .state('reports', {
        url: '/reports',
        templateUrl: '/partials/users/reports',
        controller: 'ReportsCtrl'
      })
      .state('education', {
        url: '/education',
        templateUrl: '/partials/users/education',
        controller: 'EducationCtrl'
      })
      .state('car-request', {
        url: '/car-request',
        templateUrl: '/partials/users/car-request',
        controller: 'CarRequestCtrl'
      })
      .state('ask-permission', {
        url: '/ask-permission',
        templateUrl: '/partials/users/ask-permission',
        controller: 'AskPermissionCtrl'
      })
      .state('info', {
        url: '/info',
        templateUrl: '/partials/users/info',
        controller: 'InfoCtrl'
      });

  });
  // .run(($rootScope) => {
  //   $rootScope.url = 'http://localhost:3000';
  // });
