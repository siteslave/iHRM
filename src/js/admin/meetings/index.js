'use strict';

angular.module('app.Meeting', [
  'app.Meeting.Controller',
  'app.Meeting.dialog.Update',
  'app.Meeting.dialog.New',
  'app.Meeting.dialog.Assign',
  'app.Meeting.dialog.Registered',
  'app.Meeting.Service',
  'app.Department.Service'
]);