var utils = (function() {

    var getCurrentTabUrl = function (callback) {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            var tab = tabs[0];
            var url = tab.url;
            console.assert(typeof url == 'string', 'tab.url should be a string');
            callback(url);
        });
    };

    return {
        getCurrentTabUrl: getCurrentTabUrl
    };

})();
