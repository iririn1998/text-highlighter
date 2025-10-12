/**
 * 共通型定義
 */

// メッセージの基本構造
export interface BaseMessage {
  action: string;
  success?: boolean;
  error?: string;
  timestamp?: number;
}

// Pingメッセージ
export interface PingMessage extends BaseMessage {
  action: 'ping';
}

// Pingレスポンス
export interface PingResponse extends BaseMessage {
  success: true;
  message: string;
  timestamp: number;
  workerStatus: unknown;
}

// テキスト選択メッセージ
export interface TextSelectedMessage extends BaseMessage {
  action: 'textSelected';
  text: string;
  length: number;
}

// テキスト選択解除メッセージ
export interface TextDeselectedMessage extends BaseMessage {
  action: 'textDeselected';
}

// ハイライト適用メッセージ
export interface ApplyHighlightMessage extends BaseMessage {
  action: 'applyHighlight';
  color: string;
}

// コンテキストメニューからのハイライト追加メッセージ
export interface AddHighlightFromContextMessage extends BaseMessage {
  action: 'addHighlightFromContext';
  selectedText?: string;
  color: string;
}

// ストレージ保存メッセージ
export interface SaveToStorageMessage extends BaseMessage {
  action: 'saveToStorage';
  key: string;
  data: unknown;
}

// ストレージ保存レスポンス
export interface SaveToStorageResponse extends BaseMessage {
  action: 'saveToStorage';
  success: boolean;
  timestamp: number;
  duration: number;
  error?: string;
}

// ストレージ読み込みメッセージ
export interface LoadFromStorageMessage extends BaseMessage {
  action: 'loadFromStorage';
  key: string;
}

// ストレージ読み込みレスポンス
export interface LoadFromStorageResponse extends BaseMessage {
  action: 'loadFromStorage';
  success: boolean;
  data?: unknown;
  timestamp: number;
  duration: number;
  error?: string;
}

// 任意のメッセージ型 (Union型)
export type Message =
  | PingMessage
  | TextSelectedMessage
  | TextDeselectedMessage
  | ApplyHighlightMessage
  | AddHighlightFromContextMessage
  | SaveToStorageMessage
  | LoadFromStorageMessage;

// 任意のレスポンス型 (Union型)
export type MessageResponse =
  | PingResponse
  | SaveToStorageResponse
  | LoadFromStorageResponse
  | BaseMessage;
