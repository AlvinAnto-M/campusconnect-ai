/**
 * CAMPUSCONNECT AI - Password Strength Custom Directive
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. Custom Directive with isolate scope: scope: { password: '=' }
 * 2. $watch hook on model changes
 * 3. Dynamic DOM class and CSS style manipulation based on model validation
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .directive('passwordStrength', function () {
      return {
        restrict: 'E',
        scope: {
          password: '='
        },
        template: 
          '<div class="mt-2" ng-if="password">' +
            '<div class="d-flex justify-content-between align-items-center mb-1">' +
              '<small class="text-muted" style="font-size: 0.75rem;">Password Strength:</small>' +
              '<small class="fw-bold" style="font-size: 0.75rem;" ng-class="strengthClass">{{strengthLabel}}</small>' +
            '</div>' +
            '<div class="password-meter">' +
              '<div class="password-meter-fill" ng-style="meterStyle"></div>' +
            '</div>' +
          '</div>',
        link: function (scope) {
          scope.$watch('password', function (pass) {
            if (!pass) {
              scope.strengthLabel = '';
              scope.strengthClass = '';
              scope.meterStyle = { width: '0%', 'background-color': '#e2e8f0' };
              return;
            }

            var score = 0;
            if (pass.length >= 6) score += 25;
            if (pass.length >= 9) score += 20;
            if (/[A-Z]/.test(pass)) score += 20;
            if (/[0-9]/.test(pass)) score += 20;
            if (/[^A-Za-z0-9]/.test(pass)) score += 15;

            if (score < 40) {
              scope.strengthLabel = 'Weak';
              scope.strengthClass = 'text-danger';
              scope.meterStyle = { width: score + '%', 'background-color': '#ef4444' };
            } else if (score < 75) {
              scope.strengthLabel = 'Medium';
              scope.strengthClass = 'text-warning';
              scope.meterStyle = { width: score + '%', 'background-color': '#f59e0b' };
            } else {
              scope.strengthLabel = 'Strong & Secure';
              scope.strengthClass = 'text-success';
              scope.meterStyle = { width: Math.min(100, score) + '%', 'background-color': '#10b981' };
            }
          });
        }
      };
    });

})();
