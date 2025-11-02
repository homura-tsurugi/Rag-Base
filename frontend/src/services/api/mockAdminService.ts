// ============================================
// モック管理サービス
// ============================================
// MVP段階での開発・テスト用モック管理API
// 本番環境では adminService.ts に切り替え

import type { SystemStats } from '@/types';

// --------------------------------------------
// モックシステム統計データ
// --------------------------------------------

const MOCK_SYSTEM_STATS: SystemStats = {
  total_users: 28,
  total_conversations: 156,
  total_messages: 1247,
  api_usage: {
    claude_tokens: 45230,
    openai_tokens: 12890,
  },
  uptime: 2592000, // 30日分の秒数
};

// --------------------------------------------
// モック管理API
// --------------------------------------------

/**
 * モックシステム統計取得
 * @returns システム統計情報
 */
export const mockGetSystemStats = async (): Promise<SystemStats> => {
  // @MOCK_TO_API: GET {API_PATHS.ADMIN.SYSTEM_STATS}
  // Response: SystemStats

  // API呼び出しシミュレーション（500ms遅延）
  await new Promise((resolve) => setTimeout(resolve, 500));

  return MOCK_SYSTEM_STATS;
};
