// ============================================
// トークン管理サービス
// ============================================
// 認証トークンのlocalStorage管理

const TOKEN_KEY = 'rag_base_auth_token';
const EXPIRES_KEY = 'rag_base_token_expires';

// --------------------------------------------
// トークン操作
// --------------------------------------------

/**
 * トークンを保存
 * @param token 認証トークン
 * @param expiresAt 有効期限（ISO 8601）
 */
export const saveToken = (token: string, expiresAt: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EXPIRES_KEY, expiresAt);
};

/**
 * トークンを取得
 * @returns 認証トークン（存在しない場合はnull）
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * トークンを削除
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRES_KEY);
};

/**
 * トークンの有効期限を取得
 * @returns 有効期限（ISO 8601）または null
 */
export const getTokenExpires = (): string | null => {
  return localStorage.getItem(EXPIRES_KEY);
};

/**
 * トークンが有効期限切れかチェック
 * @returns 有効期限切れの場合 true
 */
export const isTokenExpired = (): boolean => {
  const expiresAt = getTokenExpires();
  if (!expiresAt) return true;

  const expiresDate = new Date(expiresAt);
  const now = new Date();

  return now >= expiresDate;
};

/**
 * トークンが存在し、有効かチェック
 * @returns 有効なトークンが存在する場合 true
 */
export const isTokenValid = (): boolean => {
  const token = getToken();
  if (!token) return false;

  return !isTokenExpired();
};

/**
 * トークンの残り有効期限（秒）を取得
 * @returns 残り秒数（期限切れの場合は0）
 */
export const getTokenRemainingTime = (): number => {
  const expiresAt = getTokenExpires();
  if (!expiresAt) return 0;

  const expiresDate = new Date(expiresAt);
  const now = new Date();

  const remainingMs = expiresDate.getTime() - now.getTime();
  return Math.max(0, Math.floor(remainingMs / 1000));
};
