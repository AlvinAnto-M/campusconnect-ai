/**
 * CAMPUSCONNECT AI - Cutoff & Prediction Controller
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. Form validation and mathematical prediction algorithm integration
 * 2. Dependency Injection: ['cutoffService', 'departmentService', 'authService', '$rootScope', '$timeout']
 * 3. Dynamic third-party library integration (Chart.js for multi-department trend analytics)
 * 4. Two-way data binding (ng-model="vm.predictForm.rank")
 * 5. Conditional view rendering (ng-if, ng-switch)
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .controller('CutoffController', [
      'cutoffService',
      'departmentService',
      'authService',
      '$rootScope',
      '$timeout',
      function (cutoffService, departmentService, authService, $rootScope, $timeout) {
        var vm = this;

        vm.isLoading = false;
        vm.cutoffs = [];
        vm.departments = [];
        var trendChartInstance = null;

        // Filter model for cutoff records table
        vm.filter = {
          academicYear: '2025',
          category: 'OC',
          quota: 'General / State Quota',
          departmentId: 'all'
        };

        // Prediction tool model ("Can I Get This Department?")
        var currentUser = authService.getCurrentUser();
        vm.predictForm = {
          counsellingRank: currentUser && currentUser.counsellingRank ? currentUser.counsellingRank : 4500,
          category: currentUser && currentUser.category ? currentUser.category : 'OC',
          quota: 'General / State Quota',
          departmentId: 'all'
        };

        vm.predictionResults = null;
        vm.isPredicting = false;
        vm.activeTab = 'predictor'; // 'predictor' | 'records' | 'trends'

        // Load departments list for dropdowns
        vm.loadDepartments = function () {
          departmentService.getDepartments().then(function (res) {
            vm.departments = res.data || [];
          });
        };

        // Load historical cutoffs based on current filters
        vm.loadCutoffs = function () {
          vm.isLoading = true;
          cutoffService.getCutoffs(vm.filter)
            .then(function (res) {
              vm.isLoading = false;
              vm.cutoffs = res.data || [];
            })
            .catch(function (err) {
              vm.isLoading = false;
              $rootScope.showToast('Failed to load cutoff records.', 'error');
            });
        };

        // Execute "Can I Get This Department?" prediction analysis
        vm.runPrediction = function () {
          if (!vm.predictForm.counsellingRank || vm.predictForm.counsellingRank <= 0) {
            $rootScope.showToast('Please enter a valid positive counselling rank number.', 'warning');
            return;
          }

          vm.isPredicting = true;
          cutoffService.predictCutoff(vm.predictForm)
            .then(function (res) {
              vm.isPredicting = false;
              vm.predictionResults = res;
              $rootScope.showToast('Historical analysis completed for Rank #' + vm.predictForm.counsellingRank, 'success');
            })
            .catch(function (err) {
              vm.isPredicting = false;
              $rootScope.showToast(err.message || 'Error executing admission prediction.', 'error');
            });
        };

        // FEATURE 5: Cutoff Trend Analytics with Chart.js
        vm.loadTrendsAndRenderChart = function () {
          cutoffService.getTrends({ category: vm.filter.category, quota: vm.filter.quota })
            .then(function (res) {
              $timeout(function () {
                renderChart(res);
              }, 50);
            })
            .catch(function (err) {
              $rootScope.showToast('Failed to load trend analytics data.', 'error');
            });
        };

        function renderChart(trendData) {
          var ctx = document.getElementById('cutoffTrendChart');
          if (!ctx) return;

          if (trendChartInstance) {
            trendChartInstance.destroy();
          }

          var chartDatasets = trendData.datasets.map(function (item) {
            return {
              label: item.departmentCode + ' - ' + item.departmentName,
              data: item.closingCutoffs,
              borderColor: item.color || '#2563eb',
              backgroundColor: 'transparent',
              borderWidth: 3,
              tension: 0.35,
              pointRadius: 5,
              pointHoverRadius: 8
            };
          });

          // Check if Chart.js is loaded
          if (typeof Chart !== 'undefined') {
            trendChartInstance = new Chart(ctx, {
              type: 'line',
              data: {
                labels: trendData.years.map(function (y) { return 'Year ' + y; }),
                datasets: chartDatasets
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return context.dataset.label + ': ' + context.parsed.y + ' / 200 Cutoff';
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    min: 150,
                    max: 200,
                    title: { display: true, text: 'Closing Cutoff Score (out of 200)' }
                  }
                }
              }
            });
          }
        }

        vm.switchTab = function (tab) {
          vm.activeTab = tab;
          if (tab === 'records') {
            vm.loadCutoffs();
          } else if (tab === 'trends') {
            vm.loadTrendsAndRenderChart();
          }
        };

        // Initialize
        vm.loadDepartments();
        vm.runPrediction(); // Initial prediction with default rank
      }
    ]);

})();
