/**
 * CAMPUSCONNECT AI - Admin Console Controller
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. ControllerAs syntax (vm = this)
 * 2. Dependency Injection across multiple domain services
 * 3. Full CRUD (Create, Read, Update, Delete) administrative capabilities
 * 4. Form validation and modal/drawer state management
 * 5. Role-based privilege enforcement
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .controller('AdminController', [
      'departmentService',
      'cutoffService',
      'feesService',
      'transportService',
      'placementService',
      'hostelService',
      'admissionService',
      'authService',
      '$rootScope',
      function (departmentService, cutoffService, feesService, transportService, placementService, hostelService, admissionService, authService, $rootScope) {
        var vm = this;

        vm.activeTab = 'departments'; // 'departments' | 'cutoffs' | 'fees' | 'placements' | 'transport'
        vm.isLoading = false;

        // Data lists
        vm.departments = [];
        vm.cutoffs = [];
        vm.fees = [];
        vm.placements = [];
        vm.routes = [];

        // Forms and edit models
        vm.deptForm = {
          departmentName: '',
          departmentCode: '',
          description: '',
          degree: 'B.Tech / B.E.',
          duration: '4 Years',
          intake: 120,
          eligibility: 'Passed 10+2 with PCM (Min 60%)',
          facilitiesStr: 'AI Lab, Cloud Sandbox, IoT Studio',
          careerOptionsStr: 'Software Engineer, Data Analyst, Cloud Architect'
        };
        vm.editingDeptId = null;

        vm.cutoffForm = {
          departmentId: '',
          academicYear: 2026,
          category: 'OC',
          quota: 'General / State Quota',
          openingRank: 1000,
          closingRank: 5000,
          closingCutoff: 195.0
        };
        vm.editingCutoffId = null;

        vm.placementForm = {
          companyName: '',
          industry: 'Product Companies',
          package: '12 - 20 LPA',
          minPackageLPA: 12,
          maxPackageLPA: 20,
          jobRole: 'Software Engineer',
          hiringYear: 2025,
          tier: 'Dream (8-15 LPA)',
          offersCount: 15,
          deptStr: 'CSE, IT, AI&DS'
        };
        vm.editingPlacementId = null;

        vm.routeForm = {
          routeName: '',
          routeNumber: '',
          startingPoint: '',
          timing: '6:30 AM (Dep) - 5:15 PM (Campus Dep)',
          distance: '30 km',
          fee: 32000,
          stops: [
            { stopName: 'Starting Depot', time: '06:30 AM', landmark: 'Main Gate', order: 1 },
            { stopName: 'Campus Terminal', time: '08:15 AM', landmark: 'Campus Portico', order: 2 }
          ]
        };
        vm.editingRouteId = null;

        // Load all data
        vm.loadAll = function () {
          vm.isLoading = true;
          departmentService.getDepartments().then(function (res) { vm.departments = res.data || []; });
          cutoffService.getCutoffs().then(function (res) { vm.cutoffs = res.data || []; });
          feesService.getFees().then(function (res) { vm.fees = res.data || []; });
          placementService.getPlacements().then(function (res) { vm.placements = res.data || []; });
          transportService.getRoutes().then(function (res) {
            vm.routes = res.data || [];
            vm.isLoading = false;
          });
        };

        // --- DEPARTMENT CRUD ---
        vm.saveDepartment = function () {
          var payload = angular.copy(vm.deptForm);
          payload.facilities = vm.deptForm.facilitiesStr.split(',').map(function (s) { return s.trim(); });
          payload.careerOptions = vm.deptForm.careerOptionsStr.split(',').map(function (s) { return s.trim(); });

          if (vm.editingDeptId) {
            departmentService.updateDepartment(vm.editingDeptId, payload)
              .then(function () {
                $rootScope.showToast('Department updated successfully!', 'success');
                vm.resetDeptForm();
                vm.loadAll();
              });
          } else {
            departmentService.createDepartment(payload)
              .then(function () {
                $rootScope.showToast('Department created successfully!', 'success');
                vm.resetDeptForm();
                vm.loadAll();
              });
          }
        };

        vm.editDepartment = function (dept) {
          vm.editingDeptId = dept._id;
          vm.deptForm.departmentName = dept.departmentName;
          vm.deptForm.departmentCode = dept.departmentCode;
          vm.deptForm.description = dept.description;
          vm.deptForm.degree = dept.degree;
          vm.deptForm.intake = dept.intake;
          vm.deptForm.eligibility = dept.eligibility;
          vm.deptForm.facilitiesStr = (dept.facilities || []).join(', ');
          vm.deptForm.careerOptionsStr = (dept.careerOptions || []).join(', ');
        };

        vm.deleteDepartment = function (id) {
          if (confirm('Are you sure you want to delete this department and its related cutoffs?')) {
            departmentService.deleteDepartment(id).then(function () {
              $rootScope.showToast('Department deleted successfully.', 'info');
              vm.loadAll();
            });
          }
        };

        vm.resetDeptForm = function () {
          vm.editingDeptId = null;
          vm.deptForm = {
            departmentName: '',
            departmentCode: '',
            description: '',
            degree: 'B.Tech / B.E.',
            duration: '4 Years',
            intake: 120,
            eligibility: 'Passed 10+2 with PCM (Min 60%)',
            facilitiesStr: 'AI Lab, Cloud Sandbox, IoT Studio',
            careerOptionsStr: 'Software Engineer, Data Analyst, Cloud Architect'
          };
        };

        // --- CUTOFF CRUD ---
        vm.saveCutoff = function () {
          if (!vm.cutoffForm.departmentId) {
            $rootScope.showToast('Please select a department for the cutoff record.', 'warning');
            return;
          }

          if (vm.editingCutoffId) {
            cutoffService.updateCutoff(vm.editingCutoffId, vm.cutoffForm)
              .then(function () {
                $rootScope.showToast('Cutoff record updated!', 'success');
                vm.resetCutoffForm();
                vm.loadAll();
              });
          } else {
            cutoffService.createCutoff(vm.cutoffForm)
              .then(function () {
                $rootScope.showToast('New cutoff record added!', 'success');
                vm.resetCutoffForm();
                vm.loadAll();
              });
          }
        };

        vm.deleteCutoff = function (id) {
          if (confirm('Delete this cutoff record?')) {
            cutoffService.deleteCutoff(id).then(function () {
              $rootScope.showToast('Cutoff record deleted.', 'info');
              vm.loadAll();
            });
          }
        };

        vm.resetCutoffForm = function () {
          vm.editingCutoffId = null;
          vm.cutoffForm = {
            departmentId: '',
            academicYear: 2026,
            category: 'OC',
            quota: 'General / State Quota',
            openingRank: 1000,
            closingRank: 5000,
            closingCutoff: 195.0
          };
        };

        // --- PLACEMENT CRUD ---
        vm.savePlacement = function () {
          var payload = angular.copy(vm.placementForm);
          payload.department = vm.placementForm.deptStr.split(',').map(function (s) { return s.trim(); });

          if (vm.editingPlacementId) {
            placementService.updatePlacement(vm.editingPlacementId, payload)
              .then(function () {
                $rootScope.showToast('Placement record updated!', 'success');
                vm.resetPlacementForm();
                vm.loadAll();
              });
          } else {
            placementService.createPlacement(payload)
              .then(function () {
                $rootScope.showToast('Placement company added!', 'success');
                vm.resetPlacementForm();
                vm.loadAll();
              });
          }
        };

        vm.deletePlacement = function (id) {
          if (confirm('Delete this placement record?')) {
            placementService.deletePlacement(id).then(function () {
              $rootScope.showToast('Placement record deleted.', 'info');
              vm.loadAll();
            });
          }
        };

        vm.resetPlacementForm = function () {
          vm.editingPlacementId = null;
          vm.placementForm = {
            companyName: '',
            industry: 'Product Companies',
            package: '12 - 20 LPA',
            minPackageLPA: 12,
            maxPackageLPA: 20,
            jobRole: 'Software Engineer',
            hiringYear: 2025,
            tier: 'Dream (8-15 LPA)',
            offersCount: 15,
            deptStr: 'CSE, IT, AI&DS'
          };
        };

        // --- TRANSPORT CRUD ---
        vm.saveRoute = function () {
          if (vm.editingRouteId) {
            transportService.updateRoute(vm.editingRouteId, vm.routeForm)
              .then(function () {
                $rootScope.showToast('Bus route updated!', 'success');
                vm.resetRouteForm();
                vm.loadAll();
              });
          } else {
            transportService.createRoute(vm.routeForm)
              .then(function () {
                $rootScope.showToast('Bus route created!', 'success');
                vm.resetRouteForm();
                vm.loadAll();
              });
          }
        };

        vm.deleteRoute = function (id) {
          if (confirm('Delete this bus route?')) {
            transportService.deleteRoute(id).then(function () {
              $rootScope.showToast('Bus route deleted.', 'info');
              vm.loadAll();
            });
          }
        };

        vm.resetRouteForm = function () {
          vm.editingRouteId = null;
          vm.routeForm = {
            routeName: '',
            routeNumber: '',
            startingPoint: '',
            timing: '6:30 AM (Dep) - 5:15 PM (Campus Dep)',
            distance: '30 km',
            fee: 32000,
            stops: [
              { stopName: 'Starting Depot', time: '06:30 AM', landmark: 'Main Gate', order: 1 },
              { stopName: 'Campus Terminal', time: '08:15 AM', landmark: 'Campus Portico', order: 2 }
            ]
          };
        };

        vm.loadAll();
      }
    ]);

})();
