/**
 * CAMPUSCONNECT AI - Fees Service
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. AngularJS Service architecture
 * 2. Dependency Injection: ['apiService']
 * 3. Powering Interactive Cost Calculator and Department Fee Comparisons
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .service('feesService', ['apiService', function (apiService) {
      this.getFees = function () {
        return apiService.get('/fees');
      };

      this.getFeesByDepartment = function (departmentId) {
        return apiService.get('/fees/' + departmentId);
      };

      // Interactive Cost Calculator
      this.calculateCost = function (payload) {
        return apiService.post('/fees/calculate', payload);
      };

      // Compare multiple departments
      this.compareFees = function (departmentIds) {
        return apiService.post('/fees/compare', { departmentIds: departmentIds });
      };

      // Admin operations
      this.createFee = function (data) {
        return apiService.post('/fees', data);
      };

      this.updateFee = function (id, data) {
        return apiService.put('/fees/' + id, data);
      };

      this.deleteFee = function (id) {
        return apiService.delete('/fees/' + id);
      };
    }]);

})();
