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
  'app.admin.controllers.Employee'
])
  .config(($mdThemingProvider, $stateProvider, $urlRouterProvider) => {

    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();

    $mdThemingProvider.definePalette('amazingPaletteName', {
      '50': 'ffebee',
      '100': 'ffcdd2',
      '200': 'ef9a9a',
      '300': 'e57373',
      '400': 'ef5350',
      '500': 'f44336',
      '600': 'e53935',
      '700': 'd32f2f',
      '800': 'c62828',
      '900': 'b71c1c',
      'A100': 'ff8a80',
      'A200': 'ff5252',
      'A400': 'ff1744',
      'A700': 'd50000',
      'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
      // on this palette should be dark or light
      'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
        '200', '300', '400', 'A100'],
      'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });

    $mdThemingProvider.theme('default')
      .primaryPalette('amazingPaletteName');


    // Routing Setting
    $urlRouterProvider.otherwise('/');

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
      .state('sub-department', {
        url: '/sub-department',
        templateUrl: '/partials/admin/sub-department',
        controller: 'SubDepartmentCtrl'
      });

  });
  // .run(($rootScope) => {
  //   $rootScope.url = 'http://localhost:3000';
  // });
