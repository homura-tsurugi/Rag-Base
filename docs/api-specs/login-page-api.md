# LoginPage API仕様書

**生成日**: 2025-11-02
**対象ページ**: D-001 ログイン
**収集元**: `frontend/src/services/api/mockAuthService.ts`
**@MOCK_TO_APIマーク数**: 4
**@BACKEND_COMPLEXマーク数**: 0

---

## エンドポイント一覧

### 1. ログイン

#### エンドポイント
- **HTTPメソッド**: `POST`
- **パス**: `/v1/auth/login`
- **APIパス定数**: `API_PATHS.AUTH.LOGIN`

#### Request
```typescript
{
  email: string;      // メールアドレス
  password: string;   // パスワード
}
```

**型定義**: `LoginRequest`

#### Response（成功時）
```typescript
{
  token: string;        // 認証トークン（JWT）
  user: {               // ユーザー情報
    user_id: string;    // ユーザーID（UUID）
    email: string;      // メールアドレス
    role: 'client' | 'coach';  // ユーザーロール
    name?: string;      // 表示名（オプション）
    avatar?: string;    // アバターURL（オプション）
    created_at: string; // 作成日時（ISO 8601）
    last_login_at?: string;  // 最終ログイン日時（オプション）
  };
  expires_at: string;   // トークン有効期限（ISO 8601）
}
```

**型定義**: `AuthResponse`

#### Response（エラー時）
```typescript
{
  error: string;    // エラーコード
  message: string;  // エラーメッセージ
  status: number;   // HTTPステータスコード
}
```

**型定義**: `ApiError`

#### 説明
ユーザー認証を実行し、認証トークンとユーザー情報を返却します。

#### テスト認証情報
```typescript
// コーチアカウント
{
  email: "coach@rag-base.local",
  password: "TestCoach2025!"
}

// クライアントアカウント1
{
  email: "client1@rag-base.local",
  password: "TestClient2025!"
}

// クライアントアカウント2
{
  email: "client2@rag-base.local",
  password: "TestClient2025!"
}
```

#### エラーケース
- **401 Unauthorized**: メールアドレスまたはパスワードが不正
- **400 Bad Request**: リクエストボディが不正
- **500 Internal Server Error**: サーバーエラー

---

### 2. ログアウト

#### エンドポイント
- **HTTPメソッド**: `POST`
- **パス**: `/v1/auth/logout`
- **APIパス定数**: `API_PATHS.AUTH.LOGOUT`

#### Request
なし（Authorizationヘッダーにトークンを含める）

```typescript
Headers: {
  Authorization: "Bearer {token}"
}
```

#### Response（成功時）
```typescript
void  // レスポンスボディなし
```

**HTTPステータス**: 200 OK

#### Response（エラー時）
```typescript
{
  error: string;
  message: string;
  status: number;
}
```

**型定義**: `ApiError`

#### 説明
ユーザーをログアウトし、サーバー側でトークンを無効化します。

#### エラーケース
- **401 Unauthorized**: トークンが無効または期限切れ
- **500 Internal Server Error**: サーバーエラー

---

### 3. トークン検証

#### エンドポイント
- **HTTPメソッド**: `POST`
- **パス**: `/v1/auth/verify`
- **APIパス定数**: `API_PATHS.AUTH.VERIFY_TOKEN`

#### Request
```typescript
{
  token: string;  // 検証するトークン
}
```

#### Response（成功時）
```typescript
{
  user_id: string;      // ユーザーID（UUID）
  email: string;        // メールアドレス
  role: 'client' | 'coach';  // ユーザーロール
  name?: string;        // 表示名（オプション）
  avatar?: string;      // アバターURL（オプション）
  created_at: string;   // 作成日時（ISO 8601）
  last_login_at?: string;  // 最終ログイン日時（オプション）
}
```

**型定義**: `User`

#### Response（エラー時）
```typescript
{
  error: string;
  message: string;
  status: number;
}
```

**型定義**: `ApiError`

