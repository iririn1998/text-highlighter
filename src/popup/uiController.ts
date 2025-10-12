/**
 * UI制御モジュール
 */

import { selectColor } from './colorManager';

// DOM要素
let statusMessage: HTMLElement | null = null;

/**
 * DOM要素を初期化する
 */
export const initializeDOMElements = (): void => {
    statusMessage = document.getElementById('statusMessage');
};

/**
 * ポップアップ内の各要素にイベントリスナーを設定する
 */
export const setupEventListeners = (): void => {
    // デフォルト色ボタンのイベントリスナー
    const colorButtons = document.querySelectorAll('.color-button[data-color]');
    colorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const color = button.getAttribute('data-color');
            const colorName = button.textContent;
            if (color && colorName) {
                selectColor(color, colorName);
                updateSelectedColorButton(color);
            }
        });
    });
};

/**
 * 選択された色ボタンの表示スタイルを更新する
 * @param {string} selectedColor - 選択された色のカラーコード
 */
export const updateSelectedColorButton = (selectedColor: string): void => {
    // 全ての色ボタンからselectedクラスを削除
    document.querySelectorAll('.color-button').forEach(button => {
        button.classList.remove('selected');
    });
    
    // 選択された色のボタンにselectedクラスを追加
    const selectedButton = document.querySelector(`[data-color="${selectedColor}"]`);
    if (selectedButton) {
        selectedButton.classList.add('selected');
    }
};

/**
 * ステータスメッセージを表示する
 * @param {string} message - 表示するメッセージ
 * @param {string} type - メッセージのタイプ（'success', 'error', など）
 */
export const showStatus = (message: string, type: string): void => {
    if (!statusMessage) return;
    
    statusMessage.textContent = message;
    statusMessage.className = `status-message status-${type}`;
    statusMessage.style.display = 'block';
    
    // 3秒後に非表示
    setTimeout(() => {
        if (statusMessage) {
            statusMessage.style.display = 'none';
        }
    }, 3000);
};

