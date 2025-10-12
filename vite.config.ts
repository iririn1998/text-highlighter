/// <reference types="vite/client" />
import { crx, defineManifest } from '@crxjs/vite-plugin';
import { defineConfig } from 'vite';

const manifest = defineManifest({
  manifest_version: 3,
  name: 'Text Highlighter',
  version: '1.0.0',
  description: 'ウェブページ上のテキストをハイライトする拡張機能',
  permissions: ['activeTab', 'storage', 'contextMenus', 'idle'],
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['src/content/contentMain.ts'],
    },
  ],
  action: {
    default_title: 'Text Highlighter',
    default_popup: 'src/popup.html',
    default_icon: {
      '16': 'icons/icon16.png',
      '32': 'icons/icon32.png',
      '48': 'icons/icon48.png',
      '128': 'icons/icon128.png',
    },
  },
  icons: {
    '16': 'icons/icon16.png',
    '32': 'icons/icon32.png',
    '48': 'icons/icon48.png',
    '128': 'icons/icon128.png',
  },
  background: {
    service_worker: 'src/background/backgroundMain.ts',
    type: 'module',
  },
});

export default defineConfig({
  plugins: [crx({ manifest })],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
});
