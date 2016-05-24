(function () {
  'use strict';

  function auditGlobalsInjected () {
    function getGlobals () {
      return Object.getOwnPropertyNames(window);
    }

    function sendAddedGlobals (logging) {
      var addedGlobals = getGlobals().filter(function (key) {
        return !defaultGlobals[key];
      });

      var auditGlobalsResponse = document.createEvent('CustomEvent');
      auditGlobalsResponse.initCustomEvent('auditGlobalsResponse', true, true, {
        added: addedGlobals,
        logging: logging
      });

      document.dispatchEvent(auditGlobalsResponse);
    }

    var defaultGlobals = getGlobals().reduce(function (globals, key) {
      globals[key] = true;
    }, {});

    window.addEventListener('load', function () {
      sendAddedGlobals(false);

      window.addEventListener('auditGlobalsRequest', function () {
        sendAddedGlobals(true);
      });
    });
  }

  var script = document.createElement('script');
  var parent = document.head || document.documentElement;

  script.textContent = '(' + auditGlobalsInjected + ')();';
  parent.insertBefore(script, parent.firstChild);
  script.parentNode.removeChild(script);

  document.addEventListener('auditGlobalsResponse', function (e) {
    var added = e.detail.added;
    chrome.runtime.sendMessage(added);

    if (e.detail.logging) {
      console.log(added);
    }
  });


  chrome.runtime.onMessage.addListener(function () {
    var auditGlobalsRequest = document.createEvent('CustomEvent');
    auditGlobalsRequest.initCustomEvent('auditGlobalsRequest', true, true, {});
    document.dispatchEvent(auditGlobalsRequest);
  });
})();
