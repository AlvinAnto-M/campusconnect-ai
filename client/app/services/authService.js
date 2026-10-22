/**
 * CAMPUSCONNECT AI - Authentication Service
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. AngularJS Service architecture
 * 2. Dependency Injection: ['apiService', '$window', '$rootScope', '$q']
 * 3. LocalStorage persistence for JWT tokens and active session user
 * 4. Event broadcasting ($rootScope.$broadcast) for reactive cross-controller updates
 * 5. Role-based privilege verification (Student vs Prospective Student vs Admin)
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .service('authService', ['apiService', '$window', '$rootScope', '$q', function (apiService, $window, $rootScope, $q) {
      var self = this;
      var TOKEN_KEY = 'cc_token';
      var USER_KEY = 'cc_user';

      // Load cached user on initialization
      var cachedUser = null;
      try {
        var stored = $window.localStorage.getItem(USER_KEY);
        if (stored) {
          cachedUser = JSON.parse(stored);
        }
      } catch (e) {
        cachedUser = null;
      }

      this.getCurrentUser = function () {
        return cachedUser;
      };

      this.getToken = function () {
        return $window.localStorage.getItem(TOKEN_KEY);
      };

      this.isAuthenticated = function () {
        return !!self.getToken();
      };

      this.isAdmin = function () {
        return cachedUser && cachedUser.role === 'Admin';
      };

      this.login = function (credentials) {
        return apiService.post('/auth/login', credentials)
          .then(function (res) {
            if (res.token && res.user) {
              $window.localStorage.setItem(TOKEN_KEY, res.token);
              $window.localStorage.setItem(USER_KEY, JSON.stringify(res.user));
              cachedUser = res.user;
              $rootScope.$broadcast('auth:login-success', cachedUser);
            }
            return res;
          });
      };

      this.register = function (userData) {
        return apiService.post('/auth/register', userData)
          .then(function (res) {
            if (res.token && res.user) {
              $window.localStorage.setItem(TOKEN_KEY, res.token);
              $window.localStorage.setItem(USER_KEY, JSON.stringify(res.user));
              cachedUser = res.user;
              $rootScope.$broadcast('auth:login-success', cachedUser);
            }
            return res;
          });
      };

      this.logout = function () {
        $window.localStorage.removeItem(TOKEN_KEY);
        $window.localStorage.removeItem(USER_KEY);
        cachedUser = null;
        $rootScope.$broadcast('auth:logout');
      };

      this.getProfile = function () {
        return apiService.get('/auth/me')
          .then(function (res) {
            if (res.user) {
              cachedUser = res.user;
              $window.localStorage.setItem(USER_KEY, JSON.stringify(res.user));
            }
            return res;
          });
      };

      this.updateProfile = function (data) {
        return apiService.put('/auth/profile', data)
          .then(function (res) {
            if (res.user) {
              cachedUser = res.user;
              $window.localStorage.setItem(USER_KEY, JSON.stringify(res.user));
              $rootScope.$broadcast('user:profile-updated', cachedUser);
            }
            return res;
          });
      };

      this.toggleFavorite = function (type, itemId) {
        return apiService.post('/auth/favorite', { type: type, itemId: itemId })
          .then(function (res) {
            if (cachedUser && res.favorites) {
              cachedUser.favorites = res.favorites;
              $window.localStorage.setItem(USER_KEY, JSON.stringify(cachedUser));
              $rootScope.$broadcast('user:favorites-updated', cachedUser.favorites);
            }
            return res;
          });
      };

      this.updateChecklist = function (checklist) {
        return apiService.put('/auth/checklist', { checklist: checklist })
          .then(function (res) {
            if (cachedUser && res.checklist) {
              cachedUser.checklist = res.checklist;
              $window.localStorage.setItem(USER_KEY, JSON.stringify(cachedUser));
            }
            return res;
          });
      };
    }]);

})();
