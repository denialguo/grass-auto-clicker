function handleToggle() {
  chrome.storage.local.get(['isRunning', 'interval', 'mode', 'targetTabId'], (data) => {
    const newState = !data.isRunning;

    // stopping targets the tab that's actually running; starting targets whatever's active
    const getTabId = (data.isRunning && data.targetTabId)
      ? (cb) => cb(data.targetTabId)
      : (cb) => chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => cb(tabs[0]?.id));

    getTabId((tabId) => {
      if (!tabId) return;

      chrome.tabs.sendMessage(tabId, {
        action: "toggle",
        state: newState,
        interval: data.interval || 1000,
        mode: data.mode || "follow"
      }, (response) => {
        // no content script here (restricted page, stale tab) - don't lie about running state
        if (chrome.runtime.lastError || !response) {
          chrome.storage.local.set({ isRunning: false, targetTabId: null });
          return;
        }
        chrome.storage.local.set({ isRunning: newState, targetTabId: newState ? tabId : null });
      });
    });
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggle_hotkey_pressed") {
    handleToggle();
  }
});

chrome.tabs.onRemoved.addListener((tabId) => checkAndReset(tabId));
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading') checkAndReset(tabId);
});

function checkAndReset(affectedTabId) {
  chrome.storage.local.get(['targetTabId', 'isRunning'], (data) => {
    if (data.isRunning && data.targetTabId === affectedTabId) {
      chrome.storage.local.set({ isRunning: false, targetTabId: null });
    }
  });
}