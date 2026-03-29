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
  { id: 'yellow', value: '#fff59d', class: 'highlight-yellow' },
  { id: 'green', value: '#a5d6a7', class: 'highlight-green' },
  { id: 'red', value: '#ef5350', class: 'highlight-red' },
  { id: 'blue', value: '#90caf9', class: 'highlight-blue' },
] as const;

export const DEFAULT_COLOR = DEFAULT_COLORS[0].id;
