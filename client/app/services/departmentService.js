/**
 * CAMPUSCONNECT AI - Department Service
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. AngularJS Service architecture with RESTful communication
 * 2. Dependency Injection: ['apiService']
 * 3. Encapsulating domain logic and separation of concerns
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .service('departmentService', ['apiService', function (apiService) {
      this.getDepartments = function (params) {
        return apiService.get('/departments', params);
      };

      this.getDepartmentById = function (id) {
        return apiService.get('/departments/' + id);
      };

      this.getDepartmentStats = function () {
        return apiService.get('/departments/stats/summary');
      };

      // Admin operations
      this.createDepartment = function (data) {
        return apiService.post('/departments', data);
      };

      this.updateDepartment = function (id, data) {
        return apiService.put('/departments/' + id, data);
      };

      this.deleteDepartment = function (id) {
        return apiService.delete('/departments/' + id);
      };
    }]);

})();
