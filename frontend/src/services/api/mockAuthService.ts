// ============================================
// モック認証サービス
// ============================================
// MVP段階での開発・テスト用モック認証
// 本番環境では authService.ts に切り替え

import type { User, AuthResponse, LoginRequest } from '@/types';

// --------------------------------------------
// モックユーザーデータ
// --------------------------------------------
// CLAUDE.mdのテスト認証情報に基づく

const MOCK_USERS: Array<User & { password: string }> = [
  {
    user_id: 'coach-001',
    email: 'coach@rag-base.local',
    password: 'TestCoach2025!',
    role: 'coach',
    name: 'コーチ太郎',
    avatar: 'https://i.pravatar.cc/150?img=33',
    created_at: '2025-01-01T00:00:00Z',
    last_login_at: new Date().toISOString(),
  },
  {
    user_id: 'client-001',
    email: 'client1@rag-base.local',
    password: 'TestClient2025!',
    role: 'client',
    name: 'クライアント花子',
    avatar: 'https://i.pravatar.cc/150?img=45',
    created_at: '2025-01-01T00:00:00Z',
    last_login_at: new Date().toISOString(),
  },
  {
    user_id: 'client-002',
    email: 'client2@rag-base.local',
    password: 'TestClient2025!',
    role: 'client',
    name: 'クライアント次郎',
    avatar: 'https://i.pravatar.cc/150?img=12',
    created_at: '2025-01-01T00:00:00Z',
    last_login_at: new Date().toISOString(),
  },
];

// --------------------------------------------
// モック認証API
// --------------------------------------------

/**
 * モックログイン
 * @param credentials ログイン情報
 * @returns 認証レスポンス
 */
export const mockLogin = async (
  credentials: LoginRequest
): Promise<AuthResponse> => {
  // @MOCK_TO_API: POST {API_PATHS.AUTH.LOGIN}
  // Request: LoginRequest
  // Response: AuthResponse

  // 実際のAPI呼び出しをシミュレート（500ms遅延）
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = MOCK_USERS.find(
    (u) => u.email === credentials.email && u.password === credentials.password
  );

  if (!user) {
    throw new Error('メールアドレスまたはパスワードが正しくありません');
  }

  // パスワードを除外したユーザー情報
  const { password: _, ...userWithoutPassword } = user;

  // モックトークン生成（実際はJWT）
  const token = `mock_token_${user.user_id}_${Date.now()}`;

  // 有効期限: 24時間後
  const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  return {
    token,
    user: {
      ...userWithoutPassword,
      last_login_at: new Date().toISOString(),
    },
    expires_at,
  };
};

/**
 * モックログアウト
 */
export const mockLogout = async (): Promise<void> => {
  // @MOCK_TO_API: POST {API_PATHS.AUTH.LOGOUT}
  // Response: void

  await new Promise((resolve) => setTimeout(resolve, 200));
  // ローカルストレージのトークンを削除（後で実装）
};

/**
 * モックトークン検証
 * @param token 認証トークン
 * @returns ユーザー情報
 */
export const mockVerifyToken = async (token: string): Promise<User> => {
  // @MOCK_TO_API: POST {API_PATHS.AUTH.VERIFY_TOKEN}
  // Request: { token: string }
  // Response: User

  await new Promise((resolve) => setTimeout(resolve, 200));

  // トークンからユーザーIDを抽出（モック実装）
  const userId = token.split('_')[2];

  const user = MOCK_USERS.find((u) => u.user_id === userId);

  if (!user) {
    throw new Error('無効なトークンです');
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * モックトークンリフレッシュ
 * @param token 既存トークン
 * @returns 新しい認証レスポンス
 */
export const mockRefreshToken = async (
  token: string
): Promise<AuthResponse> => {
  // @MOCK_TO_API: POST {API_PATHS.AUTH.REFRESH_TOKEN}
  // Request: { token: string }
  // Response: AuthResponse

  await new Promise((resolve) => setTimeout(resolve, 300));

  const user = await mockVerifyToken(token);

  const newToken = `mock_token_${user.user_id}_${Date.now()}`;
  const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  return {
    token: newToken,
    user,
    expires_at,
  };
};

// --------------------------------------------
// デモ用：全ユーザー情報取得
// --------------------------------------------

export const getMockUsers = (): Array<Pick<User, 'email' | 'role' | 'name'>> => {
  return MOCK_USERS.map((u) => ({
    email: u.email,
    role: u.role,
    name: u.name || '',
  }));
};
