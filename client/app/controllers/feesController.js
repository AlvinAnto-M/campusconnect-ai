/**
 * CAMPUSCONNECT AI - Fees & Cost Calculator Controller
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. Two-way data binding with calculations and live re-evaluation
 * 2. Dependency Injection: ['feesService', 'departmentService', 'hostelService', 'transportService', '$rootScope']
 * 3. Form input bindings (ng-model, ng-change)
 * 4. FEATURE 2: Interactive Student College Cost Calculator
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .controller('FeesController', [
      'feesService',
      'departmentService',
      'hostelService',
      'transportService',
      '$rootScope',
      function (feesService, departmentService, hostelService, transportService, $rootScope) {
        var vm = this;

        vm.isLoading = true;
        vm.feeList = [];
        vm.departments = [];
        vm.activeTab = 'calculator'; // 'calculator' | 'all-fees' | 'compare'

        // FEATURE 2: Cost Calculator Model
        vm.calc = {
          departmentId: '',
          years: 4,
          hostelRequired: false,
          hostelRoomFee: 85000,
          transportRequired: false,
          transportRouteFee: 32000,
          scholarshipPercent: 0
        };

        vm.calcResult = null;
        vm.isCalculating = false;

        // Compare fees model
        vm.selectedDeptIds = [];

        // Load all initial fee structures and departments
        vm.init = function () {
          vm.isLoading = true;
          departmentService.getDepartments()
            .then(function (deptRes) {
              vm.departments = deptRes.data || [];
              if (vm.departments.length > 0) {
                vm.calc.departmentId = vm.departments[0]._id;
                vm.selectedDeptIds = [vm.departments[0]._id];
                if (vm.departments[1]) vm.selectedDeptIds.push(vm.departments[1]._id);
              }
              return feesService.getFees();
            })
            .then(function (feeRes) {
              vm.isLoading = false;
              vm.feeList = feeRes.data || [];
              vm.runCalculation();
            })
            .catch(function (err) {
              vm.isLoading = false;
              $rootScope.showToast('Failed to load fee structures.', 'error');
            });
        };

        // Execute dynamic cost calculation
        vm.runCalculation = function () {
          if (!vm.calc.departmentId) return;

          vm.isCalculating = true;
          feesService.calculateCost(vm.calc)
            .then(function (res) {
              vm.isCalculating = false;
              vm.calcResult = res.data;
            })
            .catch(function (err) {
              vm.isCalculating = false;
              $rootScope.showToast('Calculation error: ' + (err.message || 'unknown error'), 'error');
            });
        };

        // Compare selected departments
        vm.compareDepartments = function () {
          if (vm.selectedDeptIds.length < 2) {
            $rootScope.showToast('Please select at least 2 departments to compare fees.', 'warning');
            return;
          }

          feesService.compareFees(vm.selectedDeptIds)
            .then(function (res) {
              vm.comparedFees = res.data || [];
            })
            .catch(function (err) {
              $rootScope.showToast('Failed to load fee comparison.', 'error');
            });
        };

        vm.switchTab = function (tab) {
          vm.activeTab = tab;
          if (tab === 'compare' && (!vm.comparedFees || vm.comparedFees.length === 0)) {
            vm.compareDepartments();
          }
        };

        vm.init();
      }
    ]);

})();
