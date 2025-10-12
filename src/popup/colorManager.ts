/**
 * 色管理モジュール
 */

import { CONSTANTS } from '../shared/constants';

interface ColorInfo {
  color: string;
  name: string;
}

// 現在の色データ
let currentHighlightColor = CONSTANTS.DEFAULT_HIGHLIGHT_COLOR;
let currentColorName = '黄色';

/**
 * 現在の色を取得する
 * @returns {Object} 現在の色情報
 */
export const getCurrentColor = (): ColorInfo => {
  return {
    color: currentHighlightColor,
    name: currentColorName,
  };
};

/**
 * ハイライト色を選択し、現在の色として設定する
 * @param {string} color - 選択する色（16進数カラーコード）
 * @param {string} colorName - 色の名前
 */
export const selectColor = (color: string, colorName: string): void => {
  currentHighlightColor = color;
  currentColorName = colorName;
  saveCurrentColor();
};

/**
 * 現在選択されているハイライト色をストレージに保存する
 * @returns {Promise<void>}
 */
const saveCurrentColor = async (): Promise<void> => {
  try {
    await chrome.storage.sync.set({
      [CONSTANTS.STORAGE_KEYS.CURRENT_HIGHLIGHT_COLOR]: currentHighlightColor,
      [CONSTANTS.STORAGE_KEYS.CURRENT_COLOR_NAME]: currentColorName,
    });
  } catch (error) {
    console.error('現在の色保存エラー:', error);
  }
};

/**
 * ストレージから現在のハイライト色を読み込む
 * @returns {Promise<void>}
 */
export const loadCurrentColor = async (): Promise<void> => {
  try {
    const result = await chrome.storage.sync.get([
      CONSTANTS.STORAGE_KEYS.CURRENT_HIGHLIGHT_COLOR,
      CONSTANTS.STORAGE_KEYS.CURRENT_COLOR_NAME,
    ]);
    if (result[CONSTANTS.STORAGE_KEYS.CURRENT_HIGHLIGHT_COLOR]) {
      currentHighlightColor =
        result[CONSTANTS.STORAGE_KEYS.CURRENT_HIGHLIGHT_COLOR];
      currentColorName =
        result[CONSTANTS.STORAGE_KEYS.CURRENT_COLOR_NAME] || '選択された色';
    }
  } catch (error) {
    console.error('現在の色読み込みエラー:', error);
  }
};
