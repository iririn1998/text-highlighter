/**
 * ハイライトデータの型定義
 */
export interface HighlightData {
  id: string;
  text: string;
  color: string;
  xpath: string;
  offset: number;
  length: number;
  url: string;
  createdAt: number;
}

/**
 * ストレージに保存するデータ構造
 */
export interface StorageData {
  highlights: HighlightData[];
  selectedColor: string;
}

/**
 * メッセージの型定義
 */
export type MessageType =
  | 'ADD_HIGHLIGHT'
  | 'REMOVE_HIGHLIGHT'
  | 'GET_HIGHLIGHTS';

export interface Message {
  type: MessageType;
  data?: HighlightData | { id: string } | { url: string };
}

/**
 * デフォルトカラー設定
 */
export const DEFAULT_COLORS = [
  { name: '黄', value: '#fff59d', class: 'highlight-yellow' },
  { name: '緑', value: '#a5d6a7', class: 'highlight-green' },
  { name: '赤', value: '#ef5350', class: 'highlight-red' },
  { name: '青', value: '#90caf9', class: 'highlight-blue' },
] as const;

export const DEFAULT_COLOR = DEFAULT_COLORS[0].value;
