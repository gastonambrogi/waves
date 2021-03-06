'use strict';

/**
 * @ngdoc directive
 * @name wavesApp.directive:clock
 * @description
 * # clock
 */
angular.module('wavesApp')
  .directive('clock', function () {
    return {
      templateUrl: 'views/directives/clock.html',
      replace:true,
      restrict: 'E',
      controller:'TimeCtrl',
      controllerAs: 'time'
    };
  });
