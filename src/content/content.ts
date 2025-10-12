/**
 * コンテンツスクリプト
 * ページ上でのハイライト処理を担当
 */

import type { HighlightData, StorageData } from '../shared/types';
import { DEFAULT_COLOR } from '../shared/types';
import '../style.css';

const STORAGE_KEY = 'text-highlighter-data';
const HIGHLIGHT_CLASS = 'text-highlight';
const HIGHLIGHT_ATTR = 'data-highlight-id';

/**
 * XPathを生成する関数
 */
function getXPath(node: Node): string {
  if (node.nodeType === Node.DOCUMENT_NODE) {
    return '/';
  }

  const parent = node.parentNode;
  if (!parent) {
    return '';
  }

  const parentPath = getXPath(parent);
  const siblings = Array.from(parent.childNodes);
  const index =
    siblings
      .filter((n) => n.nodeName === node.nodeName)
      .indexOf(node as ChildNode) + 1;

  return `${parentPath}/${node.nodeName.toLowerCase()}[${index}]`;
}

/**
 * XPathから要素を取得する関数
 */
function getElementByXPath(xpath: string): Node | null {
  const result = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  );
  return result.singleNodeValue;
}

/**
 * 現在選択されている色を取得
 */
async function getSelectedColor(): Promise<string> {
  try {
    const result = await chrome.storage.sync.get(STORAGE_KEY);
    const data = result[STORAGE_KEY] as StorageData | undefined;
    return data?.selectedColor || DEFAULT_COLOR;
  } catch (error) {
    console.error('色の取得エラー:', error);
    return DEFAULT_COLOR;
  }
}

/**
 * ハイライトを保存
 */
async function saveHighlight(highlight: HighlightData): Promise<void> {
  try {
    const result = await chrome.storage.sync.get(STORAGE_KEY);
    const data = (result[STORAGE_KEY] as StorageData) || {
      highlights: [],
      selectedColor: DEFAULT_COLOR,
    };

    data.highlights.push(highlight);

    await chrome.storage.sync.set({ [STORAGE_KEY]: data });
    console.log('ハイライトを保存しました:', highlight);
  } catch (error) {
    console.error('ハイライト保存エラー:', error);
  }
}

/**
 * ハイライトを削除
 */
async function removeHighlight(id: string): Promise<void> {
  try {
    const result = await chrome.storage.sync.get(STORAGE_KEY);
    const data = result[STORAGE_KEY] as StorageData | undefined;

    if (data) {
      data.highlights = data.highlights.filter((h) => h.id !== id);
      await chrome.storage.sync.set({ [STORAGE_KEY]: data });
      console.log('ハイライトを削除しました:', id);
    }
  } catch (error) {
    console.error('ハイライト削除エラー:', error);
  }
}

/**
 * ハイライトを復元
 */
async function restoreHighlights(): Promise<void> {
  try {
    const result = await chrome.storage.sync.get(STORAGE_KEY);
    const data = result[STORAGE_KEY] as StorageData | undefined;

    if (!data || !data.highlights) {
      return;
    }

    const currentUrl = window.location.href;
    const pageHighlights = data.highlights.filter((h) => h.url === currentUrl);

    for (const highlight of pageHighlights) {
      applyHighlightFromData(highlight);
    }

    console.log(`${pageHighlights.length}個のハイライトを復元しました`);
  } catch (error) {
    console.error('ハイライト復元エラー:', error);
  }
}

/**
 * 保存されたデータからハイライトを適用
 */
function applyHighlightFromData(highlight: HighlightData): void {
  try {
    const node = getElementByXPath(highlight.xpath);
    if (!node || node.nodeType !== Node.TEXT_NODE) {
      return;
    }

    const textNode = node as Text;
    const text = textNode.textContent || '';

    if (highlight.offset + highlight.length > text.length) {
      return;
    }

    // テキストノードを分割
    const range = document.createRange();
    range.setStart(textNode, highlight.offset);
    range.setEnd(textNode, highlight.offset + highlight.length);

    // span要素でラップ
    const span = document.createElement('span');
    span.className = HIGHLIGHT_CLASS;
    span.setAttribute(HIGHLIGHT_ATTR, highlight.id);
    span.style.backgroundColor = highlight.color;

    range.surroundContents(span);

    // ダブルクリックイベントを設定
    span.addEventListener('dblclick', handleHighlightDoubleClick);
  } catch (error) {
    console.error('ハイライト適用エラー:', error);
  }
}

/**
 * 選択範囲にハイライトを適用
 */
async function applyHighlight(): Promise<void> {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return;
  }

  const range = selection.getRangeAt(0);
  const selectedText = range.toString().trim();

  if (!selectedText) {
    return;
  }

  try {
    // 色を取得
    const color = await getSelectedColor();

    // ハイライトデータを作成
    const highlightId = `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const startContainer = range.startContainer;

    const highlight: HighlightData = {
      id: highlightId,
      text: selectedText,
      color: color,
      xpath: getXPath(startContainer),
      offset: range.startOffset,
      length: selectedText.length,
      url: window.location.href,
      createdAt: Date.now(),
    };

    // span要素を作成してラップ
    const span = document.createElement('span');
    span.className = HIGHLIGHT_CLASS;
    span.setAttribute(HIGHLIGHT_ATTR, highlightId);
    span.style.backgroundColor = color;

    range.surroundContents(span);

    // ダブルクリックイベントを設定
    span.addEventListener('dblclick', handleHighlightDoubleClick);

    // 選択を解除
    selection.removeAllRanges();

    // ストレージに保存
    await saveHighlight(highlight);

    console.log('ハイライトを追加しました:', highlight);
  } catch (error) {
    console.error('ハイライト追加エラー:', error);
  }
}

/**
 * ハイライトのダブルクリック処理
 */
async function handleHighlightDoubleClick(event: Event): Promise<void> {
  const target = event.target as HTMLElement;
  const highlightId = target.getAttribute(HIGHLIGHT_ATTR);

  if (!highlightId) {
    return;
  }

  // ストレージから削除
  await removeHighlight(highlightId);

  // DOMから削除（span要素を解除してテキストに戻す）
  const parent = target.parentNode;
  if (parent) {
    const textNode = document.createTextNode(target.textContent || '');
    parent.replaceChild(textNode, target);

    // 隣接するテキストノードを結合
    parent.normalize();
  }

  console.log('ハイライトを削除しました:', highlightId);
}

/**
 * メッセージリスナー
 */
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'ADD_HIGHLIGHT') {
    applyHighlight()
      .then(() => {
        sendResponse({ success: true });
      })
      .catch((error) => {
        console.error('ハイライト追加エラー:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // 非同期レスポンスを示す
  }
});

/**
 * 初期化
 */
function initialize(): void {
  console.log('Text Highlighter: コンテンツスクリプト読み込み完了');

  // ページ読み込み後にハイライトを復元
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', restoreHighlights);
  } else {
    restoreHighlights();
  }
}

// 初期化実行
initialize();
