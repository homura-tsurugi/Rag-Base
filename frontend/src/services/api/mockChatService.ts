// ============================================
// モックチャットサービス
// ============================================
// MVP段階での開発・テスト用モックチャット
// 本番環境では chatService.ts に切り替え

import type {
  ChatMessageRequest,
  ChatMessageResponse,
  Conversation,
  Message,
  Citation,
} from '@/types';

// --------------------------------------------
// モック会話データ
// --------------------------------------------

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    session_id: 'session-001',
    user_id: 'client-001',
    title: '今週の目標について',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    message_count: 8,
  },
  {
    session_id: 'session-002',
    user_id: 'client-001',
    title: 'キャリアの方向性',
    created_at: new Date(Date.now() - 86400000).toISOString(), // 昨日
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    message_count: 5,
  },
  {
    session_id: 'session-003',
    user_id: 'client-001',
    title: 'ワークライフバランス',
    created_at: new Date(Date.now() - 86400000 - 21600000).toISOString(), // 昨日
    updated_at: new Date(Date.now() - 86400000 - 21600000).toISOString(),
    message_count: 12,
  },
  {
    session_id: 'session-004',
    user_id: 'client-001',
    title: 'チーム管理のコツ',
    created_at: new Date(Date.now() - 259200000).toISOString(), // 3日前（今週）
    updated_at: new Date(Date.now() - 259200000).toISOString(),
    message_count: 6,
  },
];

// メッセージストア（セッションID -> メッセージリスト）
const MESSAGE_STORE: Record<string, Message[]> = {
  'session-001': [
    {
      message_id: 'msg-001',
      session_id: 'session-001',
      role: 'user',
      content: '今週の目標について相談したいです。',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      message_id: 'msg-002',
      session_id: 'session-001',
      role: 'assistant',
      content:
        'ご相談ありがとうございます。目標設定は、あなたの成長において非常に重要なステップですね。\n\nSMART原則（Specific, Measurable, Achievable, Relevant, Time-bound）に基づいて目標を設定することで、より明確で達成可能な目標になります。\n\n具体的に、今週はどのような目標を立てたいとお考えですか？',
      citations: [
        {
          source: 'コーチング理論体系.pdf',
          content:
            'SMART原則は、効果的な目標設定のフレームワークとして広く活用されています。',
          dataset_type: 'system',
        },
      ],
      created_at: new Date(Date.now() - 3595000).toISOString(),
      tokens_used: 245,
    },
  ],
};

// --------------------------------------------
// AIレスポンスパターン
// --------------------------------------------

const AI_RESPONSE_PATTERNS: Record<
  string,
  { content: string; citations: Citation[] }
> = {
  目標: {
    content:
      'ご相談ありがとうございます。目標設定は、あなたの成長において非常に重要なステップですね。\n\nSMART原則（Specific, Measurable, Achievable, Relevant, Time-bound）に基づいて目標を設定することで、より明確で達成可能な目標になります。\n\n具体的に、今週はどのような目標を立てたいとお考えですか？',
    citations: [
      {
        source: 'コーチング理論体系.pdf',
        content:
          'SMART原則は、効果的な目標設定のフレームワークとして広く活用されています。',
        dataset_type: 'system',
      },
      {
        source: 'あなたの過去の目標設定記録',
        content: '先月は3つの目標を設定し、2つを達成されています。',
        dataset_type: 'user',
      },
    ],
  },
  振り返り: {
    content:
      '振り返りの時間を作られたのは素晴らしいですね。\n\nまず、今週達成できたことを3つ挙げてみましょう。小さなことでも構いません。その後、改善したい点についても考えてみましょう。\n\nどんなことを振り返りたいですか？',
    citations: [
      {
        source: 'リフレクション技法.pdf',
        content: '定期的な振り返りは、継続的な成長のために重要です。',
        dataset_type: 'system',
      },
    ],
  },
  モチベーション: {
    content:
      'モチベーションについてお話しいただき、ありがとうございます。\n\nモチベーションは変動するものですが、それを理解し、対処することが大切です。まず、今の状態を0〜10のスケールで表すとどのくらいでしょうか？\n\nまた、過去にモチベーションが高かった時のことを思い出してみてください。その時はどんな状況でしたか？',
    citations: [
      {
        source: 'モチベーション理論.pdf',
        content:
          'モチベーション理論では、内発的動機づけと外発的動機づけのバランスが重要とされています。',
        dataset_type: 'system',
      },
      {
        source: 'あなたのエネルギーレベル記録',
        content: '先週はモチベーション7/10と記録されています。',
        dataset_type: 'user',
      },
    ],
  },
  キャリア: {
    content:
      'キャリアについて考える時間を持たれたのは素晴らしいことですね。\n\n長期的な視点と短期的な視点の両方から考えることが大切です。まず、5年後にどんな自分でありたいかをイメージしてみましょう。\n\nどのような分野で活躍したいとお考えですか？',
    citations: [
      {
        source: 'キャリア開発ガイド.pdf',
        content: 'キャリア開発において、ビジョンを明確にすることは第一歩です。',
        dataset_type: 'system',
      },
    ],
  },
  default: {
    content:
      'ご質問ありがとうございます。\n\nあなたの成長をサポートできることを嬉しく思います。より具体的にお話しいただけますか？どんな状況で、何を達成したいとお考えですか？\n\n一緒に考えていきましょう。',
    citations: [],
  },
};

