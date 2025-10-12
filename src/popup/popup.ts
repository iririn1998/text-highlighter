/**
 * ポップアップスクリプト
 * カラー選択UIの制御を担当
 */

import {
  DEFAULT_COLOR,
  DEFAULT_COLORS,
  STORAGE_KEY,
} from '../shared/constants';
import type { StorageData } from '../shared/types';

/**
 * 現在選択されている色を取得
 */
const getSelectedColor = async (): Promise<string> => {
  try {
    const result = await chrome.storage.sync.get(STORAGE_KEY);
    const data = result[STORAGE_KEY] as StorageData | undefined;
    return data?.selectedColor || DEFAULT_COLOR;
  } catch (error) {
    console.error(error);
    return DEFAULT_COLOR;
  }
};

/**
 * 色を保存
 */
const saveSelectedColor = async (color: string): Promise<void> => {
  try {
    const result = await chrome.storage.sync.get(STORAGE_KEY);
    const data = (result[STORAGE_KEY] as StorageData) || {
      highlights: [],
      selectedColor: DEFAULT_COLOR,
    };

    data.selectedColor = color;

    await chrome.storage.sync.set({ [STORAGE_KEY]: data });
  } catch (error) {
    console.error(error);
  }
};

/**
 * UIを初期化
 */
const initializeUI = async (): Promise<void> => {
  const currentColor = await getSelectedColor();

  // カラーボタンを作成
  const colorGrid = document.getElementById('colorGrid');
  if (!colorGrid) {
    return;
  }

  // 既存のボタンをクリア
  colorGrid.innerHTML = '';

  // 各色のボタンを作成
  for (const colorOption of DEFAULT_COLORS) {
    const button = document.createElement('button');
    button.className = 'color-button';
    button.style.backgroundColor = colorOption.value;
    button.setAttribute('data-color', colorOption.value);
    button.textContent = colorOption.name;

    // 現在選択されている色にはselectedクラスを追加
    if (colorOption.value === currentColor) {
      button.classList.add('selected');
    }

    // クリックイベント
    button.addEventListener('click', async () => {
      // 全てのボタンからselectedクラスを削除
      document.querySelectorAll('.color-button').forEach((btn) => {
        btn.classList.remove('selected');
      });

      // クリックされたボタンにselectedクラスを追加
      button.classList.add('selected');

      // 色を保存
      await saveSelectedColor(colorOption.value);
    });

    colorGrid.appendChild(button);
  }
};

/**
 * 初期化
 */
document.addEventListener('DOMContentLoaded', () => {
  initializeUI();
});
