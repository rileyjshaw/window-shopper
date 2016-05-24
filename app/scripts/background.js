(function (exports) {
  'use strict';

  var currentTab = null;

  chrome.tabs.query({ active: true }, function (tab) {
    currentTab = tab.id;

    var setCurrent = exports.setCurrent = function setCurrent (tabId, logging) {
      if (tabId) {
        currentTab = tabId;
      }

      if (currentTab) {
        chrome.tabs.sendMessage(currentTab, {
          type: 'userClick',
          logging: logging
        });
      }
    };

    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
      if (changeInfo.status === 'loading') {
        setCurrent(tabId);
      }
    });

    chrome.tabs.onActivated.addListener(function (activeInfo) {
      setCurrent(activeInfo.tabId);
    });

    chrome.runtime.onMessage.addListener(function (added) {
      var numAdded = added.length || '';

      chrome.browserAction.setBadgeText({
        text: numAdded.toString(),
        tabId: currentTab
      });

      chrome.browserAction.setBadgeBackgroundColor({
        color: numAdded < 8 ? '#0f0' : numAdded < 13 ? '#880' : '#f00',
        tabId: currentTab
      });
    });
  });
})(this);
