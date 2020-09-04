require('../../services/contact-list-scrolling.service.js');
require('../contact.service.js');
require('../../services/shared-contact-data.service.js');
require('../contact.constants.js');
require('../../app.constant.js');

(function(angular) {
  'use strict';

  angular.module('linagora.esn.contact')
    .directive('contactListItems', contactListItems);

  function contactListItems(
    $timeout,
    ContactListScrollingService,
    contactService,
    sharedContactDataService,
    CONTACT_EVENTS,
    LETTER_DISPLAY_DURATION
  ) {
    return {
      restrict: 'E',
      template: require('./contact-list-items.pug'),
      link: function(scope, element) {
        var timeoutPromise;

        contactService.setContactMainEmail(scope.contact);

        scope.headerDisplay = {
          letterExists: false
        };

        function toggleMobileLetter() {
          if (sharedContactDataService.categoryLetter) {
            scope.headerDisplay.mobileLetterVisibility = true;
            $timeout.cancel(timeoutPromise);
            timeoutPromise = $timeout(function() {
              scope.headerDisplay.mobileLetterVisibility = false;
            }, LETTER_DISPLAY_DURATION);
          } else {
            scope.headerDisplay.mobileLetterVisibility = false;
          }
        }
        var listScroller = ContactListScrollingService(element, toggleMobileLetter);

        function updateLetter() {
          //We need to wait the contact list updated
          $timeout(listScroller.onScroll, 500);
        }

        angular.forEach(CONTACT_EVENTS, function(event) {
          scope.$on(event, updateLetter);
        });

        scope.$on('$destroy', listScroller.unregister);
      }
    };
  }
})(angular);
