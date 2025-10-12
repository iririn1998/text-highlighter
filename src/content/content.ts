/**
 * コンテンツスクリプト
 * ページ上でのハイライト処理を担当
 */
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'ADD_HIGHLIGHT') {
    console.log('content.ts');
  }
});
