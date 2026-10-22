/**
 * CAMPUSCONNECT AI - Placement Service
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. AngularJS Service architecture
 * 2. Dependency Injection: ['apiService']
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .service('placementService', ['apiService', function (apiService) {
      this.getPlacements = function (params) {
        return apiService.get('/placements', params);
      };

      this.getPlacementStats = function () {
        return apiService.get('/placements/stats/summary');
      };

      // Admin operations
      this.createPlacement = function (data) {
        return apiService.post('/placements', data);
      };

      this.updatePlacement = function (id, data) {
        return apiService.put('/placements/' + id, data);
      };

      this.deletePlacement = function (id) {
        return apiService.delete('/placements/' + id);
      };
    }]);

})();
