/**
 * CAMPUSCONNECT AI - Hostel Service
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. AngularJS Service architecture
 * 2. Dependency Injection: ['apiService']
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .service('hostelService', ['apiService', function (apiService) {
      this.getHostels = function (params) {
        return apiService.get('/hostel', params);
      };

      this.getHostelById = function (id) {
        return apiService.get('/hostel/' + id);
      };

      // Admin operations
      this.addHostel = function (data) {
        return apiService.post('/hostel', data);
      };

      this.updateHostel = function (id, data) {
        return apiService.put('/hostel/' + id, data);
      };

      this.deleteHostel = function (id) {
        return apiService.delete('/hostel/' + id);
      };
    }]);

})();
