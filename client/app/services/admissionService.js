/**
 * CAMPUSCONNECT AI - Admission & College Service
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. AngularJS Service architecture
 * 2. Dependency Injection: ['apiService']
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .service('admissionService', ['apiService', function (apiService) {
      this.getAdmissionInfo = function () {
        return apiService.get('/admission');
      };

      this.getCollegeInfo = function () {
        return apiService.get('/admission/college');
      };

      // Admin updates
      this.updateAdmissionInfo = function (data) {
        return apiService.put('/admission', data);
      };
    }]);

})();