#### 説明
提供されたトークンの有効性を検証し、ユーザー情報を返却します。

#### エラーケース
- **401 Unauthorized**: トークンが無効または期限切れ
- **400 Bad Request**: トークンが提供されていない
- **500 Internal Server Error**: サーバーエラー

---

### 4. トークンリフレッシュ

#### エンドポイント
- **HTTPメソッド**: `POST`
- **パス**: `/v1/auth/refresh`
- **APIパス定数**: `API_PATHS.AUTH.REFRESH_TOKEN`

#### Request
```typescript
{
  token: string;  // 現在のトークン
}
```

#### Response（成功時）
```typescript
{
  token: string;        // 新しい認証トークン（JWT）
  user: {
    user_id: string;
    email: string;
    role: 'client' | 'coach';
    name?: string;
    avatar?: string;
    created_at: string;
    last_login_at?: string;
  };
  expires_at: string;   // 新しいトークンの有効期限（ISO 8601）
}
```

**型定義**: `AuthResponse`

#### Response（エラー時）
```typescript
{
  error: string;
  message: string;
  status: number;
}
```

**型定義**: `ApiError`

#### 説明
期限切れ間近のトークンを新しいトークンにリフレッシュします。

#### エラーケース
- **401 Unauthorized**: トークンが無効または期限切れ
- **400 Bad Request**: トークンが提供されていない
- **500 Internal Server Error**: サーバーエラー

---

## 認証フロー

### 通常ログインフロー
```
1. ユーザーがメール・パスワードを入力
   ↓
2. POST /v1/auth/login
   ↓
3. サーバーが認証検証
   ↓
4. 成功: AuthResponse返却（token, user, expires_at）
   失敗: ApiError返却（401 Unauthorized）
   ↓
5. フロントエンドがトークンをlocalStorageに保存
   ↓
6. /chatページへリダイレクト
```

### トークン検証フロー
```
1. ページロード時またはAPI呼び出し前
   ↓
2. localStorageからトークンを取得
   ↓
3. POST /v1/auth/verify
   ↓
4. 成功: User情報返却
   失敗: /loginページへリダイレクト
```

### トークンリフレッシュフロー
```
1. トークンの有効期限をチェック
   ↓
2. 期限切れ間近（例: 残り5分以内）の場合
   ↓
3. POST /v1/auth/refresh
   ↓
4. 成功: 新しいAuthResponse返却
   失敗: /loginページへリダイレクト
   ↓
5. 新しいトークンをlocalStorageに保存
```

---

## セキュリティ要件

### トークン管理
- **保存場所**: `localStorage`（キー: `auth_token`）
- **形式**: JWT（JSON Web Token）
- **有効期限**: デフォルト24時間
- **リフレッシュタイミング**: 有効期限の5分前

### パスワード要件
- **最小文字数**: 8文字以上
- **推奨**: 英数字混在
- **ハッシュ化**: サーバー側でbcryptまたはArgon2を使用

### HTTPSヘッダー
```typescript
Headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {token}',  // ログイン後のリクエスト
  'X-CSRF-Token': '{csrf_token}'      // CSRF対策（本番環境）
}
```

---

## モックサービス仕様

### モック遅延
```typescript
// 実際のAPI呼び出しをシミュレート
await new Promise(resolve => setTimeout(resolve, 500));
```

すべてのモック関数は500ms遅延してレスポンスを返します。

### モックユーザーデータ
モックサービスは以下の3つのユーザーをサポート：

1. **コーチアカウント**
   - user_id: `coach-001`
   - email: `coach@rag-base.local`
   - role: `coach`
   - name: `コーチ太郎`

2. **クライアントアカウント1**
   - user_id: `client-001`
   - email: `client1@rag-base.local`
   - role: `client`
   - name: `クライアント一郎`

3. **クライアントアカウント2**
   - user_id: `client-002`
   - email: `client2@rag-base.local`
   - role: `client`
   - name: `クライアント次郎`

