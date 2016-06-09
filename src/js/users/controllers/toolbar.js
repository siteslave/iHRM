'use strict';

angular.module('app.controllers.Toolbar', [])
  .controller('ToolbarCtrl', ($scope, $mdSidenav) => {
    $scope.toggleLeft = () => {
      $mdSidenav('left')
        .toggle();
    };

    $scope.openMenu = ($mdOpenMenu, ev) => {
      $mdOpenMenu(ev);
    }; 

    $scope.showSearch = false;
  });