/**
 * ハイライトデータの型定義
 */
export type HighlightData = {
  id: string;
  text: string;
  color: string;
  xpath: string;
  offset: number;
  length: number;
  url: string;
  createdAt: number;
};

/**
 * ストレージに保存するデータ構造
 */
export type StorageData = {
  highlights: HighlightData[];
  selectedColor: string;
};

/**
 * メッセージの型定義
 */
export type MessageType =
  | 'ADD_HIGHLIGHT'
  | 'REMOVE_HIGHLIGHT'
  | 'GET_HIGHLIGHTS';

export type Message = {
  type: MessageType;
  data?: HighlightData | { id: string } | { url: string };
};