### トークン生成
```typescript
// モックトークン生成
const token = `mock-jwt-token-${Date.now()}-${Math.random().toString(36).substring(7)}`;
```

モックトークンは `mock-jwt-token-{timestamp}-{random}` 形式で生成されます。

---

## 型定義参照

すべての型定義は `frontend/src/types/index.ts` で管理されています。

### 主要型定義

#### User
```typescript
export interface User {
  user_id: string;
  email: string;
  role: UserRole;
  name?: string;
  avatar?: string;
  created_at: string;
  last_login_at?: string;
}
```

#### LoginRequest
```typescript
export interface LoginRequest {
  email: string;
  password: string;
}
```

#### AuthResponse
```typescript
export interface AuthResponse {
  token: string;
  user: User;
  expires_at: string;
}
```

#### ApiError
```typescript
export interface ApiError {
  error: string;
  message: string;
  status: number;
}
```

#### UserRole
```typescript
export type UserRole = 'client' | 'coach';
```

---

## モックから実APIへの切り替え手順

### 1. API実装完了後
```typescript
// frontend/src/services/api/authService.ts を作成
export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}${API_PATHS.AUTH.LOGIN}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.message);
  }

  return response.json();
};
```

### 2. サービスインポートの切り替え
```typescript
// Before (モック使用)
import { mockLogin as login } from '@/services/api/mockAuthService';

// After (実API使用)
import { login } from '@/services/api/authService';
```

### 3. 環境変数による切り替え（推奨）
```typescript
// frontend/src/services/api/index.ts
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const authService = USE_MOCK
  ? await import('./mockAuthService')
  : await import('./authService');
```

---

## バックエンド実装ガイド

### Dify API統合

LoginPageで使用する認証APIは、Dify標準認証を利用します：

#### Dify認証エンドポイント
```
POST https://api.dify.ai/v1/auth/login
```

#### Dify認証レスポンス
```json
{
  "access_token": "string",
  "token_type": "bearer",
  "expires_in": 86400,
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "string"
  }
}
```

#### Difyレスポンスの変換
```typescript
// Difyレスポンスを AuthResponse に変換
const authResponse: AuthResponse = {
  token: difyResponse.access_token,
  user: {
    user_id: difyResponse.user.id,
    email: difyResponse.user.email,
    role: difyResponse.user.role as UserRole,
    name: difyResponse.user.name,
    created_at: new Date().toISOString(),
  },
  expires_at: new Date(Date.now() + difyResponse.expires_in * 1000).toISOString(),
};
```

---

## テスト実装ガイド

### E2Eテスト
E2Eテスト仕様書を参照:
- **ファイル**: `docs/e2e-specs/login-page-e2e.md`
- **テストケース数**: 43件

### ユニットテスト（モックサービス）

#### mockLogin関数のテスト
```typescript
describe('mockLogin', () => {
  it('正しい認証情報でログイン成功', async () => {
    const result = await mockLogin({
      email: 'coach@rag-base.local',
      password: 'TestCoach2025!',
    });

    expect(result.user.email).toBe('coach@rag-base.local');
    expect(result.user.role).toBe('coach');
    expect(result.token).toMatch(/^mock-jwt-token-/);
  });

  it('不正な認証情報でログイン失敗', async () => {
    await expect(
      mockLogin({
        email: 'invalid@example.com',
        password: 'wrong',
      })
    ).rejects.toThrow('Invalid email or password');
  });
});
```

---

## 関連ドキュメント

- **要件定義書**: `docs/requirements.md`（D-001セクション）
- **型定義**: `frontend/src/types/index.ts`
- **モックサービス**: `frontend/src/services/api/mockAuthService.ts`
- **React実装**: `frontend/src/pages/public/LoginPage.tsx`
- **E2Eテスト仕様書**: `docs/e2e-specs/login-page-e2e.md`

---

**最終更新日**: 2025-11-02
**作成者**: BlueLamp レコンX + Claude Code
