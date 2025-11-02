// ============================================
// チャットサービス統合
// ============================================
// 環境変数に基づいてモック/実API を切り替え

import {
  mockSendMessage,
  mockGetConversations,
  mockGetMessages,
  mockCreateConversation,
  mockDeleteConversation,
  groupConversationsByDate as mockGroupConversationsByDate,
} from './mockChatService';

import {
  sendMessage as difySendMessage,
  getConversations as difyGetConversations,
  getMessages as difyGetMessages,
  createConversation as difyCreateConversation,
  deleteConversation as difyDeleteConversation,
  groupConversationsByDate as difyGroupConversationsByDate,
} from './difyService';

// 環境変数でモード切り替え
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

console.log(
  `🔌 チャットサービスモード: ${USE_MOCK_API ? 'モック（開発）' : 'Dify API（本番）'}`
);

// --------------------------------------------
// エクスポート（環境に応じて切り替え）
// --------------------------------------------

export const sendMessage = USE_MOCK_API ? mockSendMessage : difySendMessage;
export const getConversations = USE_MOCK_API ? mockGetConversations : difyGetConversations;
export const getMessages = USE_MOCK_API ? mockGetMessages : difyGetMessages;
export const createConversation = USE_MOCK_API
  ? mockCreateConversation
  : difyCreateConversation;
export const deleteConversation = USE_MOCK_API
  ? mockDeleteConversation
  : difyDeleteConversation;
export const groupConversationsByDate = USE_MOCK_API
  ? mockGroupConversationsByDate
  : difyGroupConversationsByDate;
