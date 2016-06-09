'use strict';

angular.module('app', [
  'ui.router',
  'ngMaterial',
  'md.data.table',
  'app.Configure',
  'app.controllers.SideNav',
  'app.controllers.Toolbar',
  'app.users.controllers.Meetings',
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

    // $mdThemingProvider.definePalette('amazingPaletteName', {
    //   '50': 'ffebee',
    //   '100': 'ffcdd2',
    //   '200': 'ef9a9a',
    //   '300': 'e57373',
    //   '400': 'ef5350',
    //   '500': 'f44336',
    //   '600': 'e53935',
    //   '700': 'd32f2f',
    //   '800': 'c62828',
    //   '900': 'b71c1c',
    //   'A100': 'ff8a80',
    //   'A200': 'ff5252',
    //   'A400': 'ff1744',
    //   'A700': 'd50000',
    //   'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
    //   // on this palette should be dark or light
    //   'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
    //     '200', '300', '400', 'A100'],
    //   'contrastLightColors': undefined    // could also specify this if default was 'dark'
    // });

    // $mdThemingProvider.theme('default')
    //   .primaryPalette('amazingPaletteName');


    // Routing Setting
    $urlRouterProvider.otherwise('/');

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

  });
  // .run(($rootScope) => {
  //   $rootScope.url = 'http://localhost:3000';
  // });
