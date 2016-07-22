'use strict';

angular.module('app.users.controllers.dialogs.EducationNew', [])
  .controller('EducationNewCtrl', ($scope, $mdDialog, $mdToast, EducationService) => {
  
    $scope.education = {};

    $scope.years = ['2558', '2559', '2560', '2561', '2562'];

    $scope.hide = function () {
      $mdDialog.hide();
    };

    $scope.cancel = function () {
      $mdDialog.cancel();
    };

    $scope.save = () => {
      // {requestYear: "2559", course_name: "sdfds", institution: "sdfdsfd", peroid: "dsfdsf"}
      if ($scope.education.requestYear && $scope.education.courseName && $scope.education.institution && $scope.education.peroid) {
        EducationService.save($scope.education)
          .then(res => {
            let data = res.data;
            if (data.ok) {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('Saved!')
                  .position('right top')
                  .hideDelay(3000)
              );

            $mdDialog.hide();
            } else {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('เกิดข้อผิดพลาด: ' + JSON.stringify(data.msg))
                  .position('right top')
                  .hideDelay(3000)
              );
            }
        })
      } else {
        
      }
    };
    
  });