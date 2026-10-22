/**
 * CAMPUSCONNECT AI - Dashboard Controller
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. ControllerAs syntax (vm = this)
 * 2. Dependency Injection: ['$q', 'departmentService', 'cutoffService', 'placementService', 'hostelService', 'transportService', 'admissionService', 'authService', '$rootScope']
 * 3. $q.all() for concurrent asynchronous promise resolution
 * 4. Model data binding for dashboard metric cards and quick action links
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .controller('DashboardController', [
      '$q',
      'departmentService',
      'cutoffService',
      'placementService',
      'hostelService',
      'transportService',
      'admissionService',
      'authService',
      '$rootScope',
      function ($q, departmentService, cutoffService, placementService, hostelService, transportService, admissionService, authService, $rootScope) {
        var vm = this;

        vm.isLoading = true;
        vm.currentUser = authService.getCurrentUser();

        // Dashboard stats and data containers
        vm.college = null;
        vm.stats = {
          totalDepartments: 0,
          totalSeats: 0,
          highestPackage: '44 LPA',
          averagePackage: '8.5 LPA',
          totalCompanies: 120,
          availableHostelBeds: 100,
          totalBusRoutes: 4
        };
        vm.popularDepartments = [];
        vm.recentPlacements = [];
        vm.upcomingAdmissionDates = [];
        vm.hostels = [];
        vm.busRoutes = [];

        // Load all dashboard metrics concurrently using $q.all
        vm.initDashboard = function () {
          vm.isLoading = true;

          $q.all([
            departmentService.getDepartmentStats(),
            placementService.getPlacementStats(),
            admissionService.getCollegeInfo(),
            admissionService.getAdmissionInfo(),
            hostelService.getHostels(),
            transportService.getRoutes(),
            cutoffService.getCutoffs({ academicYear: 2025 })
          ])
          .then(function (results) {
            var deptStats = results[0];
            var placeStats = results[1];
            var collegeInfo = results[2];
            var admissionInfo = results[3];
            var hostels = results[4];
            var routes = results[5];
            var cutoffs = results[6];

            if (deptStats) {
              vm.stats.totalDepartments = deptStats.totalDepartments || 7;
              vm.stats.totalSeats = deptStats.totalSeats || 840;
              vm.popularDepartments = deptStats.popularDepartments || [];
            }

            if (placeStats && placeStats.stats) {
              vm.stats.highestPackage = placeStats.stats.highestPackage;
              vm.stats.averagePackage = placeStats.stats.averagePackage;
              vm.stats.totalCompanies = placeStats.stats.totalCompanies;
              vm.recentPlacements = placeStats.topRecruiters ? placeStats.topRecruiters.slice(0, 4) : [];
            }

            if (collegeInfo && collegeInfo.data) {
              vm.college = collegeInfo.data;
            }

            if (admissionInfo && admissionInfo.data && admissionInfo.data.importantDates) {
              vm.upcomingAdmissionDates = admissionInfo.data.importantDates.slice(0, 3);
            }

            if (hostels && hostels.data) {
              vm.hostels = hostels.data;
              var beds = 0;
              hostels.data.forEach(function (h) { beds += (h.availableBeds || 0); });
              vm.stats.availableHostelBeds = beds;
            }

            if (routes && routes.data) {
              vm.busRoutes = routes.data.slice(0, 3);
              vm.stats.totalBusRoutes = routes.data.length;
            }

            vm.isLoading = false;
          })
          .catch(function (error) {
            vm.isLoading = false;
            $rootScope.showToast('Unable to load some dashboard metrics. Offline fallback active.', 'warning');
          });
        };

        // Initialize on controller instantiation
        vm.initDashboard();
      }
    ]);

})();
