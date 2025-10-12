import {
  DEFAULT_COLOR,
  DEFAULT_COLORS,
  STORAGE_KEY,
} from '../shared/constants';
import type { ColorOption } from '../shared/types';

/**
 * 選択している色を取得する
 */
const getColor = async () => {
  const result = await chrome.storage.sync.get(STORAGE_KEY);
  return result[STORAGE_KEY]?.selectedColor || DEFAULT_COLOR;
};

/**
 * 選択範囲内の全てのテキストノードを取得する
 */
const getTextNodesInRange = (range: Range): Node[] => {
  const textNodes: Node[] = [];
  const walker = document.createTreeWalker(
    range.commonAncestorContainer,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        const nodeRange = document.createRange();
        nodeRange.selectNodeContents(node);
        // 選択範囲と交差するテキストノードのみを取得
        if (
          range.compareBoundaryPoints(Range.END_TO_START, nodeRange) < 0 &&
          range.compareBoundaryPoints(Range.START_TO_END, nodeRange) > 0
        ) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_REJECT;
      },
    },
  );

  let node: Node | null = walker.nextNode();
  while (node) {
    textNodes.push(node);
    node = walker.nextNode();
  }

  return textNodes;
};

/**
 * 選択箇所に色を付ける
 */
const applyColor = async (id: ColorOption['id']) => {
  const color = DEFAULT_COLORS.find((color) => color.id === id);
  if (!color) return;

  // 選択箇所を取得
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  if (range.collapsed) return; // 選択範囲が空の場合は何もしない

  try {
    // 単一要素内の選択の場合はsurroundContentsを使用
    const span = document.createElement('span');
    span.style.backgroundColor = color.value;
    span.className = `${color.class}`;
    range.surroundContents(span);

    // span内が空の場合は削除
    if (!span.textContent?.trim()) {
      span.remove();
    }
  } catch {
    // 複数の要素にまたがる場合は、各テキストノードを個別に処理
    const textNodes = getTextNodesInRange(range);

    textNodes.forEach((node) => {
      const nodeRange = document.createRange();
      nodeRange.selectNodeContents(node);

      // 開始ノードの場合、選択開始位置から
      if (node === range.startContainer) {
        nodeRange.setStart(node, range.startOffset);
      }

      // 終了ノードの場合、選択終了位置まで
      if (node === range.endContainer) {
        nodeRange.setEnd(node, range.endOffset);
      }

      // spanで囲む
      const span = document.createElement('span');
      span.style.backgroundColor = color.value;
      span.className = `${color.class}`;

      try {
        nodeRange.surroundContents(span);

        // span内が空の場合は削除
        if (!span.textContent?.trim()) {
          span.remove();
        }
      } catch (error) {
        console.error(error);
      }
    });
  }

  // 選択を解除
  selection.removeAllRanges();
};

// メッセージリスナー
chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === 'ADD_HIGHLIGHT') {
    const color = await getColor();
    applyColor(color);
  }
});
