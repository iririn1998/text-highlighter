/**
 * アプリケーション全体で使用する定数
 */

/**
 * Chrome Storage に保存するデータのキー
 */
export const STORAGE_KEY = 'text-highlighter-data';

/**
 * デフォルトカラー設定
 */
export const DEFAULT_COLORS = [
  { id: 'yellow', name: '黄', value: '#fff59d', class: 'highlight-yellow' },
  { id: 'green', name: '緑', value: '#a5d6a7', class: 'highlight-green' },
  { id: 'red', name: '赤', value: '#ef5350', class: 'highlight-red' },
  { id: 'blue', name: '青', value: '#90caf9', class: 'highlight-blue' },
] as const;

export const DEFAULT_COLOR = DEFAULT_COLORS[0].id;
