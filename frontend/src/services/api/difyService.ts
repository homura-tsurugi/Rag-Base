// ============================================
// Dify API サービス
// ============================================
// Dify Cloud APIとの通信を管理

import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type {
  ChatMessageRequest,
  ChatMessageResponse,
  Conversation,
  Message,
} from '@/types';

// --------------------------------------------
// Dify API クライアント設定
// --------------------------------------------

const DIFY_API_KEY = import.meta.env.VITE_DIFY_API_KEY;
const DIFY_API_URL = import.meta.env.VITE_DIFY_API_URL || 'https://api.dify.ai/v1';

if (!DIFY_API_KEY) {
  console.warn(
    '⚠️ VITE_DIFY_API_KEY が設定されていません。.env ファイルを確認してください。'
  );
}

/**
 * Dify API クライアントの作成
 */
const createDifyClient = (): AxiosInstance => {
  return axios.create({
    baseURL: DIFY_API_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DIFY_API_KEY}`,
    },
    timeout: 30000, // 30秒（AI応答待ち時間を考慮）
  });
};

const difyClient = createDifyClient();

// --------------------------------------------
// エラーハンドリング
// --------------------------------------------

interface DifyErrorResponse {
  code?: string;
  message?: string;
  status?: number;
}

const handleDifyError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const difyError = error.response?.data as DifyErrorResponse;
    const status = error.response?.status;
    const message = difyError?.message || error.message;

    console.error('Dify API エラー:', {
      status,
      code: difyError?.code,
      message,
    });

    if (status === 401) {
      throw new Error('APIキーが無効です。設定を確認してください。');
    } else if (status === 429) {
      throw new Error('API呼び出し制限に達しました。しばらく待ってから再試行してください。');
    } else if (status === 500) {
      throw new Error('Difyサーバーエラーが発生しました。しばらく待ってから再試行してください。');
    } else {
      throw new Error(`Dify API エラー: ${message}`);
    }
  }

  throw new Error('予期しないエラーが発生しました');
};

// --------------------------------------------
// Dify チャット API
// --------------------------------------------

/**
 * メッセージ送信
 * @param request メッセージリクエスト
 * @returns メッセージレスポンス
 */
export const sendMessage = async (
  request: ChatMessageRequest
): Promise<ChatMessageResponse> => {
  try {
    const response = await difyClient.post('/chat-messages', {
      inputs: {},
      query: request.content,
      user: request.user_id,
      conversation_id: request.session_id || undefined,
      response_mode: 'blocking', // ストリーミングではなく一括応答
    });

    const data = response.data;

    // Dify レスポンスをアプリケーション形式に変換
    const assistantMessage: Message = {
      message_id: data.message_id || `msg-${Date.now()}`,
      session_id: data.conversation_id,
      role: 'assistant',
      content: data.answer,
      created_at: new Date().toISOString(),
      tokens_used: data.metadata?.usage?.total_tokens,
      citations: data.metadata?.retriever_resources?.map((resource: any) => ({
        source: resource.document_name || resource.segment_id,
        content: resource.content,
        dataset_type: resource.dataset_id?.includes('user') ? 'user' : 'system',
      })),
    };

    return {
      message: assistantMessage,
      session_id: data.conversation_id,
    };
  } catch (error) {
    return handleDifyError(error);
  }
};

/**
 * 会話一覧取得
 * @param userId ユーザーID
 * @returns 会話一覧
 */
export const getConversations = async (userId: string): Promise<Conversation[]> => {
  try {
    const response = await difyClient.get('/conversations', {
      params: {
        user: userId,
        limit: 100,
      },
    });

    const data = response.data;

    // Dify レスポンスをアプリケーション形式に変換
    return data.data.map((conv: any) => ({
      session_id: conv.id,
      user_id: userId,
      title: conv.name || '新しい会話',
      created_at: new Date(conv.created_at * 1000).toISOString(),
      updated_at: new Date(conv.updated_at * 1000).toISOString(),
      message_count: conv.message_count || 0,
    }));
  } catch (error) {
    return handleDifyError(error);
  }
};

/**
 * メッセージ履歴取得
 * @param sessionId セッションID
 * @returns メッセージ一覧
 */
export const getMessages = async (sessionId: string): Promise<Message[]> => {
  try {
    const response = await difyClient.get(`/messages`, {
      params: {
        conversation_id: sessionId,
        limit: 100,
      },
    });

    const data = response.data;

    // Dify レスポンスをアプリケーション形式に変換
    return data.data.map((msg: any) => ({
      message_id: msg.id,
      session_id: sessionId,
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.query || msg.answer,
      created_at: new Date(msg.created_at * 1000).toISOString(),
      tokens_used: msg.metadata?.usage?.total_tokens,
      citations: msg.metadata?.retriever_resources?.map((resource: any) => ({
        source: resource.document_name || resource.segment_id,
        content: resource.content,
        dataset_type: resource.dataset_id?.includes('user') ? 'user' : 'system',
      })),
    }));
  } catch (error) {
    return handleDifyError(error);
  }
};

/**
 * 新規会話作成
 * @param userId ユーザーID
 * @returns 新しい会話（Difyでは明示的な作成は不要、最初のメッセージ送信で自動作成）
 */
export const createConversation = async (userId: string): Promise<Conversation> => {
  // Difyでは会話の明示的な作成は不要
  // 最初のメッセージ送信時に自動的に作成される
  const newConversation: Conversation = {
    session_id: '', // メッセージ送信時に決定
    user_id: userId,
    title: '新しい会話',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    message_count: 0,
  };

  return Promise.resolve(newConversation);
};

/**
 * 会話削除
 * @param sessionId セッションID
 */
export const deleteConversation = async (sessionId: string): Promise<void> => {
  try {
    await difyClient.delete(`/conversations/${sessionId}`);
  } catch (error) {
    return handleDifyError(error);
  }
};

/**
 * 会話をグループ化（今日、昨日、今週、それ以前）
 * @param conversations 会話一覧
 * @returns グループ化された会話
 */
export const groupConversationsByDate = (
  conversations: Conversation[]
): Record<string, Conversation[]> => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const groups: Record<string, Conversation[]> = {
    今日: [],
    昨日: [],
    今週: [],
    それ以前: [],
  };

  conversations.forEach((conv) => {
    const convDate = new Date(conv.updated_at || conv.created_at);
    const convDay = new Date(convDate.getFullYear(), convDate.getMonth(), convDate.getDate());

    if (convDay.getTime() === today.getTime()) {
      groups['今日'].push(conv);
    } else if (convDay.getTime() === yesterday.getTime()) {
      groups['昨日'].push(conv);
    } else if (convDay.getTime() >= weekAgo.getTime()) {
      groups['今週'].push(conv);
    } else {
      groups['それ以前'].push(conv);
    }
  });

  return groups;
};
