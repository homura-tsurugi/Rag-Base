// ============================================
// ConversationSummaryService - 会話要約生成サービス
// ============================================
// MVP段階: モック実装
// 本番: Claude API + バックエンドAPI連携

import type {
  Message,
  ConversationSummary,
  GenerateSummaryRequest,
  GenerateSummaryResponse,
} from '@/types';

// --------------------------------------------
// 会話要約生成（モック実装）
// --------------------------------------------

export const generateConversationSummary = async (
  request: GenerateSummaryRequest
): Promise<GenerateSummaryResponse> => {
  // TODO: 本番実装時はClaude API経由でバックエンドに要約生成リクエスト
  // POST /api/v1/conversations/{session_id}/summary

  // モック実装: メッセージから簡易的に要約を生成
  await new Promise((resolve) => setTimeout(resolve, 2000)); // 2秒待機（API呼び出しシミュレーション）

  const { session_id, user_id, messages } = request;

  // ユーザーメッセージから主なトピックを抽出（簡易実装）
  const userMessages = messages.filter((m) => m.role === 'user');
  const aiMessages = messages.filter((m) => m.role === 'assistant');

  // モックデータ生成
  const summary: ConversationSummary = {
    summary_id: `summary-${Date.now()}`,
    session_id,
    user_id,
    topics: extractTopics(userMessages),
    problems: extractProblems(userMessages),
    advice: extractAdvice(aiMessages),
    insights: extractInsights(userMessages, aiMessages),
    next_steps: extractNextSteps(aiMessages),
    mentor_notes: '', // 初期値は空
    crisis_flags: detectCrisisFlags(userMessages),
    created_at: new Date().toISOString(),
  };

  return {
    summary,
    success: true,
    message: '会話要約が正常に生成されました',
  };
};

// --------------------------------------------
// 要約取得（モック実装）
// --------------------------------------------

export const getConversationSummaries = async (
  _userId: string
): Promise<ConversationSummary[]> => {
  // TODO: 本番実装時はバックエンドAPI呼び出し
  // GET /api/v1/users/{user_id}/summaries

  await new Promise((resolve) => setTimeout(resolve, 500));

  // モックデータ（空配列）
  return [];
};

// --------------------------------------------
// 特定の会話要約を取得（モック実装）
// --------------------------------------------

export const getConversationSummary = async (
  _sessionId: string
): Promise<ConversationSummary | null> => {
  // TODO: 本番実装時はバックエンドAPI呼び出し
  // GET /api/v1/conversations/{session_id}/summary

  await new Promise((resolve) => setTimeout(resolve, 500));

  return null;
};

// --------------------------------------------
// ヘルパー関数（簡易的なキーワード抽出）
// --------------------------------------------

const extractTopics = (userMessages: Message[]): string[] => {
  // 簡易実装: メッセージ内容からトピックキーワードを抽出
  const topicKeywords = [
    '目標',
    'キャリア',
    '人間関係',
    '転職',
    'スキル',
    '学習',
    '計画',
    '問題',
    '課題',
  ];

  const topics = new Set<string>();
  userMessages.forEach((msg) => {
    topicKeywords.forEach((keyword) => {
      if (msg.content.includes(keyword)) {
        topics.add(keyword);
      }
    });
  });

  return Array.from(topics).slice(0, 5); // 最大5件
};

const extractProblems = (userMessages: Message[]): string[] => {
  // 簡易実装: 問題・課題に関連するメッセージを抽出
  const problemKeywords = ['困っ', '悩み', '問題', '課題', 'うまくいかない', '不安'];

  const problems: string[] = [];
  userMessages.forEach((msg) => {
    if (problemKeywords.some((kw) => msg.content.includes(kw))) {
      problems.push(msg.content.substring(0, 100)); // 最初の100文字
    }
  });

  return problems.slice(0, 3); // 最大3件
};

const extractAdvice = (aiMessages: Message[]): string[] => {
  // 簡易実装: AIアドバイスから主要なポイントを抽出
  const adviceKeywords = ['おすすめ', '試し', '方法', 'ステップ', '重要', 'ポイント'];

  const advice: string[] = [];
  aiMessages.forEach((msg) => {
    if (adviceKeywords.some((kw) => msg.content.includes(kw))) {
      advice.push(msg.content.substring(0, 150)); // 最初の150文字
    }
  });

  return advice.slice(0, 3); // 最大3件
};

const extractInsights = (userMessages: Message[], _aiMessages: Message[]): string[] => {
  // 簡易実装: クライアントの気づきを抽出
  const insightKeywords = ['わかりました', '理解', '納得', '気づき', 'なるほど', 'そうか'];

  const insights: string[] = [];
  userMessages.forEach((msg) => {
    if (insightKeywords.some((kw) => msg.content.includes(kw))) {
      insights.push(msg.content.substring(0, 100));
    }
  });

  return insights.slice(0, 3); // 最大3件
};

const extractNextSteps = (aiMessages: Message[]): string[] => {
  // 簡易実装: 次のステップを抽出
  const nextStepKeywords = ['次', 'これから', '明日', '今週', '取り組', '始め'];

  const nextSteps: string[] = [];
  aiMessages.forEach((msg) => {
    if (nextStepKeywords.some((kw) => msg.content.includes(kw))) {
      nextSteps.push(msg.content.substring(0, 100));
    }
  });

  return nextSteps.slice(0, 3); // 最大3件
};

const detectCrisisFlags = (userMessages: Message[]): string[] => {
  // 簡易実装: 危機キーワード検出
  const crisisKeywords = [
    '死にたい',
    '消えたい',
    '辛すぎる',
    '限界',
    '助けて',
    'もうダメ',
    '自殺',
  ];

  const detectedFlags: string[] = [];
  userMessages.forEach((msg) => {
    crisisKeywords.forEach((kw) => {
      if (msg.content.includes(kw)) {
        detectedFlags.push(`危機キーワード検出: "${kw}"`);
      }
    });
  });

  return detectedFlags;
};
