/**
 * バックグラウンドスクリプト
 * コンテキストメニューの作成とメッセージハンドリングを担当
 */

import { getTranslations } from '../shared/i18n';

// 拡張機能インストール時または更新時に実行
chrome.runtime.onInstalled.addListener(() => {
  const t = getTranslations();

  // コンテキストメニューを作成
  chrome.contextMenus.create({
    id: 'add-highlight',
    title: t.contextMenu.addHighlight,
    contexts: ['selection'],
  });
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
