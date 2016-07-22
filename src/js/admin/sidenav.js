'use strict';

angular.module('app.SideNav', [])
.controller('SideNavCtrl', ($scope, $state, $mdBottomSheet, $mdSidenav) => {
  
  $scope.toggleSidenav = function (menuId) {
    $mdSidenav(menuId).toggle();
  };

  $scope.go = (state) => {
    $state.go(state);
  }; 
  
});