/**
 * CAMPUSCONNECT AI - Frontend Chatbot Service
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. AngularJS Service architecture
 * 2. Dependency Injection: ['apiService', '$window']
 * 3. Client-side session management for conversation tracking
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .service('chatbotService', ['apiService', '$window', function (apiService, $window) {
      var SESSION_KEY = 'cc_chat_session';

      // Generate or retrieve persistent guest session ID
      function getSessionId() {
        var sessionId = $window.localStorage.getItem(SESSION_KEY);
        if (!sessionId) {
          sessionId = 'cc-session-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now();
          $window.localStorage.setItem(SESSION_KEY, sessionId);
        }
        return sessionId;
      }

      this.askQuestion = function (question) {
        return apiService.post('/chatbot/ask', {
          question: question,
          sessionId: getSessionId()
        });
      };

      this.getHistory = function () {
        return apiService.get('/chatbot/history', {
          sessionId: getSessionId()
        });
      };

      this.clearHistory = function () {
        return apiService.delete('/chatbot/history', {
          sessionId: getSessionId()
        });
      };
    }]);

})();
