/**
 * CAMPUSCONNECT AI - Cutoff Badge Custom Directive
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. Custom Directive with restrict: 'EA' (can be used as element or attribute)
 * 2. Scope binding: status: '@' (one-way string binding)
 * 3. Dynamic template rendering using ng-switch or ng-class
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .directive('cutoffBadge', function () {
      return {
        restrict: 'EA',
        scope: {
          status: '@',
          score: '@'
        },
        template: 
          '<span class="badge-status" ng-class="{' +
            '\'likely\': status === \'Likely\',' +
            '\'borderline\': status === \'Borderline\',' +
            '\'exceeded\': status === \'Historical cutoff exceeded\'' +
          '}">' +
            '<i class="fa-solid" ng-class="{' +
              '\'fa-circle-check text-success\': status === \'Likely\',' +
              '\'fa-triangle-exclamation text-warning\': status === \'Borderline\',' +
              '\'fa-circle-xmark text-danger\': status === \'Historical cutoff exceeded\'' +
            '}"></i>' +
            '<span>{{status || "Historical Record"}}</span>' +
            '<span class="ms-1 opacity-75 font-monospace" ng-if="score">({{score}})</span>' +
          '</span>'
      };
    });

})();
