/**
 * CAMPUSCONNECT AI - Placement Custom Filter
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. Custom Filter for Array collections and data formatting
 * 2. Multi-tier filtering (Super Dream vs Dream vs Regular)
 * 3. Usage: ng-repeat="company in vm.companies | placementFilter:vm.selectedIndustry:vm.selectedTier:vm.minLPA"
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .filter('placementFilter', function () {
      return function (companies, industry, tier, minLPA) {
        if (!companies || !angular.isArray(companies)) {
          return companies;
        }

        return companies.filter(function (comp) {
          // Industry match
          if (industry && industry !== 'all') {
            if (comp.industry !== industry) return false;
          }

          // Tier match
          if (tier && tier !== 'all') {
            if (comp.tier && comp.tier.indexOf(tier) === -1) return false;
          }

          // Min LPA match
          if (minLPA && Number(minLPA) > 0) {
            if (!comp.maxPackageLPA || comp.maxPackageLPA < Number(minLPA)) return false;
          }

          return true;
        });
      };
    })
    .filter('tierBadgeClass', function () {
      return function (tier) {
        if (!tier) return 'bg-secondary';
        if (tier.indexOf('Super Dream') !== -1) return 'bg-primary text-white';
        if (tier.indexOf('Dream') !== -1) return 'bg-info text-dark';
        return 'bg-secondary-subtle text-secondary';
      };
    });

})();
