/**
 * CAMPUSCONNECT AI - Loading Spinner Custom Directive
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. Custom Directive with restrict: 'E' (<loading-spinner>)
 * 2. Two-way data binding: isLoading: '='
 * 3. ng-if directive usage within custom directive template
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .directive('loadingSpinner', function () {
      return {
        restrict: 'E',
        scope: {
          isLoading: '=',
          message: '@'
        },
        template: 
          '<div class="spinner-container" ng-if="isLoading">' +
            '<div class="custom-spinner mb-3"></div>' +
            '<p class="text-muted fw-semibold small mb-0">{{message || "Fetching live data from campus repository..."}}</p>' +
          '</div>'
      };
    });

})();
