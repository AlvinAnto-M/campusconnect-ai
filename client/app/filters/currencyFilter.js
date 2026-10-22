/**
 * CAMPUSCONNECT AI - Currency Formatter Custom Filter
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. Custom Filter creation via .filter()
 * 2. Pure function transformation of input data
 * 3. Usage in templates: {{ fee | currencyFormat }} or {{ fee | currencyFormat:'USD' }}
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .filter('currencyFormat', function () {
      return function (input, currencySymbol) {
        if (input === null || input === undefined || isNaN(input)) {
          return '₹0';
        }

        var symbol = currencySymbol || '₹';
        var num = Number(input);

        // Format to Indian Rupee standard comma grouping
        var formatted = num.toLocaleString('en-IN');
        return symbol + ' ' + formatted;
      };
    });

})();
