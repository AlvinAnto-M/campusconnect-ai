/**
 * CAMPUSCONNECT AI - Chatbot Widget Custom Directive
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. Custom Directive with restrict: 'E' (<chatbot-widget></chatbot-widget>)
 * 2. Dependency Injection: ['chatbotService', '$timeout', '$sce']
 * 3. $sce service for rendering safe HTML responses
 * 4. DOM auto-scrolling via $timeout
 * 5. Two-way data binding (ng-model="userQuery")
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .directive('chatbotWidget', ['chatbotService', '$timeout', '$sce', function (chatbotService, $timeout, $sce) {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/components/chatbot/chatbot.html',
        link: function (scope) {
          scope.isOpen = false;
          scope.isThinking = false;
          scope.userQuery = '';
          scope.messages = [];

          scope.initialChips = [
            'What is the cutoff for CSE?',
            'What are the hostel fees?',
            'What bus facilities are available?',
            'What companies visit the college?',
            'What documents are required for admission?'
          ];

          scope.toggleChat = function () {
            scope.isOpen = !scope.isOpen;
            if (scope.isOpen) {
              scrollToBottom();
            }
          };

          scope.formatMessage = function (rawText) {
            if (!rawText) return '';
            // Basic markdown bold/bullet replacement for visual appeal
            var formatted = rawText
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/•/g, '&bull;');
            return $sce.trustAsHtml(formatted);
          };

          function scrollToBottom() {
            $timeout(function () {
              var container = document.getElementById('chatbotMessagesList');
              if (container) {
                container.scrollTop = container.scrollHeight;
              }
            }, 100);
          }

          scope.handleSend = function () {
            if (!scope.userQuery || !scope.userQuery.trim() || scope.isThinking) return;

            var q = scope.userQuery.trim();
            scope.messages.push({
              sender: 'user',
              text: q,
              time: new Date()
            });

            scope.userQuery = '';
            scope.isThinking = true;
            scrollToBottom();

            chatbotService.askQuestion(q)
              .then(function (res) {
                scope.isThinking = false;
                if (res.data) {
                  scope.messages.push({
                    sender: 'bot',
                    text: res.data.answer,
                    suggestedFollowUps: res.data.suggestedFollowUps,
                    time: new Date(res.data.timestamp || Date.now())
                  });
                }
                scrollToBottom();
              })
              .catch(function (err) {
                scope.isThinking = false;
                scope.messages.push({
                  sender: 'bot',
                  text: 'I encountered an error retrieving data. Please ensure the backend server and MongoDB are online.',
                  time: new Date()
                });
                scrollToBottom();
              });
          };

          scope.sendQuick = function (questionText) {
            scope.userQuery = questionText;
            scope.handleSend();
          };

          scope.clearChat = function () {
            scope.messages = [];
            chatbotService.clearHistory().catch(function () {});
          };
        }
      };
    });

})();
