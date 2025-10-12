/**
 * 共通ユーティリティ関数
 */

/**
 * ハイライト用のユニークなIDを生成する
 * @returns {string} 生成されたハイライトID
 */
export const generateHighlightId = (): string => {
  return `highlight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 要素のXPathを取得する
 * @param {Element} element - XPathを取得する要素
 * @returns {string|null} XPath文字列、取得できない場合はnull
 */
export const getXPath = (element: Element): string | null => {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  if (element.id) {
    return `//*[@id="${element.id}"]`;
  }

  const parts: string[] = [];
  let currentElement: Element | null = element;
  while (currentElement && currentElement.nodeType === Node.ELEMENT_NODE) {
    let index = 1;
    let sibling = currentElement.previousSibling;

    while (sibling) {
      if (
        sibling.nodeType === Node.ELEMENT_NODE &&
        (sibling as Element).tagName === currentElement.tagName
      ) {
        index++;
      }
      sibling = sibling.previousSibling;
    }

    const tagName = currentElement.tagName.toLowerCase();
    parts.unshift(`${tagName}[${index}]`);
    currentElement = currentElement.parentElement;
  }

  return `/${parts.join('/')}`;
};

/**
 * XPathから要素を取得する
 * @param {string} xpath - XPath文字列
 * @returns {Element|null} 見つかった要素、見つからない場合はnull
 */
export const getElementByXPath = (xpath: string): Element | null => {
  try {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    );
    return result.singleNodeValue as Element | null;
  } catch (error) {
    console.error('XPath評価エラー:', error);
    return null;
  }
};

/**
 * 要素内のテキストノードを取得する
 * @param {Element} element - 検索対象の要素
 * @returns {Array<Text>} テキストノードの配列
 */
export const getTextNodes = (element: Element): Text[] => {
  const textNodes: Text[] = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);

  let node: Node | null;
  while ((node = walker.nextNode())) {
    if (node.textContent?.trim()) {
      textNodes.push(node as Text);
    }
  }

  return textNodes;
};

/**
 * 現在のドメインを取得する
 * @returns {string} 現在のページのホスト名
 */
export const getCurrentDomain = (): string => {
  return window.location.hostname;
};

/**
 * 現在のドメイン用のストレージキーを取得する
 * @returns {string} ストレージキー
 */
export const getStorageKey = (domain: string): string => {
  return `highlights_${domain}`;
};

/**
 * 二つの範囲が重複しているかチェックする
 * @param {Range} range1 - 最初の範囲
 * @param {Range} range2 - 二番目の範囲
 * @returns {boolean} 範囲が重複している場合はtrue
 */
export const rangesOverlap = (range1: Range, range2: Range): boolean => {
  try {
    return (
      range1.compareBoundaryPoints(Range.START_TO_END, range2) > 0 &&
      range2.compareBoundaryPoints(Range.START_TO_END, range1) > 0
    );
  } catch (_error) {
    return false;
  }
};

/**
 * 要素から範囲を取得する
 * @param {Element} element - 範囲を取得する要素
 * @returns {Range} 要素の内容を選択する範囲
 */
export const getRangeFromElement = (element: Element): Range => {
  const range = document.createRange();
  range.selectNodeContents(element);
  return range;
};
