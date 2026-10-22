/**
 * CAMPUSCONNECT AI - Admission & Campus Explorer Controller
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. ControllerAs syntax (vm = this)
 * 2. Dependency Injection: ['admissionService', 'authService', '$rootScope']
 * 3. Two-way data binding and live progress calculation (ng-model, ng-change)
 * 4. FEATURE 3: Interactive Admission Readiness Checklist with live progress bar
 * 5. FEATURE 6: Interactive Campus Explorer with block modal/drawer inspection
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .controller('AdmissionController', [
      'admissionService',
      'authService',
      '$rootScope',
      function (admissionService, authService, $rootScope) {
        var vm = this;

        vm.isLoading = true;
        vm.admissionData = null;
        vm.campusBlocks = [];
        vm.selectedBlock = null;
        vm.activeTab = 'guidance'; // 'guidance' | 'checklist' | 'campus-explorer'

        // FEATURE 3: Readiness Checklist Model
        vm.checklist = [
          { name: '10th Standard Mark Sheet (SSLC)', checked: true, note: 'Original + 3 photocopies' },
          { name: '12th Standard / HSC Mark Sheet', checked: true, note: 'Attested copy + DigiLocker copy' },
          { name: 'Transfer Certificate (TC)', checked: false, note: 'Original from School/Junior College' },
          { name: 'Community / Caste Certificate', checked: true, note: 'Issued by competent revenue authority' },
          { name: 'Nativity / Domicile Certificate', checked: false, note: 'Mandatory if studied outside state' },
          { name: 'Income Certificate', checked: false, note: 'Required for fee concessions' },
          { name: 'Government ID Proof (Aadhaar / Passport)', checked: true, note: 'Biometrics must be updated' },
          { name: 'Recent Passport Size Photos (6 Copies)', checked: true, note: 'White background' },
          { name: 'Counselling Call Letter & Allotment Order', checked: false, note: 'Single Window portal printout' }
        ];

        vm.loadAdmission = function () {
          vm.isLoading = true;
          admissionService.getAdmissionInfo()
            .then(function (res) {
              vm.admissionData = res.data;
              return admissionService.getCollegeInfo();
            })
            .then(function (res) {
              vm.isLoading = false;
              vm.campusBlocks = res.campusExplorer || [];
              if (vm.campusBlocks.length > 0) {
                vm.selectedBlock = vm.campusBlocks[0];
              }

              // If user is authenticated and has custom checklist, sync it
              var user = authService.getCurrentUser();
              if (user && user.checklist && user.checklist.length > 0) {
                user.checklist.forEach(function (userItem) {
                  var match = vm.checklist.find(function (c) { return c.name.toLowerCase() === userItem.documentName.toLowerCase(); });
                  if (match) {
                    match.checked = userItem.completed;
                  }
                });
              }
            })
            .catch(function (err) {
              vm.isLoading = false;
              $rootScope.showToast('Failed to load admission details.', 'error');
            });
        };

        // FEATURE 3: Calculate completion statistics
        vm.getCompletedCount = function () {
          return vm.checklist.filter(function (item) { return item.checked; }).length;
        };

        vm.getCompletionPercentage = function () {
          if (vm.checklist.length === 0) return 0;
          return Math.round((vm.getCompletedCount() / vm.checklist.length) * 100);
        };

        vm.toggleChecklistItem = function (item) {
          if (authService.isAuthenticated()) {
            var updatedUserChecklist = vm.checklist.map(function (c) {
              return { documentName: c.name, completed: c.checked };
            });
            authService.updateChecklist(updatedUserChecklist);
          }
        };

        // FEATURE 6: Select Campus Explorer Block
        vm.selectBlock = function (block) {
          vm.selectedBlock = block;
        };

        vm.loadAdmission();
      }
    ]);

})();
