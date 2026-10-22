/**
 * CAMPUSCONNECT AI - Student Profile & Personalized Dashboard Controller
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. ControllerAs syntax (vm = this)
 * 2. Dependency Injection: ['authService', 'departmentService', 'cutoffService', '$rootScope']
 * 3. FEATURE 4: Personalized Student Dashboard (favorites, rank profiling, customized admission alerts)
 * 4. Form updating and profile synchronization
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .controller('ProfileController', [
      'authService',
      'departmentService',
      'cutoffService',
      '$rootScope',
      function (authService, departmentService, cutoffService, $rootScope) {
        var vm = this;

        vm.isLoading = true;
        vm.user = null;
        vm.isUpdating = false;

        vm.editForm = {
          name: '',
          phone: '',
          counsellingRank: '',
          category: 'OC'
        };

        vm.recommendations = [];

        vm.loadProfile = function () {
          vm.isLoading = true;
          authService.getProfile()
            .then(function (res) {
              vm.isLoading = false;
              vm.user = res.user;

              vm.editForm.name = res.user.name;
              vm.editForm.phone = res.user.phone;
              vm.editForm.counsellingRank = res.user.counsellingRank;
              vm.editForm.category = res.user.category || 'OC';

              // If student has a rank, generate automatic department recommendations!
              if (res.user.counsellingRank) {
                cutoffService.predictCutoff({
                  counsellingRank: res.user.counsellingRank,
                  category: res.user.category || 'OC'
                }).then(function (predRes) {
                  vm.recommendations = predRes.predictions ? predRes.predictions.slice(0, 3) : [];
                });
              }
            })
            .catch(function (err) {
              vm.isLoading = false;
              $rootScope.showToast('Failed to load profile details.', 'error');
            });
        };

        vm.saveProfile = function () {
          vm.isUpdating = true;
          authService.updateProfile(vm.editForm)
            .then(function (res) {
              vm.isUpdating = false;
              vm.user = res.user;
              $rootScope.showToast('Profile and Rank updated successfully!', 'success');
              vm.loadProfile(); // refresh recommendations
            })
            .catch(function (err) {
              vm.isUpdating = false;
              $rootScope.showToast('Error updating profile.', 'error');
            });
        };

        vm.removeFavorite = function (type, itemId) {
          authService.toggleFavorite(type, itemId)
            .then(function (res) {
              $rootScope.showToast('Item removed from favorites.', 'info');
              vm.loadProfile();
            });
        };

        vm.loadProfile();
      }
    ]);

})();
