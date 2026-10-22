/**
 * CAMPUSCONNECT AI - API Base Service
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. AngularJS Service Creation using .service()
 * 2. Dependency Injection: ['$http', '$q']
 * 3. $http for RESTful HTTP requests (GET, POST, PUT, DELETE)
 * 4. $q for Promise chaining, deferred operations, and rejection management
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .service('apiService', ['$http', '$q', function ($http, $q) {
      var baseUrl = '/api';

      // Unified request dispatcher using $http and $q
      function sendRequest(method, endpoint, data, params) {
        var deferred = $q.defer();

        var config = {
          method: method,
          url: baseUrl + endpoint,
          data: data || {},
          params: params || {},
          headers: {
            'Content-Type': 'application/json'
          }
        };

        $http(config)
          .then(function (response) {
            deferred.resolve(response.data);
          })
          .catch(function (error) {
            var errorMessage = 'Network or server error occurred.';
            if (error.data && error.data.message) {
              errorMessage = error.data.message;
            } else if (error.statusText) {
              errorMessage = error.statusText;
            }
            deferred.reject({
              status: error.status,
              message: errorMessage,
              raw: error
            });
          });

        return deferred.promise;
      }

      // Public API methods
      this.get = function (endpoint, params) {
        return sendRequest('GET', endpoint, null, params);
      };

      this.post = function (endpoint, data) {
        return sendRequest('POST', endpoint, data, null);
      };

      this.put = function (endpoint, data) {
        return sendRequest('PUT', endpoint, data, null);
      };

      this.delete = function (endpoint) {
        return sendRequest('DELETE', endpoint, null, null);
      };
    }]);

})();
