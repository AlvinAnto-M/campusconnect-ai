/**
 * CAMPUSCONNECT AI - Hostel Controller
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. ControllerAs syntax (vm = this)
 * 2. Dependency Injection: ['hostelService', '$rootScope']
 * 3. Tab switching state management (Boys Hostel vs Girls Hostel)
 * 4. Filtering and formatting residential facilities
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .controller('HostelController', ['hostelService', '$rootScope', function (hostelService, $rootScope) {
      var vm = this;

      vm.isLoading = true;
      vm.hostels = [];
      vm.selectedHostel = null;

      vm.loadHostels = function () {
        vm.isLoading = true;
        hostelService.getHostels()
          .then(function (res) {
            vm.isLoading = false;
            vm.hostels = res.data || [];
            if (vm.hostels.length > 0) {
              vm.selectedHostel = vm.hostels[0];
            }
          })
          .catch(function (err) {
            vm.isLoading = false;
            $rootScope.showToast('Failed to load hostel details.', 'error');
          });
      };

      vm.selectHostel = function (hostel) {
        vm.selectedHostel = hostel;
      };

      vm.requestBookingInfo = function (roomType) {
        $rootScope.showToast('Hostel room application portal is open for 2026. Contact the Chief Warden desk at ' + (vm.selectedHostel ? vm.selectedHostel.contact.phone : 'campus office'), 'info');
      };

      vm.loadHostels();
    }]);

})();
