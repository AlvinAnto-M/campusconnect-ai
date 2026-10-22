/**
 * CAMPUSCONNECT AI - Authentication Controller
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. Controller 'ControllerAs' syntax (vm = this)
 * 2. Dependency Injection: ['$location', '$rootScope', 'authService']
 * 3. Form validation ($valid, $dirty, $error)
 * 4. Two-way data binding (ng-model)
 * 5. Event dispatch and reactive UI update
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .controller('AuthController', ['$location', '$rootScope', 'authService', function ($location, $rootScope, authService) {
      var vm = this;

      vm.currentUser = authService.getCurrentUser();
      vm.isLoading = false;
      vm.errorMessage = '';

      // Login form model
      vm.loginData = {
        email: '',
        password: ''
      };

      // Register form model
      vm.registerData = {
        name: '',
        email: '',
        password: '',
        role: 'Student',
        phone: '',
        counsellingRank: '',
        category: 'OC'
      };

      // Handle user login
      vm.login = function (form) {
        if (form && form.$invalid) {
          $rootScope.showToast('Please fill out all required fields correctly.', 'warning');
          return;
        }

        vm.isLoading = true;
        vm.errorMessage = '';

        authService.login(vm.loginData)
          .then(function (res) {
            vm.isLoading = false;
            vm.currentUser = res.user;
            $rootScope.showToast('Welcome back, ' + res.user.name + '!', 'success');
            
            if (res.user.role === 'Admin') {
              $location.path('/admin');
            } else {
              $location.path('/');
            }
          })
          .catch(function (err) {
            vm.isLoading = false;
            vm.errorMessage = err.message || 'Login failed. Please verify credentials.';
            $rootScope.showToast(vm.errorMessage, 'error');
          });
      };

      // Handle user registration
      vm.register = function (form) {
        if (form && form.$invalid) {
          $rootScope.showToast('Please fix form validation errors before submitting.', 'warning');
          return;
        }

        vm.isLoading = true;
        vm.errorMessage = '';

        authService.register(vm.registerData)
          .then(function (res) {
            vm.isLoading = false;
            vm.currentUser = res.user;
            $rootScope.showToast('Registration successful! Welcome to CampusConnect AI.', 'success');
            $location.path('/profile');
          })
          .catch(function (err) {
            vm.isLoading = false;
            vm.errorMessage = err.message || 'Registration failed. Please check inputs.';
            $rootScope.showToast(vm.errorMessage, 'error');
          });
      };

      // Handle logout
      vm.logout = function () {
        authService.logout();
        vm.currentUser = null;
        $rootScope.showToast('You have been logged out.', 'info');
        $location.path('/login');
      };

      // Reactive listener for login success / logout events
      $rootScope.$on('auth:login-success', function (event, user) {
        vm.currentUser = user;
      });

      $rootScope.$on('auth:logout', function () {
        vm.currentUser = null;
      });
    }]);

})();
