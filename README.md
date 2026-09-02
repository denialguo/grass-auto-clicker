<div align="center">
  <img src="icon128.png" width="96" alt="Grass Auto Clicker icon">
  <h1>Grass Auto Clicker</h1>
  <p>A friendlier, simpler auto-clicker for people who do not need every advanced control.</p>

  <a href="https://chromewebstore.google.com/detail/grass-auto-clicker/gngheimbbpkgaoeiobjemnajlmjngika"><img src="https://img.shields.io/badge/Chrome_Web_Store-Install-4285F4?logo=googlechrome&logoColor=white" alt="Install from Chrome Web Store"></a>
  <img src="https://img.shields.io/badge/Manifest-V3-34A853" alt="Manifest V3">
</div>

## What it is

Grass Auto Clicker is the lightweight, less-configurable sibling of [Simple Auto Clicker](https://github.com/denialguo/simple-auto-clicker). It keeps the core targeting modes and hotkey workflow while using a simpler interface and fewer advanced options.

The name is mostly a joke. The extension still clicks things for you.

## Features

- **Follow-mouse mode** — repeatedly clicks whatever is under the cursor.
- **Element mode** — visually select a page element and keep clicking it.
- **Coordinate mode** — pick a fixed point on the page and click whatever occupies that position.
- **Configurable speed** from the popup.
- **Custom hotkey** for quickly starting and stopping the click loop.
- **Persistent settings** through `chrome.storage.local`.

## How it works

The popup stores the current mode, interval, and shortcut. A content script tracks the selected target and dispatches synthetic mouse events, while a Manifest V3 background service worker coordinates hotkey toggles and extension state.

This project intentionally favors a smaller feature surface over the multi-point and extra controls available in Simple Auto Clicker.

## Tech

`JavaScript` · `Manifest V3` · `Content Scripts` · `Background Service Worker` · `Chrome Storage` · `Chrome Messaging` · `DOM Events`

## Install locally

1. Clone this repository.
2. Open `chrome://extensions`.
3. Enable **Developer mode**.
4. Choose **Load unpacked** and select the repository folder.

Or install the published version from the [Chrome Web Store](https://chromewebstore.google.com/detail/grass-auto-clicker/gngheimbbpkgaoeiobjemnajlmjngika).

---

Part of [**Daniel's QOL**](https://github.com/denialguo/Daniel-s-QOL), a collection of 9 published Chrome extensions.