/**
 * CAMPUSCONNECT AI - Dedicated Chatbot Controller
 * 
 * ANGULARJS CONCEPT DEMONSTRATIONS:
 * 1. ControllerAs syntax (vm = this)
 * 2. Dependency Injection: ['chatbotService', '$timeout', '$sce', '$rootScope']
 * 3. $sce.trustAsHtml for safe HTML rendering
 * 4. DOM auto-scroll animation via $timeout
 * 5. Data export and history management
 */

(function () {
  'use strict';

  angular.module('campusConnectApp')
    .controller('ChatbotController', [
      'chatbotService',
      '$timeout',
      '$sce',
      '$rootScope',
      function (chatbotService, $timeout, $sce, $rootScope) {
        var vm = this;

        vm.isThinking = false;
        vm.userQuery = '';
        vm.conversation = [];

        vm.samplePrompts = [
          'What is the cutoff for CSE?',
          'What are the hostel fees and room options?',
          'What bus facilities and routes are available?',
          'What companies visit the college and what is the highest package?',
          'What is the eligibility for B.Tech admission?',
          'What documents are required for counselling?'
        ];

        // Format message with basic markdown
        vm.formatText = function (raw) {
          if (!raw) return '';
          var parsed = raw
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/•/g, '&bull;')
            .replace(/\n/g, '<br/>');
          return $sce.trustAsHtml(parsed);
        };

        function scrollContainer() {
          $timeout(function () {
            var el = document.getElementById('dedicatedChatScroll');
            if (el) el.scrollTop = el.scrollHeight;
          }, 80);
        }

        vm.sendMessage = function () {
          if (!vm.userQuery || !vm.userQuery.trim() || vm.isThinking) return;

          var text = vm.userQuery.trim();
          vm.conversation.push({
            sender: 'user',
            text: text,
            timestamp: new Date()
          });

          vm.userQuery = '';
          vm.isThinking = true;
          scrollContainer();

          chatbotService.askQuestion(text)
            .then(function (res) {
              vm.isThinking = false;
              if (res.data) {
                vm.conversation.push({
                  sender: 'bot',
                  text: res.data.answer,
                  intent: res.data.intent,
                  suggestedFollowUps: res.data.suggestedFollowUps,
                  timestamp: new Date(res.data.timestamp || Date.now())
                });
              }
              scrollContainer();
            })
            .catch(function (err) {
              vm.isThinking = false;
              vm.conversation.push({
                sender: 'bot',
                text: 'Error contacting AI backend service. Please check database connectivity.',
                timestamp: new Date()
              });
              scrollContainer();
            });
        };

        vm.selectPrompt = function (promptText) {
          vm.userQuery = promptText;
          vm.sendMessage();
        };

        vm.clearChat = function () {
          vm.conversation = [];
          chatbotService.clearHistory().catch(function () {});
          $rootScope.showToast('Conversation cleared.', 'info');
        };

        // Initialize with default welcome bot message
        vm.init = function () {
          vm.conversation.push({
            sender: 'bot',
            text: 'Hello! I am **CampusConnect AI**, your dedicated smart college guidance assistant. Ask me questions about engineering departments, cutoffs, tuition fees, hostels, bus routes, or placements!',
            suggestedFollowUps: vm.samplePrompts.slice(0, 4),
            timestamp: new Date()
          });
        };

        vm.init();
      }
    ]);

})();
