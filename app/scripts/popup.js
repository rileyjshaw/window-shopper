'use strict';

chrome.extension.getBackgroundPage().setCurrent(null, true);

window.setTimeout(function () {
  document.documentElement.className = 'fade';

  window.setTimeout(function () {
    window.close();
  }, 400);
}, 1600);
