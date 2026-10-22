/**
 * CAMPUSCONNECT AI - Cutoff Formatter Custom Filter
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. Custom Filter creation via .filter()
 * 2. Formats numeric cutoff scores and rank indicators
 * 3. Usage: {{ cutoff.closingCutoff | cutoffFormat }} or {{ cutoff.closingRank | cutoffRankFormat }}
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .filter('cutoffFormat', function () {
      return function (score, maxScore) {
        if (score === null || score === undefined || isNaN(score)) {
          return 'N/A';
        }
        var max = maxScore || 200;
        return Number(score).toFixed(2) + ' / ' + max;
      };
    })
    .filter('cutoffRankFormat', function () {
      return function (rank) {
        if (!rank || isNaN(rank)) return 'N/A';
        return '#' + Number(rank).toLocaleString('en-IN');
      };
    });

})();
