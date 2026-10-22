/**
 * CAMPUSCONNECT AI - AngularJS Main Application Module
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. Module Definition: angular.module('campusConnectApp', [...])
 * 2. Dependency Injection: ['ngRoute', 'ngAnimate', 'ngSanitize']
 * 3. Configuration Block: app.config()
 * 4. Run Block: app.run() for route guards and authentication persistence
 * 5. HTTP Interceptors: Attaching JWT Bearer token automatically to every $http request
 */

(function () {
  'use strict';

  var app = angular.module('campusConnectApp', [
    'ngRoute',
    'ngAnimate',
    'ngSanitize'
  ]);

  // CONFIGURATION BLOCK: Routing & HTTP Interceptors
  app.config(['$httpProvider', function ($httpProvider) {
    // Interceptor for JWT authentication
    $httpProvider.interceptors.push(['$q', '$window', '$rootScope', function ($q, $window, $rootScope) {
      return {
        // Request hook: inject JWT token from localStorage if available
        request: function (config) {
          var token = $window.localStorage.getItem('cc_token');
          if (token && config.url.indexOf('/api') !== -1) {
            config.headers.Authorization = 'Bearer ' + token;
          }
          return config;
        },
        // Response error hook: handle 401 Unauthorized globally
        responseError: function (rejection) {
          if (rejection.status === 401) {
            // Token expired or invalid
            $window.localStorage.removeItem('cc_token');
            $window.localStorage.removeItem('cc_user');
            $rootScope.$broadcast('auth:logout');
          }
          return $q.reject(rejection);
        }
      };
    }]);
  }]);

  // RUN BLOCK: Global initialization, Route guards, User session persistence
  app.run(['$rootScope', '$location', '$window', 'authService', function ($rootScope, $location, $window, authService) {
    // Global notification toast system
    $rootScope.toasts = [];

    $rootScope.showToast = function (message, type) {
      var toast = {
        id: Date.now(),
        message: message,
        type: type || 'info'
      };
      $rootScope.toasts.push(toast);

      // Auto dismiss after 4 seconds
      setTimeout(function () {
        $rootScope.$apply(function () {
          var index = $rootScope.toasts.indexOf(toast);
          if (index !== -1) {
            $rootScope.toasts.splice(index, 1);
          }
        });
      }, 4000);
    };

    $rootScope.removeToast = function (index) {
      $rootScope.toasts.splice(index, 1);
    };

    // Chatbot floating window state
    $rootScope.isChatbotOpen = false;
    $rootScope.toggleChatbot = function () {
      $rootScope.isChatbotOpen = !$rootScope.isChatbotOpen;
    };

    // Listen to route changes for role-based authorization guard
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
      var currentUser = authService.getCurrentUser();

      if (next && next.data) {
        // Check if authentication is required
        if (next.data.requiresAuth && !authService.isAuthenticated()) {
          event.preventDefault();
          $rootScope.showToast('Please login to access this section.', 'warning');
          $location.path('/login');
          return;
        }

        // Check if admin role is required
        if (next.data.requiresAdmin && (!currentUser || currentUser.role !== 'Admin')) {
          event.preventDefault();
          $rootScope.showToast('Access denied: Admin privileges required.', 'error');
          $location.path('/');
          return;
        }
      }
    });

    // Helper for active navigation link check
    $rootScope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };

    // College global brand info
    $rootScope.portalInfo = {
      appName: 'CampusConnect AI',
      subtitle: 'Smart College Guidance & Assistance Portal',
      year: 2026
    };
  }]);

})();
