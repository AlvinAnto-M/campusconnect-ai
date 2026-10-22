/**
 * CAMPUSCONNECT AI - Department Card Custom Directive
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. Custom Directive creation via .directive()
 * 2. Restrict: 'E' (Element Directive: <department-card></department-card>)
 * 3. Isolate Scope with bidirectional ('='), string ('@'), and expression ('&') bindings
 * 4. External templateUrl linkage
 * 5. Controller logic inside directive linking function
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .directive('departmentCard', function () {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          department: '=',
          isFavorite: '=',
          onToggleFavorite: '&'
        },
        templateUrl: 'app/components/department-card/department-card.html',
        link: function (scope) {
          scope.toggleFav = function ($event) {
            $event.stopPropagation();
            if (scope.onToggleFavorite) {
              scope.onToggleFavorite({ dept: scope.department });
            }
          };
        }
      };
    });

})();
