/**
 * バックグラウンドスクリプト
 * コンテキストメニューの作成とメッセージハンドリングを担当
 */

// 拡張機能インストール時または更新時に実行
chrome.runtime.onInstalled.addListener(() => {
  // コンテキストメニューを作成
  chrome.contextMenus.create({
    id: 'add-highlight',
    title: 'ハイライトを追加',
    contexts: ['selection'],
  });

  console.log('Text Highlighter: インストール完了');
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
          console.error('メッセージ送信エラー:', error);
        });
    }
  }
});

// コンテンツスクリプトからのメッセージを処理
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log('バックグラウンドでメッセージ受信:', message);

  // 必要に応じてメッセージ処理を追加
  sendResponse({ success: true });
  return true;
});
