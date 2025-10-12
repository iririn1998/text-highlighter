/**
 * ポップアップスクリプトのメインエントリーポイント
 */

import { CONSTANTS } from '../shared/constants';
import { getCurrentColor, loadCurrentColor } from './colorManager';
import {
    initializeDOMElements,
    setupEventListeners,
    showStatus,
    updateSelectedColorButton
} from './uiController';

// Text Highlighter Popup Script
console.log('ポップアップスクリプトが読み込まれました');

// グローバル変数
let currentTab: chrome.tabs.Tab | null = null;

/**
 * 現在のタブがコンテンツスクリプトに対応しているかチェックする
 * @returns {boolean}
 */
const isContentScriptAvailable = (): boolean => {
    if (!currentTab?.url) return false;
    
    // コンテンツスクリプトが動作しないページをフィルタリング
    const invalidProtocols = ['chrome://', 'chrome-extension://', 'about:', 'edge://', 'devtools://'];
    return !invalidProtocols.some(protocol => currentTab.url!.startsWith(protocol));
};

/**
 * 現在選択されているテキストの情報をコンテンツスクリプトから取得して更新する
 * @returns {Promise<void>}
 */
const updateSelectionInfo = async (): Promise<void> => {
    try {
        if (!currentTab?.id) return;
        
        // コンテンツスクリプトが利用可能かチェック
        if (!isContentScriptAvailable()) {
            console.log('このページではコンテンツスクリプトが利用できません');
            return;
        }
        
        // コンテンツスクリプトから選択情報を取得
        await chrome.tabs.sendMessage(currentTab.id, {
            action: CONSTANTS.MESSAGE_ACTIONS.GET_SELECTED_TEXT
        });
    } catch (error) {
        // コンテンツスクリプトが読み込まれていない場合のエラーは無視
        console.log('コンテンツスクリプトへの接続に失敗しました（ページがまだ準備できていない可能性があります）');
    }
};

/**
 * ポップアップの初期化を行う
 * 現在のタブの取得、カスタム色の読み込み、イベントリスナーの設定などを行う
 * @returns {Promise<void>}
 */
const initializePopup = async (): Promise<void> => {
    try {
        // DOM要素を初期化
        initializeDOMElements();
        
        // 現在のタブを取得
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        currentTab = tabs[0];
        
        // 選択状態を確認（表示はしないが、selectedTextを更新するため）
        await updateSelectionInfo();
        
        // 現在の色を読み込み
        await loadCurrentColor();
        
        // イベントリスナーを設定
        setupEventListeners();
        
        // 選択された色ボタンの表示を更新
        const currentColor = getCurrentColor();
        updateSelectedColorButton(currentColor.color);
        
        console.log('ポップアップ初期化完了');
    } catch (error) {
        console.error('ポップアップ初期化エラー:', error);
        showStatus('初期化に失敗しました', 'error');
    }
};

// タブの更新を監視
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (tabId === currentTab?.id && changeInfo.status === 'complete') {
        updateSelectionInfo();
    }
});

// ページのメッセージを監視（将来の機能用）
// eslint-disable-next-line @typescript-eslint/no-unused-vars
chrome.runtime.onMessage.addListener((request) => {
    if (request.action === CONSTANTS.MESSAGE_ACTIONS.TEXT_SELECTED) {
        // 将来的に選択テキストを表示する場合はここで処理
    } else if (request.action === CONSTANTS.MESSAGE_ACTIONS.TEXT_DESELECTED) {
        // 将来的に選択解除を表示する場合はここで処理
    }
});

// DOM読み込み完了時に初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('ポップアップDOM読み込み完了');
    initializePopup();
});

