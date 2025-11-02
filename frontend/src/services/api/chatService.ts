// ============================================
// チャットサービス統合
// ============================================
// 環境変数に基づいてモック/実API を切り替え

// Mock imports (currently unused, kept for future development)
// import {
//   mockSendMessage,
//   mockGetConversations,
//   mockGetMessages,
//   mockCreateConversation,
//   mockDeleteConversation,
//   groupConversationsByDate as mockGroupConversationsByDate,
// } from './mockChatService';

import {
  sendMessage as difySendMessage,
  getConversations as difyGetConversations,
  getMessages as difyGetMessages,
  createConversation as difyCreateConversation,
  deleteConversation as difyDeleteConversation,
  groupConversationsByDate as difyGroupConversationsByDate,
} from './difyService';

// 環境変数でモード切り替え（デバッグ用に強制的にfalseに設定）
const USE_MOCK_API = false; // 強制的にDify APIを使用

console.log(
  `🔌 チャットサービスモード: ${USE_MOCK_API ? 'モック（開発）' : 'Dify API（本番）'}`
);

// --------------------------------------------
// エクスポート（強制的にDify APIを使用）
// --------------------------------------------

export const sendMessage = difySendMessage;
export const getConversations = difyGetConversations;
export const getMessages = difyGetMessages;
export const createConversation = difyCreateConversation;
export const deleteConversation = difyDeleteConversation;
export const groupConversationsByDate = difyGroupConversationsByDate;
