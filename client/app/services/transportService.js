/**
 * CAMPUSCONNECT AI - Transport Service
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. AngularJS Service architecture
 * 2. Dependency Injection: ['apiService']
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .service('transportService', ['apiService', function (apiService) {
      this.getRoutes = function (params) {
        return apiService.get('/transport', params);
      };

      this.getRouteById = function (id) {
        return apiService.get('/transport/' + id);
      };

      // Admin operations
      this.createRoute = function (data) {
        return apiService.post('/transport', data);
      };

      this.updateRoute = function (id, data) {
        return apiService.put('/transport/' + id, data);
      };

      this.deleteRoute = function (id) {
        return apiService.delete('/transport/' + id);
      };
    }]);

})();
