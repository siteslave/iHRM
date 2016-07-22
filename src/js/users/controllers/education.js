'use strict'; 

angular.module('app.users.controllers.Education', [
  'app.users.services.Education',
  'app.users.controllers.dialogs.EducationNew',
  'app.users.controllers.dialogs.EducationUpdate'
])
  .controller('EducationCtrl', ($scope, $rootScope, $mdDialog, $mdToast, EducationService) => {
  

  $scope.openMenu = ($mdOpenMenu, ev) => {
      $mdOpenMenu(ev);
    };

    $scope.showLoading = false;
    $scope.educations = [];
    $scope.total = 0;

    $scope.query = {
      limit: 20,
      page: 1
    };

    $scope.onPaginate = (page, limit) => {
      let offset = (page - 1) * limit;
      $scope.getList(limit, offset);
    };


    $scope.getTotal = () => {
      EducationService.total()
        .then(res => {
          let data = res.data;
          $scope.total = data.total;
        }, err => {
          // connection error
        });
    };

    $scope.initialData = () => {

      let limit = $scope.query.limit;
      let offset = ($scope.query.page - 1) * $scope.query.limit;

      $scope.getTotal();
      $scope.getList(limit, offset);
    };

    $scope.getList = (limit, offset) => {
      $scope.showLoading = true;
      $scope.educations = [];

      EducationService.list(limit, offset)
        .then(res => {
          let data = res.data;
          if (data.ok) {
            $scope.showLoading = false;
            $scope.educations = data.rows;
          } else {
            $scope.showLoading = false;
            console.log(data.msg);
          }
        });
    };
    
    
    $scope.addNew = (ev) => {
      $mdDialog.show({
        controller: 'EducationNewCtrl',
        templateUrl: '/partials/users/education/dialogs/new',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false
      })
        .then(() => {
          $scope.getList();
        }, () => {

        });
    };


    $scope.edit = (ev, education) => {
      $rootScope.currentEducation = education;

      $mdDialog.show({
        controller: 'EducationUpdateCtrl',
        templateUrl: '/partials/users/education/dialogs/new',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false
      })
        .then(() => {
          $scope.getList();
        }, () => {

        });
    };


    $scope.remove = (ev, education) => {
      
      var confirm = $mdDialog.confirm()
        .title('Are sure?')
        .textContent('คุณต้องการลบรายการนี้ [' + education.course_name + '] ใช่หรือไม่?')
        .ariaLabel('Confirm delete')
        .targetEvent(ev)
        .ok('ใช่, ต้องการลบ!')
        .cancel('ไม่ใช่, ยกเลิก');
      
      $mdDialog.show(confirm).then(function () {
        EducationService.remove(education.id)
          .then(res => {
            let data = res.data;
            if (data.ok) {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('ลบรายการเสร็จเรียบร้อยแล้ว!')
                  .position('right top')
                  .hideDelay(3000)
              );
              $mdDialog.hide();
              $scope.getList();
            } else {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('ไม่สามารถลบรายการได้ : ' + JSON.stringify(data.msg))
                  .position('right top')
                  .hideDelay(3000)
              );
            }
          })
      }, function () {
        //
      });
      
    };
    


    $scope.initialData();
    
  });