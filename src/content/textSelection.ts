/**
 * テキスト選択処理モジュール
 */

import { CONSTANTS } from '../shared/constants';
import { isExtensionValid, sendMessageSafely } from './extensionContext';

// グローバル変数
let selectedText = '';
let selectedRange: Range | null = null;

// コンテキストメニュー用の選択情報保存
interface ContextMenuSelection {
  text: string;
  range: Range | null;
  timestamp: number | null;
}

let contextMenuSelection: ContextMenuSelection = {
  text: '',
  range: null,
  timestamp: null,
};

/**
 * 現在選択されているテキストを取得する
 * @returns {string} 選択されたテキスト
 */
export const getSelectedText = (): string => {
  return selectedText;
};

/**
 * 現在選択されている範囲を取得する
 * @returns {Range|null} 選択された範囲
 */
export const getSelectedRange = (): Range | null => {
  return selectedRange;
};

/**
 * コンテキストメニュー用の選択情報を取得する
 * @returns {Object} コンテキストメニュー選択情報
 */
export const getContextMenuSelection = (): ContextMenuSelection => {
  return contextMenuSelection;
};

/**
 * 選択状態をクリアする
 */
export const clearSelection = (): void => {
  selectedText = '';
  selectedRange = null;
};

/**
 * コンテキストメニュー選択情報をクリアする
 */
export const clearContextMenuSelection = (): void => {
  contextMenuSelection = {
    text: '',
    range: null,
    timestamp: null,
  };
};

interface TextNodeInfo {
  node: Text;
  startOffset: number;
  endOffset: number;
}

/**
 * テキスト選択のハンドリングを行う
 * 選択されたテキストと範囲を保存し、Service Workerに通知する
 */
export const handleTextSelection = (): void => {
  // 拡張機能のコンテキストが無効な場合は何もしない
  if (!isExtensionValid()) {
    return;
  }

  const selection = window.getSelection();

  if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
    selectedText = selection.toString().trim();
    selectedRange = selection.getRangeAt(0).cloneRange();

    console.log('テキストが選択されました:', selectedText);

    // 選択情報をストレージに保存（ポップアップで使用）
    sendMessageSafely({
      action: CONSTANTS.MESSAGE_ACTIONS.TEXT_SELECTED as 'textSelected',
      text: selectedText,
      length: selectedText.length,
    });
  } else {
    selectedText = '';
    selectedRange = null;

    // 選択解除をポップアップに通知
    sendMessageSafely({
      action: CONSTANTS.MESSAGE_ACTIONS.TEXT_DESELECTED as 'textDeselected',
    });
  }
};

/**
 * ページ内で指定されたテキストを検索して範囲を取得する
 * @param {string} searchText - 検索するテキスト
 * @returns {Range|null} 見つかった場合はRange オブジェクト、見つからない場合はnull
 */
export const findTextInPage = (searchText: string): Range | null => {
  try {
    // TreeWalkerを使用してテキストノードを検索
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
    );

    let node: Node | null = walker.nextNode();
    while (node) {
      const nodeText = node.textContent;
      if (nodeText) {
        const index = nodeText.indexOf(searchText);

        if (index !== -1) {
          const range = document.createRange();
          range.setStart(node, index);
          range.setEnd(node, index + searchText.length);
          return range;
        }
      }
      node = walker.nextNode();
    }

    return null;
  } catch (error) {
    console.error('テキスト検索エラー:', error);
    return null;
  }
};

/**
 * 指定された範囲内のテキストノードとその範囲情報を取得する
 * @param {Range} range - 検索範囲
 * @returns {Array} テキストノード情報の配列
 */
export const getTextNodesInRange = (range: Range): TextNodeInfo[] => {
  const textNodes: TextNodeInfo[] = [];
  const walker = document.createTreeWalker(
    range.commonAncestorContainer,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node: Node): number => {
        // 範囲内にあるテキストノードのみを受け入れ
        const nodeRange = document.createRange();
        nodeRange.selectNodeContents(node);
        return range.intersectsNode(node)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    },
  );

  let node: Node | null = walker.nextNode();
  while (node) {
    const textNode = node as Text;
    // ノード内での開始・終了位置を計算
    let startOffset = 0;
    let endOffset = textNode.textContent?.length || 0;

    // より正確な範囲計算
    try {
      if (range.startContainer === node) {
        startOffset = range.startOffset;
      } else if (range.comparePoint && range.comparePoint(node, 0) <= 0) {
        startOffset = 0;
      } else if (range.startContainer.contains?.(node)) {
        startOffset = 0;
      }

      if (range.endContainer === node) {
        endOffset = range.endOffset;
      } else if (
        range.comparePoint &&
        range.comparePoint(node, textNode.textContent?.length || 0) >= 0
      ) {
        endOffset = textNode.textContent?.length || 0;
      } else if (range.endContainer.contains?.(node)) {
        endOffset = textNode.textContent?.length || 0;
      }
    } catch (_error) {
      // フォールバック処理
      if (range.startContainer === node) {
        startOffset = range.startOffset;
      }
      if (range.endContainer === node) {
        endOffset = range.endOffset;
      }
    }

    // 有効な範囲がある場合のみ追加
    if (startOffset < endOffset) {
      textNodes.push({
        node: textNode,
        startOffset: startOffset,
        endOffset: endOffset,
      });
    }
    node = walker.nextNode();
  }

  return textNodes;
};

/**
 * 右クリック時の選択情報を保存する
 */
export const handleContextMenu = (): void => {
  // 現在の選択情報をコンテキストメニュー用に保存
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
    contextMenuSelection.text = selection.toString().trim();
    contextMenuSelection.range = selection.getRangeAt(0).cloneRange();
    contextMenuSelection.timestamp = Date.now();
    console.log(
      'コンテキストメニュー用選択情報を保存:',
      contextMenuSelection.text,
    );
  }
};

/**
 * テキスト選択イベントリスナーを設定する
 */
export const setupTextSelectionListeners = (): void => {
  // テキスト選択を監視
  document.addEventListener('mouseup', handleTextSelection);
  document.addEventListener('keyup', handleTextSelection);

  // 右クリック時の処理
  document.addEventListener('contextmenu', handleContextMenu);
};