// --------------------------------------------
// モックチャットAPI
// --------------------------------------------

/**
 * モックメッセージ送信
 * @param request メッセージリクエスト
 * @returns メッセージレスポンス
 */
export const mockSendMessage = async (
  request: ChatMessageRequest
): Promise<ChatMessageResponse> => {
  // @MOCK_TO_API: POST {API_PATHS.CHAT.MESSAGES}
  // Request: ChatMessageRequest
  // Response: ChatMessageResponse

  // AI応答のリアルなシミュレーション（3-5秒遅延）
  const delay = Math.random() * 2000 + 3000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // セッションIDの決定（新規会話の場合は生成）
  const sessionId = request.session_id || `session-${Date.now()}`;

  // ユーザーメッセージを保存
  const userMessage: Message = {
    message_id: `msg-${Date.now()}-user`,
    session_id: sessionId,
    role: 'user',
    content: request.content,
    created_at: new Date().toISOString(),
  };

  // AI応答を生成（キーワードベースのパターンマッチング）
  let responsePattern = AI_RESPONSE_PATTERNS.default;
  for (const [keyword, pattern] of Object.entries(AI_RESPONSE_PATTERNS)) {
    if (request.content.includes(keyword)) {
      responsePattern = pattern;
      break;
    }
  }

  // AI応答メッセージ
  const assistantMessage: Message = {
    message_id: `msg-${Date.now()}-assistant`,
    session_id: sessionId,
    role: 'assistant',
    content: responsePattern.content,
    citations: responsePattern.citations.length > 0 ? responsePattern.citations : undefined,
    created_at: new Date().toISOString(),
    tokens_used: Math.floor(Math.random() * 300 + 200),
  };

  // メッセージをストアに保存
  if (!MESSAGE_STORE[sessionId]) {
    MESSAGE_STORE[sessionId] = [];
  }
  MESSAGE_STORE[sessionId].push(userMessage, assistantMessage);

  return {
    message: assistantMessage,
    session_id: sessionId,
  };
};

/**
 * モック会話一覧取得
 * @param userId ユーザーID
 * @returns 会話一覧
 */
export const mockGetConversations = async (userId: string): Promise<Conversation[]> => {
  // @MOCK_TO_API: GET {API_PATHS.CHAT.CONVERSATIONS}?user_id={userId}
  // Response: Conversation[]

  // API呼び出しシミュレーション（500ms遅延）
  await new Promise((resolve) => setTimeout(resolve, 500));

  return MOCK_CONVERSATIONS.filter((conv) => conv.user_id === userId);
};

/**
 * モックメッセージ履歴取得
 * @param sessionId セッションID
 * @returns メッセージ一覧
 */
export const mockGetMessages = async (sessionId: string): Promise<Message[]> => {
  // @MOCK_TO_API: GET {API_PATHS.CHAT.CONVERSATION_DETAIL(sessionId)}/messages
  // Response: Message[]

  // API呼び出しシミュレーション（500ms遅延）
  await new Promise((resolve) => setTimeout(resolve, 500));

  return MESSAGE_STORE[sessionId] || [];
};

/**
 * モック新規会話作成
 * @param userId ユーザーID
 * @returns 新しい会話
 */
export const mockCreateConversation = async (userId: string): Promise<Conversation> => {
  // @MOCK_TO_API: POST {API_PATHS.CHAT.CONVERSATIONS}
  // Request: { user_id: string }
  // Response: Conversation

  // API呼び出しシミュレーション（300ms遅延）
  await new Promise((resolve) => setTimeout(resolve, 300));

  const newConversation: Conversation = {
    session_id: `session-${Date.now()}`,
    user_id: userId,
    title: '新しい会話',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    message_count: 0,
  };

  MOCK_CONVERSATIONS.unshift(newConversation);
  return newConversation;
};

/**
 * モック会話削除
 * @param sessionId セッションID
 */
export const mockDeleteConversation = async (sessionId: string): Promise<void> => {
  // @MOCK_TO_API: DELETE {API_PATHS.CHAT.DELETE_CONVERSATION(sessionId)}
  // Response: void

  // API呼び出しシミュレーション（300ms遅延）
  await new Promise((resolve) => setTimeout(resolve, 300));

  const index = MOCK_CONVERSATIONS.findIndex((conv) => conv.session_id === sessionId);
  if (index !== -1) {
    MOCK_CONVERSATIONS.splice(index, 1);
  }

  // メッセージストアからも削除
  delete MESSAGE_STORE[sessionId];
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
