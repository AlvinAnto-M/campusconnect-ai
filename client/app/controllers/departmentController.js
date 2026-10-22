/**
 * CAMPUSCONNECT AI - Department Controller
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. Handling $routeParams for detail views (e.g. /departments/:id)
 * 2. Dependency Injection: ['$routeParams', 'departmentService', 'cutoffService', 'feesService', 'authService', '$rootScope']
 * 3. Array operations, filtering, and multi-selection logic
 * 4. FEATURE 1: Smart Department Comparison (up to 3 departments side-by-side)
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .controller('DepartmentController', [
      '$routeParams',
      'departmentService',
      'cutoffService',
      'feesService',
      'authService',
      '$rootScope',
      function ($routeParams, departmentService, cutoffService, feesService, authService, $rootScope) {
        var vm = this;

        vm.isLoading = true;
        vm.departments = [];
        vm.selectedDegree = 'all';
        vm.searchQuery = '';
        vm.sortOption = 'default';

        // Single department details state
        vm.currentDepartment = null;
        vm.relatedCutoffs = [];
        vm.relatedFee = null;

        // FEATURE 1: Smart Department Comparison State (up to 3)
        vm.compareList = []; // stores department objects
        vm.isComparing = false;

        // Load all departments
        vm.loadDepartments = function () {
          vm.isLoading = true;
          departmentService.getDepartments()
            .then(function (res) {
              vm.isLoading = false;
              vm.departments = res.data || [];
            })
            .catch(function (err) {
              vm.isLoading = false;
              $rootScope.showToast('Failed to load departments.', 'error');
            });
        };

        // Load single department details by $routeParams.id
        vm.loadDepartmentDetail = function (id) {
          vm.isLoading = true;
          departmentService.getDepartmentById(id)
            .then(function (res) {
              vm.isLoading = false;
              if (res.data) {
                vm.currentDepartment = res.data.department;
                vm.relatedCutoffs = res.data.cutoffs || [];
                vm.relatedFee = res.data.feeStructure || null;
              }
            })
            .catch(function (err) {
              vm.isLoading = false;
              $rootScope.showToast('Department details not found.', 'error');
            });
        };

        // Toggle favorite for authenticated user
        vm.toggleFavorite = function (dept) {
          if (!authService.isAuthenticated()) {
            $rootScope.showToast('Please login to save favorite departments to your profile.', 'info');
            return;
          }
          authService.toggleFavorite('departments', dept._id)
            .then(function (res) {
              $rootScope.showToast(res.message, 'success');
            })
            .catch(function (err) {
              $rootScope.showToast('Error updating favorites.', 'error');
            });
        };

        vm.isFavorite = function (deptId) {
          var user = authService.getCurrentUser();
          if (!user || !user.favorites || !user.favorites.departments) return false;
          return user.favorites.departments.some(function (id) {
            return (id._id || id).toString() === deptId.toString();
          });
        };

        // FEATURE 1: Add or remove from comparison
        vm.toggleCompare = function (dept) {
          var index = vm.compareList.findIndex(function (d) { return d._id === dept._id; });
          if (index > -1) {
            vm.compareList.splice(index, 1);
            $rootScope.showToast('Removed ' + dept.departmentCode + ' from comparison.', 'info');
          } else {
            if (vm.compareList.length >= 3) {
              $rootScope.showToast('You can compare a maximum of 3 departments simultaneously.', 'warning');
              return;
            }
            vm.compareList.push(dept);
            $rootScope.showToast('Added ' + dept.departmentCode + ' to comparison!', 'success');
          }
        };

        vm.isInCompare = function (deptId) {
          return vm.compareList.some(function (d) { return d._id === deptId; });
        };

        vm.clearCompare = function () {
          vm.compareList = [];
        };

        // Initialization check: is this a detail view or list view?
        if ($routeParams.id) {
          vm.loadDepartmentDetail($routeParams.id);
        } else {
          vm.loadDepartments();
        }
      }
    ]);

})();
