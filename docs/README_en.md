# Text Highlighter - Chrome Extension

<p align="center">
  <img src="../icons/icon128.png" alt="Text Highlighter" width="128" height="128">
</p>

<p align="center">
  A Google Chrome extension that lets you highlight selected text on any web page.
</p>

> 🇯🇵 [日本語版はこちら](README_ja.md)

## ✨ Features

- 🎨 **4 Preset Colors** — Choose from Yellow, Green, Red, and Blue with one click
- 🖱️ **Context Menu Integration** — Select text and right-click to highlight
- 🗑️ **Double-Click to Remove** — Easily remove highlights with a double-click
- 💾 **Auto-Save Settings** — Your selected color is saved to Chrome Storage and synced across devices
- 🌐 **Bilingual Support** — Auto-detects Japanese and English from browser locale
- 🔒 **Privacy First** — No data is ever sent to external servers

## 📦 Tech Stack

| Technology | Purpose |
|------------|---------|
| [Vite](https://vitejs.dev/) | Fast build tool |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe development |
| [@crxjs/vite-plugin](https://crxjs.dev/vite-plugin) | Vite plugin for Chrome extensions |
| [Biome](https://biomejs.dev/) | Linter & formatter |

## 🚀 Installation

### Build from Source

```bash
git clone https://github.com/iririn1998/text-highlighter.git
cd text-highlighter
npm install
npm run build
```

### Load into Chrome

1. Open `chrome://extensions/` in Google Chrome
2. Enable **Developer mode** in the top-right corner
3. Click **Load unpacked**
4. Select the `dist` folder from the project
5. The extension icon will appear in your toolbar — installation complete!

## 📖 Usage

### Highlight Text

1. Select text on any web page by dragging your mouse
2. Right-click → Select **"Add Highlight"**

### Remove a Highlight

- **Double-click** on the highlighted text

### Change Highlight Color

1. Click the extension icon in the toolbar
2. Choose your preferred color from the popup (Yellow, Green, Red, or Blue)
3. Your selection is automatically saved

## 🛠️ Development

### Initial Setup

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

After the dev server starts, open `chrome://extensions/` in Chrome and load the `dist` folder as an unpacked extension. Code changes will automatically reload the extension.

### Build for Production

```bash
npm run build
```

The built files are output to the `dist` folder.

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run type-check` | TypeScript type checking |
| `npm run lint` | Lint with Biome |
| `npm run format` | Format with Biome |
| `npm run check` | Lint + format with Biome |

## 📁 Project Structure

```
text-highlighter/
├── src/
│   ├── background/    # Service Worker (context menu management)
│   ├── content/       # Content script (highlight logic)
│   ├── popup/         # Popup UI (color picker)
│   ├── shared/        # Shared constants, types & i18n
│   ├── popup.html     # Popup HTML
│   └── style.css      # Highlight styles
├── icons/             # Extension icons (16/32/48/128px)
├── manifest.json      # Chrome extension manifest (v3)
├── vite.config.ts     # Vite configuration
├── tsconfig.json      # TypeScript configuration
└── biome.json         # Biome configuration
```

## 🔒 Privacy Policy

This extension is designed with user privacy as the top priority.

- No personal information is collected
- Highlighted text content and browsing history are never recorded
- The only data stored is your highlight color preference (via Chrome Storage Sync)
- No data is transmitted to external servers

For details, see [PRIVACY_POLICY.md](../PRIVACY_POLICY.md).
