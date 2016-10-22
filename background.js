


chrome.browserAction.setIcon({
  path: "icon-green.png"
});

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({'url': chrome.extension.getURL('main.html'), 'selected': true});
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // read `newIconPath` from request and read `tab.id` from sender
    console.log('message received');
    chrome.browserAction.setIcon({
        path: request.newIconPath,
        tabId: sender.tab.id
    });
});
