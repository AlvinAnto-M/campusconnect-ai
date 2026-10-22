/**
 * CAMPUSCONNECT AI - Transport Controller
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. ControllerAs syntax (vm = this)
 * 2. Dependency Injection: ['transportService', '$rootScope']
 * 3. Search query filtering on nested objects (boarding stops)
 * 4. Visual timeline rendering via ng-repeat
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .controller('TransportController', ['transportService', '$rootScope', function (transportService, $rootScope) {
      var vm = this;

      vm.isLoading = true;
      vm.routes = [];
      vm.selectedRoute = null;
      vm.searchQuery = '';
      vm.searchStop = '';

      vm.loadRoutes = function () {
        vm.isLoading = true;
        transportService.getRoutes()
          .then(function (res) {
            vm.isLoading = false;
            vm.routes = res.data || [];
            if (vm.routes.length > 0) {
              vm.selectedRoute = vm.routes[0];
            }
          })
          .catch(function (err) {
            vm.isLoading = false;
            $rootScope.showToast('Failed to load bus routes.', 'error');
          });
      };

      vm.selectRoute = function (route) {
        vm.selectedRoute = route;
      };

      vm.findNearestStop = function () {
        if (!vm.searchStop.trim()) return;

        var term = vm.searchStop.toLowerCase().trim();
        var foundRoute = null;
        var foundStop = null;

        for (var i = 0; i < vm.routes.length; i++) {
          var r = vm.routes[i];
          for (var j = 0; j < r.stops.length; j++) {
            var s = r.stops[j];
            if (s.stopName.toLowerCase().indexOf(term) !== -1 || (s.landmark && s.landmark.toLowerCase().indexOf(term) !== -1)) {
              foundRoute = r;
              foundStop = s;
              break;
            }
          }
          if (foundRoute) break;
        }

        if (foundRoute) {
          vm.selectedRoute = foundRoute;
          $rootScope.showToast('Found boarding stop "' + foundStop.stopName + '" on ' + foundRoute.routeNumber + ' (' + foundStop.time + ')', 'success');
        } else {
          $rootScope.showToast('No direct bus stop matched "' + vm.searchStop + '". Check other routes.', 'warning');
        }
      };

      vm.loadRoutes();
    }]);

})();
