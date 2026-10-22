/**
 * CAMPUSCONNECT AI - Cutoff Service
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. AngularJS Service architecture
 * 2. Dependency Injection: ['apiService']
 * 3. Handling analytical queries, multi-year comparisons, and predictive guidance
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .service('cutoffService', ['apiService', function (apiService) {
      this.getCutoffs = function (params) {
        return apiService.get('/cutoffs', params);
      };

      this.getCutoffsByDepartment = function (departmentId) {
        return apiService.get('/cutoffs/' + departmentId);
      };

      // Admission guidance predictor
      this.predictCutoff = function (criteria) {
        return apiService.post('/cutoffs/predict', criteria);
      };

      // Historical trend analytics
      this.getTrends = function (params) {
        return apiService.get('/cutoffs/analytics/trends', params);
      };

      // Admin operations
      this.createCutoff = function (data) {
        return apiService.post('/cutoffs', data);
      };

      this.updateCutoff = function (id, data) {
        return apiService.put('/cutoffs/' + id, data);
      };

      this.deleteCutoff = function (id) {
        return apiService.delete('/cutoffs/' + id);
      };
    }]);

})();
