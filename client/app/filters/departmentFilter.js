/**
 * CAMPUSCONNECT AI - Department Custom Filter
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. Custom Filter for Array collections in ng-repeat
 * 2. Multi-criteria filtering: degree, minimum intake, and featured status
 * 3. Usage: ng-repeat="dept in vm.departments | departmentFilter:vm.selectedDegree:vm.minIntake"
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .filter('departmentFilter', function () {
      return function (departments, selectedDegree, minIntake) {
        if (!departments || !angular.isArray(departments)) {
          return departments;
        }

        return departments.filter(function (dept) {
          // Filter by degree if specified
          if (selectedDegree && selectedDegree !== 'all') {
            if (!dept.degree || dept.degree.toLowerCase().indexOf(selectedDegree.toLowerCase()) === -1) {
              return false;
            }
          }

          // Filter by minimum intake capacity
          if (minIntake && Number(minIntake) > 0) {
            if (!dept.intake || Number(dept.intake) < Number(minIntake)) {
              return false;
            }
          }

          return true;
        });
      };
    });

})();
