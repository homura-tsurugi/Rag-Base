// ============================================
// モック管理会話履歴サービス
// ============================================
// MVP段階での開発・テスト用モックAPI（D-006: 会話履歴管理）
// 本番環境では adminConversationService.ts に切り替え

import type { Conversation, Message } from '@/types';

// --------------------------------------------
// モック会話データ（全クライアント）
// --------------------------------------------

const MOCK_ALL_CONVERSATIONS: Conversation[] = [
  {
    session_id: 'session-001',
    user_id: 'client1@example.com',
    title: 'client1@example.comとの会話 - 2025-11-01',
    created_at: '2025-11-01T14:20:00Z',
    updated_at: '2025-11-01T14:30:00Z',
    message_count: 15,
    crisis_flag: true,
  },
  {
    session_id: 'session-002',
    user_id: 'client2@example.com',
    title: 'client2@example.comとの会話 - 2025-11-01',
    created_at: '2025-11-01T10:00:00Z',
    updated_at: '2025-11-01T10:15:00Z',
    message_count: 8,
    crisis_flag: false,
  },
  {
    session_id: 'session-003',
    user_id: 'client1@example.com',
    title: 'client1@example.comとの会話 - 2025-10-30',
    created_at: '2025-10-30T16:30:00Z',
    updated_at: '2025-10-30T16:45:00Z',
    message_count: 22,
    crisis_flag: false,
  },
  {
    session_id: 'session-004',
    user_id: 'client3@example.com',
    title: 'client3@example.comとの会話 - 2025-10-29',
    created_at: '2025-10-29T09:00:00Z',
    updated_at: '2025-10-29T09:20:00Z',
    message_count: 12,
    crisis_flag: false,
  },
  {
    session_id: 'session-005',
    user_id: 'client2@example.com',
    title: 'client2@example.comとの会話 - 2025-10-28',
    created_at: '2025-10-28T12:30:00Z',
    updated_at: '2025-10-28T13:00:00Z',
    message_count: 18,
    crisis_flag: true,
  },
  {
    session_id: 'session-006',
    user_id: 'client1@example.com',
    title: 'client1@example.comとの会話 - 2025-10-25',
    created_at: '2025-10-25T11:00:00Z',
    updated_at: '2025-10-25T11:30:00Z',
    message_count: 10,
    crisis_flag: false,
  },
];

// --------------------------------------------
// モックメッセージデータ（各セッション用）
// --------------------------------------------

