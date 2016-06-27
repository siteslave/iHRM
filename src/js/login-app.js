'use strict';

angular.module('app', [
  'ngMaterial'
])
  .config(($mdThemingProvider) => {

 $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('pink');

  });
