'use strict';

angular.module('app.admin.controllers.dialogs.MeetingRegistered', [])
  .controller('MeetingRegisteredCtrl', ($scope, $rootScope, $mdDialog, $mdToast, MeetingService) => {

    $scope.meeting = $rootScope.currentMeeting;
    $scope.members = [];
    $scope.selected = [];

    $scope.hide = function () {
      $mdDialog.hide();
    };
    $scope.cancel = function () {
      $mdDialog.cancel();
    };

    MeetingService.getEmployeeApproved($scope.meeting.id)
      .then(res => {
        let data = res.data;

        data.rows.forEach(v => {
          $scope.selected.push(v);
        });

        console.log($scope.selected);
      });

    $scope.getRegisteredList = () => {
      MeetingService.getRegisteredList($scope.meeting.id)
        .then(res => {
          let data = res.data;
          //  $scope.members = data.rows;
          //  console.log(data);
           data.rows.forEach(v => {
             let obj = {};
             obj.approveStatus = v.approve_status;
             obj.employeeId = v.employee_id;
             obj.firstName = v.first_name;
             obj.lastName = v.last_name;
             obj.titleName = v.title_name;
             obj.meetingId = v.meeting_id;
             obj.positionName = v.position_name;
             obj.registerDate = `${moment(v.register_date).format('DD/MM')}/${moment(v.register_date).get('year') + 543}`;
             obj.subName = v.sub_name;
             obj.transportName = v.transport_name;
             $scope.members.push(obj);
           });

        }, () => {
          console.log('Connection failed')
        });

    };

    $scope.toggle = (employeeId) => {
      let idx = $scope.selected.indexOf(employeeId);
      if (idx > -1) {
        $scope.selected.splice(idx, 1);
      } else {
        $scope.selected.push(employeeId);
      }
    };

    $scope.exist = (employeeId) => {
      return $scope.selected.indexOf(employeeId) > -1;
    };

    $scope.save = () => {
      //console.log($scope.selected);
      MeetingService.approveRegistered($scope.meeting.id, $scope.selected)
        .then(res => {
          let data = res.data;
          if (data.ok) {
            $mdToast.show(
              $mdToast.simple()
                .textContent('ปรับปรุงการอนุมัติเสร็จเรียบร้อยแล้ว')
                .position('right top')
                .hideDelay(3000)
            );
            $mdDialog.hide();
          } else {
            $mdToast.show(
              $mdToast.simple()
                .textContent('Error: ' + JSON.stringify(data.msg))
                .position('right top')
                .hideDelay(3000)
            );
          }
        }, () => {
          $mdToast.show(
            $mdToast.simple()
              .textContent('Connection error')
              .position('right top')
              .hideDelay(3000)
          );
        });
    };

    $scope.getRegisteredList();

  });