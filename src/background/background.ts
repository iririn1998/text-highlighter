/**
 * バックグラウンドスクリプト
 * コンテキストメニューの作成とメッセージハンドリングを担当
 */

import { getTranslations } from '../shared/i18n';

/**
 * コンテキストメニューを作成（または再作成）
 */
const createContextMenu = () => {
  const t = getTranslations();

  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: 'add-highlight',
      title: t.contextMenu.addHighlight,
      contexts: ['selection'],
    });
  });
};

// 拡張機能インストール時または更新時に実行
chrome.runtime.onInstalled.addListener(() => {
  createContextMenu();
});

// ブラウザ起動時にコンテキストメニューを再作成（言語変更に対応）
chrome.runtime.onStartup.addListener(() => {
  createContextMenu();
});

// コンテキストメニューがクリックされたときの処理
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'add-highlight' && tab?.id) {
    // 選択されたテキストを取得
    const selectedText = info.selectionText;

    if (selectedText) {
      // コンテンツスクリプトにメッセージを送信
      chrome.tabs
        .sendMessage(tab.id, {
          type: 'ADD_HIGHLIGHT',
          data: { text: selectedText },
        })
        .catch((error) => {
          console.error('Failed to send message:', error);
        });
    }
  }
});

// コンテンツスクリプトからのメッセージを処理
chrome.runtime.onMessage.addListener((_message, _sender, sendResponse) => {
  // 必要に応じてメッセージ処理を追加
  sendResponse({ success: true });
  return true;
});
