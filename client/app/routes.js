/**
 * CAMPUSCONNECT AI - AngularJS Routing Configuration
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. Single Page Application (SPA) routing via $routeProvider
 * 2. Controller-View binding per route
 * 3. Route parameters (e.g., :id in /departments/:id)
 * 4. Route metadata (`data` property) for role-based security guards
 * 5. Fallback redirect via .otherwise()
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
      // Use hashbang for universal local static & server compatibility
      $locationProvider.hashPrefix('');

      $routeProvider
        // Home Dashboard
        .when('/', {
          templateUrl: 'app/views/dashboard.html',
          controller: 'DashboardController',
          controllerAs: 'vm'
        })

        // Authentication Views
        .when('/login', {
          templateUrl: 'app/views/login.html',
          controller: 'AuthController',
          controllerAs: 'vm'
        })
        .when('/register', {
          templateUrl: 'app/views/register.html',
          controller: 'AuthController',
          controllerAs: 'vm'
        })

        // Departments & Details
        .when('/departments', {
          templateUrl: 'app/views/departments.html',
          controller: 'DepartmentController',
          controllerAs: 'vm'
        })
        .when('/departments/:id', {
          templateUrl: 'app/views/department-details.html',
          controller: 'DepartmentController',
          controllerAs: 'vm'
        })

        // Cutoffs & Prediction Tool
        .when('/cutoffs', {
          templateUrl: 'app/views/cutoffs.html',
          controller: 'CutoffController',
          controllerAs: 'vm'
        })

        // Fees & Cost Calculator
        .when('/fees', {
          templateUrl: 'app/views/fees.html',
          controller: 'FeesController',
          controllerAs: 'vm'
        })

        // Hostels & Accommodation
        .when('/hostel', {
          templateUrl: 'app/views/hostel.html',
          controller: 'HostelController',
          controllerAs: 'vm'
        })

        // Transport & Bus Routes
        .when('/transport', {
          templateUrl: 'app/views/transport.html',
          controller: 'TransportController',
          controllerAs: 'vm'
        })

        // Placements & Career Cell
        .when('/placements', {
          templateUrl: 'app/views/placements.html',
          controller: 'PlacementController',
          controllerAs: 'vm'
        })

        // Admission Guidance & Checklist
        .when('/admission', {
          templateUrl: 'app/views/admission.html',
          controller: 'AdmissionController',
          controllerAs: 'vm'
        })

        // Standalone AI Chatbot Interface
        .when('/chatbot', {
          templateUrl: 'app/views/chatbot.html',
          controller: 'ChatbotController',
          controllerAs: 'vm'
        })

        // User Profile & Saved Favorites (Protected)
        .when('/profile', {
          templateUrl: 'app/views/profile.html',
          controller: 'ProfileController',
          controllerAs: 'vm',
          data: { requiresAuth: true }
        })

        // Admin Management Console (Admin Protected)
        .when('/admin', {
          templateUrl: 'app/views/admin.html',
          controller: 'AdminController',
          controllerAs: 'vm',
          data: { requiresAuth: true, requiresAdmin: true }
        })

        // Fallback
        .otherwise({
          redirectTo: '/'
        });
    }]);

})();
