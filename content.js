let clickInterval = null;
let mouseX = 0, mouseY = 0;
let selectedElement = null;
let isSelecting = false;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}, { passive: true });

let savedShortcut = { code: "KeyS", key: "S", alt: true, shift: true, ctrl: false, meta: false };

chrome.storage.local.get(['shortcut'], (data) => {
  if (data.shortcut) savedShortcut = data.shortcut;
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.shortcut) savedShortcut = changes.shortcut.newValue;
});

document.addEventListener('keydown', (e) => {
  if (!savedShortcut) return;
  const matchCode = e.code === savedShortcut.code;
  const matchAlt = e.altKey === savedShortcut.alt;
  const matchShift = e.shiftKey === savedShortcut.shift;
  const matchCtrl = e.ctrlKey === savedShortcut.ctrl;
  const matchMeta = e.metaKey === savedShortcut.meta;
  if (matchCode && matchAlt && matchShift && matchCtrl && matchMeta) {
    e.preventDefault();
    chrome.runtime.sendMessage({ action: "toggle_hotkey_pressed" });
  }
}, true);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggle") {
    if (request.state) {
      startClicking(request.interval, request.mode);
    } else {
      stopClicking();
    }
    sendResponse({ status: "success" });

  } else if (request.action === "start_selection") {
    enableSelectionMode();
    sendResponse({ status: "started" });

  } else if (request.action === "check_element_status") {
    sendResponse({ hasElement: !!selectedElement });
  }
  return true;
});

function triggerHumanClick(elem, x, y) {
  const jitterX = x + (Math.random() * 4 - 2);
  const jitterY = y + (Math.random() * 4 - 2);

  const eventOpts = {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: jitterX,
    clientY: jitterY,
    detail: 1 
  };

  elem.dispatchEvent(new MouseEvent('mousedown', eventOpts));
  elem.dispatchEvent(new MouseEvent('mouseup', eventOpts));
  elem.dispatchEvent(new MouseEvent('click', eventOpts));
}

function startClicking(interval, mode) {
  stopClicking(); 
  console.log(`Auto Clicker Started: ${mode} at ${interval}ms`);

  let fixedX = 0, fixedY = 0;
  if (mode === "fixed" && selectedElement) {
    const rect = selectedElement.getBoundingClientRect();
    fixedX = rect.left + (rect.width / 2);
    fixedY = rect.top + (rect.height / 2);
  }

  clickInterval = setInterval(() => {
    if (mode === "follow") {
      const elem = document.elementFromPoint(mouseX, mouseY);
      if (elem) {
        triggerHumanClick(elem, mouseX, mouseY);
      }
    } else if (mode === "fixed") {
      if (selectedElement && document.body.contains(selectedElement)) {
        triggerHumanClick(selectedElement, fixedX, fixedY);
      } else {
        stopClicking();
      }
    }
  }, interval);
}

function stopClicking() {
  if (clickInterval) {
    clearInterval(clickInterval);
    clickInterval = null;
    console.log("Stopped");
    chrome.storage.local.set({ isRunning: false });
  }
}

function enableSelectionMode() {
  isSelecting = true;
  document.body.style.cursor = "crosshair";
  
  const highlighter = (e) => { if (isSelecting) e.target.style.outline = "2px solid #2196F3"; };
  const dehighlighter = (e) => { if (isSelecting) e.target.style.outline = ""; };

  const selector = (e) => {
    if (!isSelecting) return;
    e.preventDefault(); e.stopPropagation();
    
    selectedElement = e.target;
    selectedElement.style.outline = ""; 

    const originalTrans = selectedElement.style.transition;
    selectedElement.style.transition = "outline 0.2s";
    selectedElement.style.outline = "4px solid #4CAF50";
    setTimeout(() => {
      selectedElement.style.outline = "";
      selectedElement.style.transition = originalTrans;
    }, 500);
    
    isSelecting = false;
    document.body.style.cursor = "default";
    document.removeEventListener('mouseover', highlighter);
    document.removeEventListener('mouseout', dehighlighter);
    document.removeEventListener('click', selector, true);
  };

  document.addEventListener('mouseover', highlighter);
  document.addEventListener('mouseout', dehighlighter);
  document.addEventListener('click', selector, { capture: true, once: true });
}