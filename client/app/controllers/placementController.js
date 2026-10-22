/**
 * CAMPUSCONNECT AI - Placement Controller
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. ControllerAs syntax (vm = this)
 * 2. Dependency Injection: ['placementService', 'authService', '$rootScope']
 * 3. Multi-facet filtering using AngularJS custom filters and models
 * 4. Statistics aggregation and display
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .controller('PlacementController', [
      'placementService',
      'authService',
      '$rootScope',
      function (placementService, authService, $rootScope) {
        var vm = this;

        vm.isLoading = true;
        vm.companies = [];
        vm.stats = {};
        vm.topRecruiters = [];

        // Filter models
        vm.selectedIndustry = 'all';
        vm.selectedTier = 'all';
        vm.selectedYear = 'all';
        vm.searchQuery = '';
        vm.minLPA = 0;

        vm.loadPlacements = function () {
          vm.isLoading = true;
          placementService.getPlacements()
            .then(function (res) {
              vm.isLoading = false;
              vm.companies = res.data || [];
            })
            .catch(function (err) {
              vm.isLoading = false;
              $rootScope.showToast('Failed to load placement records.', 'error');
            });
        };

        vm.loadStats = function () {
          placementService.getPlacementStats()
            .then(function (res) {
              vm.stats = res.stats || {};
              vm.topRecruiters = res.topRecruiters || [];
            });
        };

        vm.toggleFavoriteCompany = function (company) {
          if (!authService.isAuthenticated()) {
            $rootScope.showToast('Login to bookmark placement companies.', 'info');
            return;
          }

          authService.toggleFavorite('placements', company._id)
            .then(function (res) {
              $rootScope.showToast(res.message, 'success');
            });
        };

        vm.isFavorite = function (companyId) {
          var user = authService.getCurrentUser();
          if (!user || !user.favorites || !user.favorites.placements) return false;
          return user.favorites.placements.some(function (id) {
            return (id._id || id).toString() === companyId.toString();
          });
        };

        vm.init = function () {
          vm.loadPlacements();
          vm.loadStats();
        };

        vm.init();
      }
    ]);

})();
