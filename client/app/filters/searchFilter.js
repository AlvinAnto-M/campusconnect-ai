/**
 * CAMPUSCONNECT AI - Universal Search Filter
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. Custom Filter traversing arbitrary object properties
 * 2. Case-insensitive substring matching
 * 3. Usage: ng-repeat="item in items | searchFilter:vm.searchQuery:['name', 'code', 'category']"
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .filter('searchFilter', function () {
      return function (items, query, fields) {
        if (!items || !angular.isArray(items)) {
          return items;
        }

        if (!query || !query.trim()) {
          return items;
        }

        var lowerQuery = query.toLowerCase().trim();

        return items.filter(function (item) {
          // If specific fields are provided, search only those
          if (fields && angular.isArray(fields) && fields.length > 0) {
            return fields.some(function (field) {
              var val = item[field];
              return val && val.toString().toLowerCase().indexOf(lowerQuery) !== -1;
            });
          }

          // Otherwise, inspect all string and number values of the item
          return Object.keys(item).some(function (key) {
            var val = item[key];
            if (typeof val === 'string' || typeof val === 'number') {
              return val.toString().toLowerCase().indexOf(lowerQuery) !== -1;
            }
            return false;
          });
        });
      };
    });

})();