const MOCK_MESSAGES: Record<string, Message[]> = {
  'session-001': [
    {
      message_id: 'message-001',
      session_id: 'session-001',
      role: 'user',
      content: '最近、仕事のプレッシャーがひどくて、朝起きるのがつらいです。',
      created_at: '2025-11-01T14:20:00Z',
      timestamp: '14:20',
      crisis_detected: false,
    },
    {
      message_id: 'message-002',
      session_id: 'session-001',
      role: 'assistant',
      content:
        'そうなんですね。プレッシャーを感じていらっしゃるんですね。具体的にどのような状況でプレッシャーを感じますか？',
      citations: [
        {
          source: 'コーチング基礎理論.pdf',
          content: '傾聴のスキルは、クライアントの真の課題を引き出すために重要です。',
          dataset_type: 'system',
          chunk_number: 45,
          similarity_score: 0.89,
        },
        {
          source: 'client1のタスク履歴',
          content: '先月のタスク管理状況を確認すると、複数のプロジェクトが同時進行していました。',
          dataset_type: 'user',
          chunk_number: 12,
          similarity_score: 0.82,
        },
      ],
      created_at: '2025-11-01T14:21:00Z',
      timestamp: '14:21',
      crisis_detected: false,
    },
    {
      message_id: 'message-003',
      session_id: 'session-001',
      role: 'user',
      content:
        '上司からの期待が大きすぎて、ミスが許されない気がします。最近は眠れない日もあります。',
      created_at: '2025-11-01T14:23:00Z',
      timestamp: '14:23',
      crisis_detected: true,
    },
    {
      message_id: 'message-004',
      session_id: 'session-001',
      role: 'assistant',
      content:
        '眠れない日があるとのこと、心配ですね。睡眠不足は心身に大きな影響を与えます。専門家への相談も検討されてはいかがでしょうか。まずは、プレッシャーを軽減する方法を一緒に考えましょう。',
      citations: [
        {
          source: '心理学的アプローチ.pdf',
          content: '睡眠障害はメンタルヘルスの重要な指標であり、適切な対応が必要です。',
          dataset_type: 'system',
          chunk_number: 78,
          similarity_score: 0.91,
        },
      ],
      created_at: '2025-11-01T14:24:00Z',
      timestamp: '14:24',
      crisis_detected: false,
    },
    {
      message_id: 'message-005',
      session_id: 'session-001',
      role: 'user',
      content: 'ありがとうございます。少し気持ちが楽になりました。',
      created_at: '2025-11-01T14:30:00Z',
      timestamp: '14:30',
      crisis_detected: false,
    },
  ],
  'session-002': [
    {
      message_id: 'message-006',
      session_id: 'session-002',
      role: 'user',
      content: '今週のタスクについて相談したいです。',
      created_at: '2025-11-01T10:00:00Z',
      timestamp: '10:00',
      crisis_detected: false,
    },
    {
      message_id: 'message-007',
      session_id: 'session-002',
      role: 'assistant',
      content:
        'タスクについて相談いただきありがとうございます。今週はどのようなタスクに取り組む予定ですか？',
      citations: [
        {
          source: 'タスク管理理論.pdf',
          content: '効果的なタスク管理は、優先順位の設定から始まります。',
          dataset_type: 'system',
          chunk_number: 23,
          similarity_score: 0.85,
        },
      ],
      created_at: '2025-11-01T10:01:00Z',
      timestamp: '10:01',
      crisis_detected: false,
    },
  ],
  'session-003': [
    {
      message_id: 'message-008',
      session_id: 'session-003',
      role: 'user',
      content: 'キャリアの方向性について考えています。',
      created_at: '2025-10-30T16:30:00Z',
      timestamp: '16:30',
      crisis_detected: false,
    },
    {
      message_id: 'message-009',
      session_id: 'session-003',
      role: 'assistant',
      content:
        'キャリアについて考える時間を持たれたのは素晴らしいことですね。具体的にどのような方向性をお考えですか？',
      citations: [
        {
          source: 'キャリア開発ガイド.pdf',
          content: 'キャリア開発において、長期的なビジョンを描くことは重要です。',
          dataset_type: 'system',
          chunk_number: 56,
          similarity_score: 0.88,
        },
      ],
      created_at: '2025-10-30T16:31:00Z',
      timestamp: '16:31',
      crisis_detected: false,
    },
  ],
  'session-004': [
    {
      message_id: 'message-010',
      session_id: 'session-004',
      role: 'user',
      content: '最近の進捗を振り返りたいです。',
      created_at: '2025-10-29T09:00:00Z',
      timestamp: '09:00',
      crisis_detected: false,
    },
    {
      message_id: 'message-011',
      session_id: 'session-004',
      role: 'assistant',
      content:
        '振り返りの時間を作られたのは素晴らしいですね。どの期間を振り返りたいですか？',
      citations: [
        {
          source: 'リフレクション技法.pdf',
          content: '定期的な振り返りは、継続的な成長のために重要です。',
          dataset_type: 'system',
          chunk_number: 34,
          similarity_score: 0.87,
        },
      ],
      created_at: '2025-10-29T09:01:00Z',
      timestamp: '09:01',
      crisis_detected: false,
    },
  ],
  'session-005': [
    {
      message_id: 'message-012',
      session_id: 'session-005',
      role: 'user',
      content: 'チームメンバーとの関係がうまくいかなくて、職場に行くのが憂鬱です。',
      created_at: '2025-10-28T12:30:00Z',
      timestamp: '12:30',
      crisis_detected: true,
    },
    {
      message_id: 'message-013',
      session_id: 'session-005',
      role: 'assistant',
      content:
        '職場での人間関係について悩まれているのですね。具体的にどのような状況でしょうか？',
      citations: [
        {
          source: 'コミュニケーション技法.pdf',
          content: '職場の人間関係は、業務のパフォーマンスに大きく影響します。',
          dataset_type: 'system',
          chunk_number: 67,
          similarity_score: 0.84,
        },
      ],
      created_at: '2025-10-28T12:31:00Z',
      timestamp: '12:31',
      crisis_detected: false,
    },
  ],
  'session-006': [
    {
      message_id: 'message-014',
      session_id: 'session-006',
      role: 'user',
      content: '今月の目標を達成できました。',
      created_at: '2025-10-25T11:00:00Z',
      timestamp: '11:00',
      crisis_detected: false,
    },
    {
      message_id: 'message-015',
      session_id: 'session-006',
      role: 'assistant',
      content: 'おめでとうございます！目標達成されたのは素晴らしいですね。どのような取り組みが効果的でしたか？',
      citations: [
        {
          source: '目標設定理論.pdf',
          content: '目標達成後の振り返りは、次の目標設定に役立ちます。',
          dataset_type: 'system',
          chunk_number: 45,
          similarity_score: 0.86,
        },
      ],
      created_at: '2025-10-25T11:01:00Z',
      timestamp: '11:01',
      crisis_detected: false,
    },
  ],
};

// --------------------------------------------
// モック管理会話履歴API
// --------------------------------------------

/**
 * モック全クライアントの会話一覧取得
 * @MOCK_TO_API: GET {API_PATHS.ADMIN.ALL_CONVERSATIONS}
 * @returns 全クライアントの会話一覧
 */
export const mockGetAllConversations = async (): Promise<Conversation[]> => {
  // API呼び出しシミュレーション（500ms遅延）
  await new Promise((resolve) => setTimeout(resolve, 500));

  return MOCK_ALL_CONVERSATIONS;
};

/**
 * モックセッション詳細（メッセージ一覧）取得
 * @MOCK_TO_API: GET {API_PATHS.ADMIN.CONVERSATION_DETAIL(sessionId)}/messages
 * @param sessionId セッションID
 * @returns メッセージ一覧
 */
export const mockGetConversationMessages = async (sessionId: string): Promise<Message[]> => {
  // API呼び出しシミュレーション（500ms遅延）
  await new Promise((resolve) => setTimeout(resolve, 500));

  return MOCK_MESSAGES[sessionId] || [];
};
