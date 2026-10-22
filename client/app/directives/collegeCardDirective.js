/**
 * CAMPUSCONNECT AI - College Card Custom Directive
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. Custom Directive creation via .directive()
 * 2. Directive Definition Object (DDO)
 * 3. Restrict: 'E' (Element Directive: <college-card></college-card>)
 * 4. Isolate Scope: scope: { college: '=' }
 * 5. Template binding and DOM manipulation
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .directive('collegeCard', function () {
      return {
        restrict: 'E',
        scope: {
          college: '=',
          compact: '@'
        },
        template: 
          '<div class="card card-custom p-4 mb-4 border-0 shadow-sm" style="background: linear-gradient(135deg, #091326 0%, #1e3a8a 100%); color: #ffffff;">' +
            '<div class="row align-items-center">' +
              '<div class="col-lg-8">' +
                '<div class="d-flex align-items-center gap-2 mb-2">' +
                  '<span class="badge bg-primary px-3 py-2 text-uppercase fw-bold">{{college.code || "CCIST"}}</span>' +
                  '<span class="badge bg-success-subtle text-success px-3 py-2"><i class="fa-solid fa-award me-1"></i> {{college.accreditation || "NAAC A++ Grade"}}</span>' +
                '</div>' +
                '<h2 class="text-white fw-bold mb-2">{{college.name || "CampusConnect Institute of Technology"}}</h2>' +
                '<p class="text-white-50 mb-3 fs-6">{{college.tagline || "Empowering Minds, Innovating Futures"}}</p>' +
                '<p class="text-light opacity-75 small mb-3">{{college.description}}</p>' +
                '<div class="d-flex flex-wrap gap-3 text-light small">' +
                  '<span><i class="fa-solid fa-location-dot text-info me-1"></i> {{college.location}}</span>' +
                  '<span><i class="fa-solid fa-calendar-check text-warning me-1"></i> Estd. {{college.establishedYear}}</span>' +
                  '<span><i class="fa-solid fa-chart-column text-success me-1"></i> {{college.ranking}}</span>' +
                '</div>' +
              '</div>' +
              '<div class="col-lg-4 text-lg-end mt-4 mt-lg-0" ng-if="!compact">' +
                '<div class="p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-10 d-inline-block text-start w-100">' +
                  '<h6 class="text-white fw-bold mb-2"><i class="fa-solid fa-headset text-info me-2"></i>Admissions Desk</h6>' +
                  '<div class="text-white-50 small mb-1"><i class="fa-solid fa-phone me-1"></i> {{college.contact.phone}}</div>' +
                  '<div class="text-white-50 small mb-3"><i class="fa-solid fa-envelope me-1"></i> {{college.contact.email}}</div>' +
                  '<a href="#/admission" class="btn btn-info btn-sm text-dark fw-bold w-100">' +
                    '<i class="fa-solid fa-paper-plane me-1"></i> Explore 2026 Admissions' +
                  '</a>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>'
      };
    });

})();
