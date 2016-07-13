'use strict';

angular.module('app.Toolbar', [])
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