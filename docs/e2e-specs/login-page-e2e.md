# LoginPage E2Eテスト仕様書

## 1. テスト概要

### 1.1 対象機能
- ページ: D-001 ログイン
- 実装ファイル: `/frontend/src/pages/public/LoginPage.tsx`
- モックサービス: `/frontend/src/services/api/mockAuthService.ts`
- モックアップ: `/mockups/LoginPage.html`

### 1.2 テスト目的
LoginPageの正常系・異常系・セキュリティ・レスポンシブ対応を網羅的に検証し、以下を保証する:
- 正しい認証情報でログイン成功し、/chatへリダイレクトされること
- 不正な認証情報でログイン失敗し、適切なエラーメッセージが表示されること
- ローディング状態が正しく表示されること
- セキュリティ要件（パスワードマスク、入力無害化等）が満たされていること
- スマホ・PC両方で正しくレイアウトが表示されること

### 1.3 テスト環境
- ブラウザ: Chrome最新版、Safari最新版、Firefox最新版
- デバイス: PC（1920x1080）、iPhone 12（390x844）、Android Pixel 5（393x851）
- テストフレームワーク: Playwright
- 認証方式: モック認証（mockAuthService.ts）

### 1.4 テスト認証情報
```yaml
コーチアカウント:
  email: coach@rag-base.local
  password: TestCoach2025!
  user_id: coach-001
  role: coach
  name: コーチ太郎

クライアントアカウント1:
  email: client1@rag-base.local
  password: TestClient2025!
  user_id: client-001
  role: client
  name: クライアント花子

クライアントアカウント2:
  email: client2@rag-base.local
  password: TestClient2025!
  user_id: client-002
  role: client
  name: クライアント次郎
```

---

## 2. 正常系テスト

### 2.1 ページ初期表示

#### Test-001: ページ初期表示の確認
**優先度**: High
**カテゴリ**: 正常系 - UI表示

**前提条件**:
- ユーザーは未ログイン状態

**テストステップ**:
1. ブラウザで `/login` にアクセス

**期待結果**:
- ページタイトルが「ログイン - COM:PASS」と表示される
- ロゴ（HubIcon + 「COM:PASS」テキスト）が中央上部に表示される
- サブタイトル「RAGベースAIコーチング」が表示される
- フォームタイトル「ログイン」が表示される
- メールアドレス入力フィールドが表示される
  - ラベル: 「メールアドレス」
  - プレースホルダー: "example@email.com"
  - 入力タイプ: email
  - required属性: true
- パスワード入力フィールドが表示される
  - ラベル: 「パスワード」
  - プレースホルダー: "8文字以上"
  - 入力タイプ: password
  - required属性: true
- ログインボタンが表示される
  - テキスト: 「ログイン」
  - タイプ: submit
  - disabled属性: false
- デモアカウント情報ボックスが表示される
  - coach@rag-base.local (コーチ)
  - client1@rag-base.local (クライアント)
  - client2@rag-base.local (クライアント)
  - パスワード説明が表示される
- エラーメッセージは表示されない

**実装確認箇所**:
```typescript
// LoginPage.tsx Line 48-171
<PublicLayout showHeader={false}>
  {/* ロゴ */}
  <HubIcon sx={{ fontSize: 32, color: 'primary.main' }} />
  <Typography variant="h4">COM:PASS</Typography>
  <Typography variant="body2">RAGベースAIコーチング</Typography>

  {/* フォームタイトル */}
  <Typography variant="h5">ログイン</Typography>

  {/* メールアドレス */}
  <TextField type="email" required placeholder="example@email.com" />

  {/* パスワード */}
  <TextField type="password" required placeholder="8文字以上" />

  {/* ログインボタン */}
  <Button type="submit">ログイン</Button>

  {/* デモアカウント情報 */}
  {demoUsers.map(...)}
</PublicLayout>
```

---

### 2.2 ログイン成功（コーチアカウント）

#### Test-002: コーチアカウントでのログイン成功
**優先度**: High
**カテゴリ**: 正常系 - 認証成功

**前提条件**:
- ユーザーは未ログイン状態
- `/login` ページが表示されている

**テストステップ**:
1. メールアドレス入力フィールドに `coach@rag-base.local` を入力
2. パスワード入力フィールドに `TestCoach2025!` を入力
3. ログインボタンをクリック

**期待結果**:
- ログインボタンのテキストがCircularProgressスピナーに変わる
- 両方の入力フィールドがdisabled状態になる
- 500ms後にログイン処理が完了する
- `/chat` ページにリダイレクトされる
- エラーメッセージは表示されない
- AuthContextのuserステートが以下の値で更新される:
  ```typescript
  {
    user_id: 'coach-001',
    email: 'coach@rag-base.local',
    role: 'coach',
    name: 'コーチ太郎',
    avatar: 'https://i.pravatar.cc/150?img=33',
    created_at: '2025-01-01T00:00:00Z',
    last_login_at: (現在時刻のISO文字列)
  }
  ```
- LocalStorageに認証トークンが保存される
  - キー: `auth_token`
  - 値: `mock_token_coach-001_(タイムスタンプ)`

**実装確認箇所**:
```typescript
// LoginPage.tsx Line 30-43
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    await login({ email, password }); // AuthContext経由でmockLogin呼び出し
    navigate('/chat'); // リダイレクト
  } catch (err) {
    setError(err instanceof Error ? err.message : 'ログインに失敗しました');
  } finally {
    setLoading(false);
  }
};

// mockAuthService.ts Line 56-91
export const mockLogin = async (credentials: LoginRequest): Promise<AuthResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms遅延

  const user = MOCK_USERS.find(
    (u) => u.email === credentials.email && u.password === credentials.password
  );

  if (!user) {
    throw new Error('メールアドレスまたはパスワードが正しくありません');
  }

  const { password: _, ...userWithoutPassword } = user;
  const token = `mock_token_${user.user_id}_${Date.now()}`;
  const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  return { token, user: {...userWithoutPassword, last_login_at: new Date().toISOString()}, expires_at };
};
```

---

### 2.3 ログイン成功（クライアントアカウント）

#### Test-003: クライアント1アカウントでのログイン成功
**優先度**: High
**カテゴリ**: 正常系 - 認証成功

**前提条件**:
- ユーザーは未ログイン状態
- `/login` ページが表示されている

**テストステップ**:
1. メールアドレス入力フィールドに `client1@rag-base.local` を入力
2. パスワード入力フィールドに `TestClient2025!` を入力
3. ログインボタンをクリック

**期待結果**:
- Test-002と同様のUI挙動
- `/chat` ページにリダイレクトされる
- AuthContextのuserステートが以下の値で更新される:
  ```typescript
  {
    user_id: 'client-001',
    email: 'client1@rag-base.local',
    role: 'client',
    name: 'クライアント花子',
    avatar: 'https://i.pravatar.cc/150?img=45',
    created_at: '2025-01-01T00:00:00Z',
    last_login_at: (現在時刻のISO文字列)
  }
  ```

**実装確認箇所**:
```typescript
// mockAuthService.ts Line 25-34
{
  user_id: 'client-001',
  email: 'client1@rag-base.local',
  password: 'TestClient2025!',
  role: 'client',
  name: 'クライアント花子',
  avatar: 'https://i.pravatar.cc/150?img=45',
  created_at: '2025-01-01T00:00:00Z',
  last_login_at: new Date().toISOString(),
}
```

---

#### Test-004: クライアント2アカウントでのログイン成功
**優先度**: High
**カテゴリ**: 正常系 - 認証成功

**前提条件**:
- ユーザーは未ログイン状態
- `/login` ページが表示されている

**テストステップ**:
1. メールアドレス入力フィールドに `client2@rag-base.local` を入力
2. パスワード入力フィールドに `TestClient2025!` を入力
3. ログインボタンをクリック

**期待結果**:
- Test-002と同様のUI挙動
- `/chat` ページにリダイレクトされる
- AuthContextのuserステートが以下の値で更新される:
  ```typescript
  {
    user_id: 'client-002',
    email: 'client2@rag-base.local',
    role: 'client',
    name: 'クライアント次郎',
    avatar: 'https://i.pravatar.cc/150?img=12',
    created_at: '2025-01-01T00:00:00Z',
    last_login_at: (現在時刻のISO文字列)
  }
  ```

**実装確認箇所**:
```typescript
// mockAuthService.ts Line 35-44
{
  user_id: 'client-002',
  email: 'client2@rag-base.local',
  password: 'TestClient2025!',
  role: 'client',
  name: 'クライアント次郎',
  avatar: 'https://i.pravatar.cc/150?img=12',
  created_at: '2025-01-01T00:00:00Z',
  last_login_at: new Date().toISOString(),
}
```

---

### 2.4 UI挙動（ローディング状態）

#### Test-005: ローディング状態の表示
**優先度**: Medium
**カテゴリ**: 正常系 - UI挙動

**前提条件**:
- ユーザーは未ログイン状態
- `/login` ページが表示されている

**テストステップ**:
1. メールアドレス入力フィールドに `coach@rag-base.local` を入力
2. パスワード入力フィールドに `TestCoach2025!` を入力
3. ログインボタンをクリック
4. **500ms経過前**のUI状態を確認

**期待結果**:
- ログインボタンが以下の状態になる:
  - disabled属性: true
  - テキスト非表示
  - CircularProgressスピナーが表示される（size=24、color="inherit"）
- メールアドレス入力フィールドがdisabled状態になる
- パスワード入力フィールドがdisabled状態になる
- エラーメッセージは表示されない

**実装確認箇所**:
```typescript
// LoginPage.tsx Line 135-153
<Button
  type="submit"
  variant="contained"
  fullWidth
  size="large"
  disabled={loading} // ローディング中はdisabled
  sx={{ ... }}
>
  {loading ? <CircularProgress size={24} color="inherit" /> : 'ログイン'}
</Button>

// Line 93-108 (メールアドレス)
<TextField
  type="email"
  fullWidth
  required
  placeholder="example@email.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  disabled={loading} // ローディング中はdisabled
  sx={{ ... }}
/>

// Line 116-131 (パスワード)
<TextField
  type="password"
  fullWidth
  required
  placeholder="8文字以上"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  disabled={loading} // ローディング中はdisabled
  sx={{ ... }}
/>
```

---

## 3. 異常系テスト

### 3.1 認証失敗（メールアドレス不正）

#### Test-006: 存在しないメールアドレスでのログイン失敗
**優先度**: High
**カテゴリ**: 異常系 - 認証失敗

**前提条件**:
- ユーザーは未ログイン状態
- `/login` ページが表示されている

**テストステップ**:
1. メールアドレス入力フィールドに `invalid@example.com` を入力
2. パスワード入力フィールドに `TestCoach2025!` を入力
3. ログインボタンをクリック

**期待結果**:
- ログインボタンが一時的にローディング状態になる（500ms）
- 500ms後、ローディング状態が解除される
- エラーメッセージが表示される:
  - テキスト: 「メールアドレスまたはパスワードが正しくありません」
  - severity: error
  - アイコン: ErrorIcon
  - 背景色: error系の色
- `/chat` へのリダイレクトは発生しない
- 入力フィールドは再度入力可能状態（disabled=false）
- 入力値はクリアされない（`invalid@example.com` と `TestCoach2025!` がそのまま残る）

**実装確認箇所**:
```typescript
// LoginPage.tsx Line 30-43
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setError(''); // エラーをクリア
  setLoading(true);

  try {
    await login({ email, password });
    navigate('/chat');
  } catch (err) {
    setError(err instanceof Error ? err.message : 'ログインに失敗しました');
    // エラー発生時、setErrorが実行される
  } finally {
    setLoading(false); // ローディング解除
  }
};

// Line 78-86 (エラーメッセージ表示)
{error && (
  <Alert
    severity="error"
    icon={<ErrorIcon />}
    sx={{ mb: 3 }}
  >
    {error}
  </Alert>
)}

// mockAuthService.ts Line 70-72
if (!user) {
  throw new Error('メールアドレスまたはパスワードが正しくありません');
}
```

---

### 3.2 認証失敗（パスワード不正）

#### Test-007: 正しいメールアドレス、間違ったパスワードでのログイン失敗
**優先度**: High
**カテゴリ**: 異常系 - 認証失敗

**前提条件**:
- ユーザーは未ログイン状態
- `/login` ページが表示されている

**テストステップ**:
1. メールアドレス入力フィールドに `coach@rag-base.local` を入力
2. パスワード入力フィールドに `WrongPassword123!` を入力
3. ログインボタンをクリック

**期待結果**:
- Test-006と同様のエラー挙動
- エラーメッセージ: 「メールアドレスまたはパスワードが正しくありません」

**実装確認箇所**:
```typescript
// mockAuthService.ts Line 66-72
const user = MOCK_USERS.find(
  (u) => u.email === credentials.email && u.password === credentials.password
  // ANDで両方一致する必要がある
);

if (!user) {
  throw new Error('メールアドレスまたはパスワードが正しくありません');
}
```

---

### 3.3 入力バリデーション

#### Test-008: 空のメールアドレスでのログイン試行
**優先度**: Medium
**カテゴリ**: 異常系 - バリデーション

**前提条件**:
- ユーザーは未ログイン状態
- `/login` ページが表示されている

**テストステップ**:
1. メールアドレス入力フィールドを空のまま
2. パスワード入力フィールドに `TestCoach2025!` を入力
3. ログインボタンをクリック

**期待結果**:
- HTML5のネイティブバリデーションが発動（required属性による）
- ブラウザのデフォルトエラーメッセージが表示される（例: "このフィールドを入力してください"）
- フォーム送信がブロックされる
- handleSubmitは実行されない

**実装確認箇所**:
```typescript
// LoginPage.tsx Line 50, 93
<Box component="form" onSubmit={handleSubmit} noValidate>
  <TextField
    type="email"
    fullWidth
    required // HTML5 required属性
    placeholder="example@email.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    disabled={loading}
  />
</Box>
```

**注意事項**:
- `noValidate` 属性があるが、これはブラウザのデフォルトバリデーションUI表示を抑制するもので、required属性自体は有効
- Playwrightでは `page.fill()` ではなく `page.click()` でフォーム送信を試行する必要がある

---

#### Test-009: 空のパスワードでのログイン試行
**優先度**: Medium
**カテゴリ**: 異常系 - バリデーション

**前提条件**:
- ユーザーは未ログイン状態
- `/login` ページが表示されている

**テストステップ**:
1. メールアドレス入力フィールドに `coach@rag-base.local` を入力
2. パスワード入力フィールドを空のまま
3. ログインボタンをクリック

**期待結果**:
- Test-008と同様のHTML5バリデーション挙動
- ブラウザのデフォルトエラーメッセージが表示される
- フォーム送信がブロックされる

**実装確認箇所**:
```typescript
// LoginPage.tsx Line 116
<TextField
  type="password"
  fullWidth
  required // HTML5 required属性
  placeholder="8文字以上"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  disabled={loading}
/>
```

---

#### Test-010: メールアドレス・パスワード両方空でのログイン試行
**優先度**: Medium
**カテゴリ**: 異常系 - バリデーション

**前提条件**:
- ユーザーは未ログイン状態
- `/login` ページが表示されている

**テストステップ**:
1. メールアドレス入力フィールドを空のまま
2. パスワード入力フィールドを空のまま
3. ログインボタンをクリック

**期待結果**:
- メールアドレスフィールドに対するHTML5バリデーションが先に発動
- ブラウザのデフォルトエラーメッセージが表示される
- フォーム送信がブロックされる

---

### 3.4 エラーリカバリ

#### Test-011: エラー後の再ログイン試行
**優先度**: High
**カテゴリ**: 異常系 - エラーリカバリ

**前提条件**:
- ユーザーは未ログイン状態
- `/login` ページが表示されている

**テストステップ**:
1. メールアドレス入力フィールドに `invalid@example.com` を入力
2. パスワード入力フィールドに `WrongPassword` を入力
3. ログインボタンをクリック
4. エラーメッセージが表示されるのを確認
5. メールアドレスを `coach@rag-base.local` に修正
6. パスワードを `TestCoach2025!` に修正
7. ログインボタンを再度クリック

**期待結果**:
- ステップ4でエラーメッセージが表示される
- ステップ7で以下の挙動:
  - エラーメッセージが消える（`setError('')` が実行される）
  - ローディング状態になる
  - 500ms後にログイン成功
  - `/chat` にリダイレクトされる

**実装確認箇所**:
```typescript
// LoginPage.tsx Line 30-43
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setError(''); // 毎回handleSubmit実行時にエラーをクリア
  setLoading(true);

  try {
    await login({ email, password });
    navigate('/chat');
  } catch (err) {
    setError(err instanceof Error ? err.message : 'ログインに失敗しました');
  } finally {
    setLoading(false);
  }
};
```

---

## 4. セキュリティテスト

### 4.1 パスワードマスク

#### Test-012: パスワード入力のマスク表示
**優先度**: High
**カテゴリ**: セキュリティ - パスワード保護

**前提条件**:
- ユーザーは未ログイン状態
- `/login` ページが表示されている

**テストステップ**:
1. パスワード入力フィールドに `TestCoach2025!` を入力
2. 入力フィールドのtypeプロパティを確認
3. 入力値の表示形式を確認

**期待結果**:
- 入力フィールドのtype属性が `password` である
- 入力した文字が `•••••••••••••••` のようにマスクされて表示される
- ブラウザの検証ツールで確認しても、value属性にプレーンテキストが見えない（ブラウザの標準動作）

**実装確認箇所**:
```typescript
// LoginPage.tsx Line 116
<TextField
  type="password" // パスワードタイプ指定
  fullWidth
  required
  placeholder="8文字以上"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  disabled={loading}
/>
```

---

### 4.2 XSS対策

#### Test-013: メールアドレスへのスクリプト注入試行
**優先度**: High
**カテゴリ**: セキュリティ - XSS対策

**前提条件**:
- ユーザーは未ログイン状態
- `/login` ページが表示されている

**テストステップ**:
1. メールアドレス入力フィールドに `<script>alert('XSS')</script>@test.com` を入力
2. パスワード入力フィールドに `TestCoach2025!` を入力
3. ログインボタンをクリック

**期待結果**:
- スクリプトは実行されない
- React/MUIのデフォルトエスケープ処理により、入力値はテキストとして扱われる
- エラーメッセージが表示される（認証失敗）
- エラーメッセージ内でもスクリプトは実行されない

**実装確認箇所**:
```typescript
// LoginPage.tsx Line 25-26
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

// Reactのデフォルトエスケープ処理
// TextFieldのvalueプロパティに設定される値は自動的にエスケープされる
<TextField
  type="email"
  value={email} // React自動エスケープ
  onChange={(e) => setEmail(e.target.value)}
/>

// エラーメッセージ表示も同様
{error && (
  <Alert severity="error" icon={<ErrorIcon />}>
    {error} {/* React自動エスケープ */}
  </Alert>
)}
```

---

#### Test-014: パスワードへのスクリプト注入試行
**優先度**: High
**カテゴリ**: セキュリティ - XSS対策

**前提条件**:
- ユーザーは未ログイン状態
- `/login` ページが表示されている

**テストステップ**:
1. メールアドレス入力フィールドに `coach@rag-base.local` を入力
2. パスワード入力フィールドに `<img src=x onerror=alert('XSS')>` を入力
3. ログインボタンをクリック

**期待結果**:
- スクリプトは実行されない
- エラーメッセージが表示される（認証失敗）

---

### 4.3 認証トークン管理

#### Test-015: 認証トークンの安全な保存
**優先度**: Medium
**カテゴリ**: セキュリティ - トークン管理

**前提条件**:
- ユーザーは未ログイン状態
- `/login` ページが表示されている

**テストステップ**:
1. メールアドレス入力フィールドに `coach@rag-base.local` を入力
2. パスワード入力フィールドに `TestCoach2025!` を入力
3. ログインボタンをクリック
4. LocalStorageを確認

**期待結果**:
- LocalStorageに `auth_token` キーでトークンが保存される
- トークンの形式が `mock_token_coach-001_(タイムスタンプ)` である
- パスワードがLocalStorageに保存されていない
- LocalStorageに保存されるユーザー情報にpassword_hashが含まれていない

**実装確認箇所**:
```typescript
// mockAuthService.ts Line 74-90
const { password: _, ...userWithoutPassword } = user;
// パスワードを除外したユーザー情報のみ返却

const token = `mock_token_${user.user_id}_${Date.now()}`;
const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

return {
  token,
  user: {
    ...userWithoutPassword, // パスワードは含まれない
    last_login_at: new Date().toISOString(),
  },
  expires_at,
};
```

---

### 4.4 SQLインジェクション対策（概念的）

#### Test-016: SQLインジェクション試行（メールアドレス）
**優先度**: Low
**カテゴリ**: セキュリティ - SQLインジェクション対策

**前提条件**:
- ユーザーは未ログイン状態
- `/login` ページが表示されている

**テストステップ**:
1. メールアドレス入力フィールドに `admin' OR '1'='1` を入力
2. パスワード入力フィールドに `password` を入力
3. ログインボタンをクリック

**期待結果**:
- SQLインジェクションは成功しない（モック実装では配列find()を使用）
- エラーメッセージが表示される（認証失敗）
- 本番環境では、ORMのパラメータ化クエリにより保護される

**実装確認箇所**:
```typescript
// mockAuthService.ts Line 66-68
const user = MOCK_USERS.find(
  (u) => u.email === credentials.email && u.password === credentials.password
  // JavaScriptの配列find()なので、SQLインジェクション不可
);

// 本番環境では、SQLAlchemy等のORMでパラメータ化クエリを使用
// 例: SELECT * FROM users WHERE email = ? AND password_hash = ?
```

**注意事項**:
- モック実装ではJavaScript配列を使用しているため、SQLインジェクションは原理的に不可能
- 本番環境ではORMのパラメータ化クエリで対策済み（CLAUDE.mdのコーディング規約参照）

---

## 5. レスポンシブテスト

### 5.1 PC画面（デスクトップ）

#### Test-017: PC画面でのレイアウト確認（1920x1080）
**優先度**: High
**カテゴリ**: レスポンシブ - PC

**前提条件**:
- ブラウザのビューポートサイズ: 1920x1080
- `/login` ページが表示されている

**テストステップ**:
1. ページ全体のレイアウトを確認
2. 各要素のサイズ・配置を確認

**期待結果**:
- PublicLayoutで中央寄せレイアウト
- フォームコンテナの最大幅が適切（約400-500px）
- 各要素が縦方向に適切な間隔で配置される
- ロゴ・タイトルが中央揃え
- 入力フィールドが全幅表示
- ログインボタンが全幅表示
- デモアカウント情報ボックスが全幅表示
- すべてのテキストが読みやすいサイズで表示される

**実装確認箇所**:
```typescript
// LoginPage.tsx Line 48-49
<PublicLayout showHeader={false}>
  <Box component="form" onSubmit={handleSubmit} noValidate>

// PublicLayoutで中央寄せ、最大幅設定が行われている
```

---

### 5.2 スマートフォン画面（モバイル）

#### Test-018: iPhone 12でのレイアウト確認（390x844）
**優先度**: High
**カテゴリ**: レスポンシブ - モバイル（iOS）

**前提条件**:
- ブラウザのビューポートサイズ: 390x844（iPhone 12）
- `/login` ページが表示されている

**テストステップ**:
1. ページ全体のレイアウトを確認
2. タッチ操作を確認
3. 各要素のサイズ・配置を確認

**期待結果**:
- すべての要素が画面幅に収まる（横スクロールなし）
- ロゴとタイトルが適切なサイズで表示される
- 入力フィールドが十分なタッチターゲットサイズ（最低44x44px）
- ログインボタンが十分なタッチターゲットサイズ
- デモアカウント情報ボックスのテキストが読める
- フォントサイズが十分（最小12px以上）
- パディング・マージンが適切
- 縦スクロールで全コンテンツにアクセス可能

**実装確認箇所**:
```typescript
// LoginPage.tsx
// MUIのTextFieldとButtonはデフォルトでレスポンシブ対応
// fullWidth属性により、親要素の幅に合わせて自動調整

<TextField
  fullWidth // レスポンシブ対応
  size="large" // タッチターゲットサイズ確保
/>

<Button
  fullWidth // レスポンシブ対応
  size="large" // タッチターゲットサイズ確保
  sx={{ py: 1.5 }} // パディング調整
/>
```

---

#### Test-019: Android Pixel 5でのレイアウト確認（393x851）
**優先度**: High
**カテゴリ**: レスポンシブ - モバイル（Android）

**前提条件**:
- ブラウザのビューポートサイズ: 393x851（Pixel 5）
- `/login` ページが表示されている

**テストステップ**:
- Test-018と同様

**期待結果**:
- Test-018と同様のレスポンシブ挙動
- Android Chromeでの表示が正常

---

### 5.3 タブレット画面

#### Test-020: iPad（768x1024）でのレイアウト確認
**優先度**: Medium
**カテゴリ**: レスポンシブ - タブレット

**前提条件**:
- ブラウザのビューポートサイズ: 768x1024（iPad）
- `/login` ページが表示されている

**テストステップ**:
1. ページ全体のレイアウトを確認
2. 各要素のサイズ・配置を確認

**期待結果**:
- Test-017（PC）とTest-018（モバイル）の中間的なレイアウト
- すべての要素が画面幅に収まる
- 入力フィールドとボタンが適切なサイズで表示される

---

### 5.4 横向き表示（モバイル）

#### Test-021: iPhone 12 横向き（844x390）でのレイアウト確認
**優先度**: Medium
**カテゴリ**: レスポンシブ - モバイル横向き

**前提条件**:
- ブラウザのビューポートサイズ: 844x390（iPhone 12 横向き）
- `/login` ページが表示されている

**テストステップ**:
1. デバイスを横向きに回転（またはブラウザを横長に調整）
2. ページ全体のレイアウトを確認

**期待結果**:
- 縦スクロールで全コンテンツにアクセス可能
- ロゴとタイトルが適切に表示される
- 入力フィールドとボタンが適切なサイズで表示される
- レイアウト崩れがない

---

## 6. UIインタラクションテスト

### 6.1 キーボード操作

#### Test-022: Enterキーでのログイン実行
**優先度**: High
**カテゴリ**: UI - キーボード操作

**前提条件**:
- ユーザーは未ログイン状態
- `/login` ページが表示されている

**テストステップ**:
1. メールアドレス入力フィールドに `coach@rag-base.local` を入力
2. パスワード入力フィールドに `TestCoach2025!` を入力
3. パスワード入力フィールドにフォーカスがある状態でEnterキーを押下

**期待結果**:
- ログインボタンをクリックした場合と同じ挙動
- ログイン処理が実行される
- `/chat` にリダイレクトされる

**実装確認箇所**:
```typescript
// LoginPage.tsx Line 50
<Box component="form" onSubmit={handleSubmit} noValidate>
// formのonSubmitイベントにより、Enterキー押下で自動的にsubmitが実行される
```

---

#### Test-023: Tabキーでのフォーカス移動
**優先度**: Medium
**カテゴリ**: UI - キーボード操作

**前提条件**:
- ユーザーは未ログイン状態
- `/login` ページが表示されている

**テストステップ**:
1. メールアドレス入力フィールドをクリック
2. Tabキーを押下
3. Tabキーを再度押下

**期待結果**:
- ステップ1: メールアドレス入力フィールドにフォーカス
- ステップ2: パスワード入力フィールドにフォーカス移動
- ステップ3: ログインボタンにフォーカス移動
- フォーカス順序が自然な流れ（上から下）

**実装確認箇所**:
```typescript
// MUIのTextField、ButtonはデフォルトでtabIndexが適切に設定される
// HTML構造の順序がフォーカス順序になる
<TextField type="email" /> {/* tabIndex: 0 */}
<TextField type="password" /> {/* tabIndex: 1 */}
<Button type="submit" /> {/* tabIndex: 2 */}
```

---

### 6.2 マウス操作

#### Test-024: ホバー時のボタンスタイル変化
**優先度**: Low
**カテゴリ**: UI - マウス操作

**前提条件**:
- ユーザーは未ログイン状態
- `/login` ページが表示されている
- デバイス: PC（マウス操作可能）

**テストステップ**:
1. ログインボタンにマウスカーソルを乗せる
2. スタイル変化を確認

**期待結果**:
- ボタンが上方向に2px移動（transform: translateY(-2px)）
- ボックスシャドウが強調される（boxShadow: 2）
- トランジションが滑らか（150ms ease-in-out）

**実装確認箇所**:
```typescript
// LoginPage.tsx Line 135-153
<Button
  type="submit"
  variant="contained"
  fullWidth
  size="large"
  disabled={loading}
  sx={{
    mt: 1,
    py: 1.5,
    fontWeight: 600,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: 2,
    },
    transition: 'all 0.15s ease-in-out',
  }}
>
  {loading ? <CircularProgress size={24} color="inherit" /> : 'ログイン'}
</Button>
```

---

#### Test-025: 入力フィールドホバー時のボーダー変化
**優先度**: Low
**カテゴリ**: UI - マウス操作

**前提条件**:
- ユーザーは未ログイン状態
- `/login` ページが表示されている
- デバイス: PC（マウス操作可能）

**テストステップ**:
1. メールアドレス入力フィールドにマウスカーソルを乗せる
2. ボーダーカラーを確認

**期待結果**:
- ホバー時にボーダーカラーがprimary色に変化

**実装確認箇所**:
```typescript
// LoginPage.tsx Line 93-108
<TextField
  type="email"
  fullWidth
  required
  placeholder="example@email.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  disabled={loading}
  sx={{
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: 'primary.main',
      },
    },
  }}
/>
```

---

### 6.3 タッチ操作（モバイル）

#### Test-026: タッチでの入力フィールド選択
**優先度**: High
**カテゴリ**: UI - タッチ操作

**前提条件**:
- デバイス: iPhone 12またはAndroid Pixel 5
- `/login` ページが表示されている

**テストステップ**:
1. メールアドレス入力フィールドをタップ
2. キーボードの表示を確認
3. テキストを入力
4. パスワード入力フィールドをタップ
5. キーボードの表示を確認

**期待結果**:
- ステップ1: メールアドレス入力フィールドにフォーカス、ソフトウェアキーボード表示（メールキーボード）
- ステップ3: 入力が正常に反映される
- ステップ4: パスワード入力フィールドにフォーカス、ソフトウェアキーボード表示（通常キーボード）
- タッチターゲットが十分大きい（最低44x44px）
- 誤タップが発生しにくい

**実装確認箇所**:
```typescript
// LoginPage.tsx
<TextField
  type="email" // モバイルでメールキーボード表示
  fullWidth
  size="large" // タッチターゲットサイズ確保
/>

<TextField
  type="password" // モバイルで通常キーボード表示
  fullWidth
  size="large" // タッチターゲットサイズ確保
/>
```

---

#### Test-027: タッチでのログインボタン押下
**優先度**: High
**カテゴリ**: UI - タッチ操作

**前提条件**:
- デバイス: iPhone 12またはAndroid Pixel 5
- `/login` ページが表示されている
- メールアドレスとパスワードが入力済み

**テストステップ**:
1. ログインボタンをタップ

**期待結果**:
- タップ操作が正常に認識される
- ログイン処理が実行される
- タッチターゲットが十分大きい（ボタン全体がタッチ可能）

**実装確認箇所**:
```typescript
// LoginPage.tsx Line 135-153
<Button
  type="submit"
  variant="contained"
  fullWidth
  size="large" // タッチターゲットサイズ確保
  disabled={loading}
  sx={{
    mt: 1,
    py: 1.5, // 縦方向のパディングでタッチターゲット拡大
    fontWeight: 600,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: 2,
    },
    transition: 'all 0.15s ease-in-out',
  }}
>
  {loading ? <CircularProgress size={24} color="inherit" /> : 'ログイン'}
</Button>
```

---

## 7. パフォーマンステスト

### 7.1 ページロード時間

#### Test-028: ページ初期表示のパフォーマンス
**優先度**: Medium
**カテゴリ**: パフォーマンス - ページロード

**前提条件**:
- ブラウザキャッシュをクリア
- ネットワーク速度: 標準（Fast 3G以上）

**テストステップ**:
1. `/login` ページにアクセス
2. ページロード完了までの時間を計測

**期待結果**:
- ページ初期表示が2秒以内に完了
- First Contentful Paint（FCP）が1秒以内
- Time to Interactive（TTI）が2秒以内
- Cumulative Layout Shift（CLS）が0.1以下

**計測方法**:
- Playwright: `page.waitForLoadState('load')` の実行時間
- Chrome DevTools: Lighthouseスコア

---

### 7.2 ログイン処理時間

#### Test-029: ログイン処理の応答時間
**優先度**: Medium
**カテゴリ**: パフォーマンス - API応答

**前提条件**:
- ユーザーは未ログイン状態
- `/login` ページが表示されている

**テストステップ**:
1. 正しい認証情報を入力
2. ログインボタンをクリック
3. `/chat` へのリダイレクトまでの時間を計測

**期待結果**:
- ログイン処理が1秒以内に完了（モック実装: 500ms + 処理時間）
- ローディングインジケーターが適切なタイミングで表示される
- UIがフリーズしない

**実装確認箇所**:
```typescript
// mockAuthService.ts Line 64
await new Promise((resolve) => setTimeout(resolve, 500));
// 実際のAPI呼び出しをシミュレート（500ms遅延）
```

---

## 8. ブラウザ互換性テスト

### 8.1 Chrome

#### Test-030: Chrome最新版での動作確認
**優先度**: High
**カテゴリ**: ブラウザ互換性 - Chrome

**前提条件**:
- ブラウザ: Google Chrome最新版
- OS: macOS / Windows / Linux

**テストステップ**:
1. Test-002（ログイン成功）を実行

**期待結果**:
- すべての機能が正常に動作する
- レイアウト崩れがない
- コンソールエラーがない

---

### 8.2 Safari

#### Test-031: Safari最新版での動作確認
**優先度**: High
**カテゴリ**: ブラウザ互換性 - Safari

**前提条件**:
- ブラウザ: Safari最新版
- OS: macOS / iOS

**テストステップ**:
1. Test-002（ログイン成功）を実行

**期待結果**:
- すべての機能が正常に動作する
- レイアウト崩れがない
- コンソールエラーがない
- iOS SafariでもPC Safariと同様の挙動

---

### 8.3 Firefox

#### Test-032: Firefox最新版での動作確認
**優先度**: Medium
**カテゴリ**: ブラウザ互換性 - Firefox

**前提条件**:
- ブラウザ: Mozilla Firefox最新版
- OS: macOS / Windows / Linux

**テストステップ**:
1. Test-002（ログイン成功）を実行

**期待結果**:
- すべての機能が正常に動作する
- レイアウト崩れがない
- コンソールエラーがない

---

### 8.4 Edge

#### Test-033: Edge最新版での動作確認
**優先度**: Low
**カテゴリ**: ブラウザ互換性 - Edge

**前提条件**:
- ブラウザ: Microsoft Edge最新版
- OS: Windows / macOS

**テストステップ**:
1. Test-002（ログイン成功）を実行

**期待結果**:
- すべての機能が正常に動作する（Chromiumベースのため、Chrome同様の挙動）
- レイアウト崩れがない
- コンソールエラーがない

---

## 9. アクセシビリティテスト

### 9.1 キーボードナビゲーション

#### Test-034: キーボードのみでのログイン操作
**優先度**: High
**カテゴリ**: アクセシビリティ - キーボード操作

**前提条件**:
- ユーザーは未ログイン状態
- `/login` ページが表示されている

**テストステップ**:
1. Tabキーでメールアドレス入力フィールドにフォーカス
2. `coach@rag-base.local` を入力
3. Tabキーでパスワード入力フィールドにフォーカス
4. `TestCoach2025!` を入力
5. Tabキーでログインボタンにフォーカス
6. Enterキーまたはスペースキーでログインボタンを押下

**期待結果**:
- すべての操作がマウスなしで完了できる
- フォーカス状態が視覚的に明確（アウトラインまたはボーダー変化）
- フォーカス順序が自然（上から下）
- ログイン処理が正常に実行される

---

### 9.2 スクリーンリーダー対応

#### Test-035: スクリーンリーダーでのラベル読み上げ
**優先度**: Medium
**カテゴリ**: アクセシビリティ - スクリーンリーダー

**前提条件**:
- スクリーンリーダー: NVDA / JAWS / VoiceOver
- `/login` ページが表示されている

**テストステップ**:
1. スクリーンリーダーを起動
2. ページ内を順次移動
3. 各要素の読み上げ内容を確認

**期待結果**:
- ロゴ「COM:PASS」が読み上げられる
- サブタイトル「RAGベースAIコーチング」が読み上げられる
- フォームタイトル「ログイン」が読み上げられる
- メールアドレス入力フィールドのラベル「メールアドレス」が読み上げられる
- パスワード入力フィールドのラベル「パスワード」が読み上げられる
- ログインボタン「ログイン」が読み上げられる
- エラーメッセージが表示された場合、エラー内容が読み上げられる

**実装確認箇所**:
```typescript
// LoginPage.tsx
// MUIのTypographyとTextFieldはデフォルトでアクセシビリティ対応
<Typography variant="body2" component="label" fontWeight={500} color="text.secondary" sx={{ mb: 1, display: 'block' }}>
  メールアドレス
</Typography>
<TextField
  type="email"
  fullWidth
  required
  placeholder="example@email.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  disabled={loading}
  // aria-label自動生成
/>
```

---

### 9.3 カラーコントラスト

#### Test-036: テキストのカラーコントラスト確認
**優先度**: Medium
**カテゴリ**: アクセシビリティ - カラーコントラスト

**前提条件**:
- `/login` ページが表示されている

**テストステップ**:
1. Chrome DevToolsのLighthouseでアクセシビリティスコアを計測
2. カラーコントラスト比を確認

**期待結果**:
- すべてのテキストがWCAG AA基準（4.5:1以上）を満たす
- 特に以下の要素:
  - ロゴ「COM:PASS」（primary色）
  - サブタイトル（text.secondary）
  - フォームラベル（text.secondary）
  - エラーメッセージ（error色）
- Lighthouseアクセシビリティスコアが90以上

**実装確認箇所**:
```typescript
// テーマ設定でWCAG AA準拠の色が設定されている
// docs/design-system.md参照
```

---

## 10. エッジケーステスト

### 10.1 連続操作

#### Test-037: ログインボタン連打
**優先度**: Medium
**カテゴリ**: エッジケース - 連続操作

**前提条件**:
- ユーザーは未ログイン状態
- `/login` ページが表示されている

**テストステップ**:
1. 正しい認証情報を入力
2. ログインボタンを素早く3回連続でクリック

**期待結果**:
- 1回目のクリック後、ボタンがdisabled状態になる
- 2回目・3回目のクリックは無視される
- ログイン処理は1回のみ実行される
- `/chat` へのリダイレクトは1回のみ発生する

**実装確認箇所**:
```typescript
// LoginPage.tsx Line 135-153
<Button
  type="submit"
  variant="contained"
  fullWidth
  size="large"
  disabled={loading} // ローディング中はdisabled
  sx={{ ... }}
>
  {loading ? <CircularProgress size={24} color="inherit" /> : 'ログイン'}
</Button>

// Line 30-43
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true); // 即座にローディング状態に

  try {
    await login({ email, password });
    navigate('/chat');
  } catch (err) {
    setError(err instanceof Error ? err.message : 'ログインに失敗しました');
  } finally {
    setLoading(false);
  }
};
```

---

### 10.2 特殊文字入力

#### Test-038: メールアドレスに特殊文字を含む入力
**優先度**: Low
**カテゴリ**: エッジケース - 特殊文字

**前提条件**:
- ユーザーは未ログイン状態
- `/login` ページが表示されている

**テストステップ**:
1. メールアドレス入力フィールドに `test+user@example.com` を入力
2. パスワード入力フィールドに `TestCoach2025!` を入力
3. ログインボタンをクリック

**期待結果**:
- 入力は正常に受け付けられる（`+` は有効なメールアドレス文字）
- エラーメッセージが表示される（MOCK_USERSに存在しないため認証失敗）
- エラーメッセージ: 「メールアドレスまたはパスワードが正しくありません」

---

#### Test-039: パスワードに特殊文字を含む入力
**優先度**: Medium
**カテゴリ**: エッジケース - 特殊文字

**前提条件**:
- ユーザーは未ログイン状態
- `/login` ページが表示されている

**テストステップ**:
1. メールアドレス入力フィールドに `coach@rag-base.local` を入力
2. パスワード入力フィールドに `Test!@#$%^&*()_+{}|:"<>?[]\\;',./` を入力
3. ログインボタンをクリック

**期待結果**:
- すべての特殊文字が正常に入力される
- エラーメッセージが表示される（パスワード不一致）
- 特殊文字のエスケープ処理が正しく行われる

---

### 10.3 長文入力

#### Test-040: 非常に長いメールアドレスの入力
**優先度**: Low
**カテゴリ**: エッジケース - 長文入力

**前提条件**:
- ユーザーは未ログイン状態
- `/login` ページが表示されている

**テストステップ**:
1. メールアドレス入力フィールドに256文字以上の文字列を入力
   例: `verylongemailaddressverylongemailaddressverylongemailaddress...@example.com`
2. パスワード入力フィールドに `TestCoach2025!` を入力
3. ログインボタンをクリック

**期待結果**:
- 入力は受け付けられる（制限なし）
- エラーメッセージが表示される（認証失敗）
- レイアウト崩れがない（テキストが折り返される）

---

#### Test-041: 非常に長いパスワードの入力
**優先度**: Low
**カテゴリ**: エッジケース - 長文入力

**前提条件**:
- ユーザーは未ログイン状態
- `/login` ページが表示されている

**テストステップ**:
1. メールアドレス入力フィールドに `coach@rag-base.local` を入力
2. パスワード入力フィールドに100文字以上のランダム文字列を入力
3. ログインボタンをクリック

**期待結果**:
- 入力は受け付けられる（制限なし）
- エラーメッセージが表示される（認証失敗）
- パスワードフィールドが正しくマスク表示される

---

### 10.4 ネットワーク遅延

#### Test-042: 低速ネットワークでのログイン
**優先度**: Medium
**カテゴリ**: エッジケース - ネットワーク

**前提条件**:
- ブラウザのネットワーク速度を「Slow 3G」に設定
- `/login` ページが表示されている

**テストステップ**:
1. 正しい認証情報を入力
2. ログインボタンをクリック
3. ローディング状態を確認

**期待結果**:
- ローディングインジケーターが表示される
- ネットワーク遅延により応答時間が長くなる（500ms + ネットワーク遅延）
- タイムアウトエラーが発生しない（10秒以内）
- 最終的にログイン成功し、`/chat` にリダイレクトされる

---

### 10.5 ブラウザバック

#### Test-043: ログイン成功後のブラウザバック操作
**優先度**: High
**カテゴリ**: エッジケース - ナビゲーション

**前提条件**:
- ユーザーは未ログイン状態
- `/login` ページが表示されている

**テストステップ**:
1. 正しい認証情報を入力
2. ログインボタンをクリック
3. `/chat` にリダイレクトされるのを確認
4. ブラウザの「戻る」ボタンをクリック

**期待結果**:
- `/login` ページに戻る
- ただし、既にログイン済みのため、すぐに `/chat` にリダイレクトされる（または `/login` ページに「既にログイン済み」メッセージが表示される）
- 認証状態が保持されている

**実装確認箇所**:
```typescript
// AuthContextでログイン状態を管理
// ログイン済みの場合、/loginアクセス時に自動リダイレクトを実装する必要がある（TODO）
```

**注意事項**:
- このテストケースでは、認証ガード（AuthGuard）の実装が必要
- MVP段階では未実装の可能性あり

---

## 11. テスト実行計画

### 11.1 優先度別テスト実行順序

#### Phase 1: クリティカルパステスト（必須）
**実行タイミング**: 実装完了後、即時実行

| Test ID | テスト名 | 優先度 |
|---------|---------|--------|
| Test-001 | ページ初期表示の確認 | High |
| Test-002 | コーチアカウントでのログイン成功 | High |
| Test-003 | クライアント1アカウントでのログイン成功 | High |
| Test-006 | 存在しないメールアドレスでのログイン失敗 | High |
| Test-007 | 正しいメールアドレス、間違ったパスワードでのログイン失敗 | High |
| Test-011 | エラー後の再ログイン試行 | High |
| Test-012 | パスワード入力のマスク表示 | High |
| Test-013 | メールアドレスへのスクリプト注入試行 | High |
| Test-017 | PC画面でのレイアウト確認（1920x1080） | High |
| Test-018 | iPhone 12でのレイアウト確認（390x844） | High |
| Test-019 | Android Pixel 5でのレイアウト確認（393x851） | High |
| Test-022 | Enterキーでのログイン実行 | High |
| Test-026 | タッチでの入力フィールド選択 | High |
| Test-027 | タッチでのログインボタン押下 | High |
| Test-030 | Chrome最新版での動作確認 | High |
| Test-031 | Safari最新版での動作確認 | High |
| Test-034 | キーボードのみでのログイン操作 | High |
| Test-043 | ログイン成功後のブラウザバック操作 | High |

**合計**: 18テストケース

---

#### Phase 2: 重要機能テスト（推奨）
**実行タイミング**: Phase 1完了後、リリース前

| Test ID | テスト名 | 優先度 |
|---------|---------|--------|
| Test-004 | クライアント2アカウントでのログイン成功 | High |
| Test-005 | ローディング状態の表示 | Medium |
| Test-008 | 空のメールアドレスでのログイン試行 | Medium |
| Test-009 | 空のパスワードでのログイン試行 | Medium |
| Test-010 | メールアドレス・パスワード両方空でのログイン試行 | Medium |
| Test-014 | パスワードへのスクリプト注入試行 | High |
| Test-015 | 認証トークンの安全な保存 | Medium |
| Test-020 | iPad（768x1024）でのレイアウト確認 | Medium |
| Test-021 | iPhone 12 横向き（844x390）でのレイアウト確認 | Medium |
| Test-023 | Tabキーでのフォーカス移動 | Medium |
| Test-028 | ページ初期表示のパフォーマンス | Medium |
| Test-029 | ログイン処理の応答時間 | Medium |
| Test-032 | Firefox最新版での動作確認 | Medium |
| Test-035 | スクリーンリーダーでのラベル読み上げ | Medium |
| Test-036 | テキストのカラーコントラスト確認 | Medium |
| Test-037 | ログインボタン連打 | Medium |
| Test-039 | パスワードに特殊文字を含む入力 | Medium |
| Test-042 | 低速ネットワークでのログイン | Medium |

**合計**: 18テストケース

---

#### Phase 3: 補完テスト（オプション）
**実行タイミング**: リリース後、継続的テスト

| Test ID | テスト名 | 優先度 |
|---------|---------|--------|
| Test-016 | SQLインジェクション試行（メールアドレス） | Low |
| Test-024 | ホバー時のボタンスタイル変化 | Low |
| Test-025 | 入力フィールドホバー時のボーダー変化 | Low |
| Test-033 | Edge最新版での動作確認 | Low |
| Test-038 | メールアドレスに特殊文字を含む入力 | Low |
| Test-040 | 非常に長いメールアドレスの入力 | Low |
| Test-041 | 非常に長いパスワードの入力 | Low |

**合計**: 7テストケース

---

### 11.2 自動化対象テストケース

**Playwright E2Eテストで自動化**:
- Phase 1の全テストケース（18件）
- Phase 2の以下のテストケース:
  - Test-004, Test-005, Test-008, Test-009, Test-010, Test-014, Test-015
  - Test-020, Test-021, Test-023, Test-037, Test-039
  - （12件）

**手動テストで実施**:
- Phase 2の以下のテストケース:
  - Test-028, Test-029（パフォーマンステスト: Lighthouseで計測）
  - Test-032, Test-035, Test-036（ブラウザ互換性・アクセシビリティ: 手動確認）
  - Test-042（ネットワーク遅延: 手動で速度変更）
  - （6件）
- Phase 3の全テストケース（7件）

**自動化テストケース合計**: 30件
**手動テストケース合計**: 13件

---

### 11.3 テスト実行環境

#### CI/CD環境（自動実行）
```yaml
環境:
  OS: Ubuntu 22.04（GitHub Actions）
  Node.js: 20.x
  ブラウザ: Chromium（Playwright組み込み）

実行トリガー:
  - Pull Request作成時
  - main/developブランチへのpush時
  - 毎日0:00（定期実行）

対象テスト:
  - Phase 1全テスト（18件）
  - Phase 2自動化テスト（12件）
```

#### ローカル開発環境（手動実行）
```yaml
環境:
  OS: macOS / Windows / Linux
  Node.js: 20.x
  ブラウザ: Chrome, Safari, Firefox（各最新版）

実行コマンド:
  - npm run test:e2e（全自動テスト実行）
  - npm run test:e2e:ui（Playwright UIモード）
  - npm run test:e2e:debug（デバッグモード）

対象テスト:
  - Phase 1〜3全テスト（43件）
```

---

## 12. テストデータ管理

### 12.1 テスト用アカウント

**モックユーザー定義箇所**:
```typescript
// frontend/src/services/api/mockAuthService.ts Line 14-45
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
```

**テストデータの管理方針**:
- モックデータはコミット対象（mockAuthService.ts）
- 本番環境では使用しない（環境変数で切り替え）
- テスト実行時は毎回クリーンな状態から開始

---

### 12.2 テスト用LocalStorage管理

**テスト前処理**:
```typescript
// Playwright Before Each Hook
test.beforeEach(async ({ page }) => {
  // LocalStorageクリア
  await page.context().clearCookies();
  await page.evaluate(() => localStorage.clear());

  // ページ遷移
  await page.goto('/login');
});
```

**テスト後処理**:
```typescript
// Playwright After Each Hook
test.afterEach(async ({ page }) => {
  // LocalStorageクリア（次のテストへの影響を排除）
  await page.evaluate(() => localStorage.clear());
});
```

---

## 13. 不具合報告フォーマット

### 13.1 不具合テンプレート

```markdown
## 不具合報告

### 基本情報
- 発生日時: YYYY-MM-DD HH:mm
- テストケースID: Test-XXX
- 優先度: High / Medium / Low
- 影響範囲: クリティカル / メジャー / マイナー

### 環境
- OS: macOS 14.0 / Windows 11 / iOS 17.0 / Android 13
- ブラウザ: Chrome 120.0 / Safari 17.0 / Firefox 121.0
- デバイス: PC / iPhone 12 / Pixel 5
- 画面サイズ: 1920x1080 / 390x844 / 393x851

### 再現手順
1. [ステップ1]
2. [ステップ2]
3. [ステップ3]

### 期待結果
[本来の期待される動作]

### 実際の結果
[実際に発生した動作]

### スクリーンショット/動画
[添付ファイル]

### エラーログ
```
[コンソールエラー、ネットワークエラー等]
```

### 備考
[追加情報、関連する不具合等]
```

---

## 14. テスト完了基準

### 14.1 Phase 1（クリティカルパス）完了基準
- 18テストケース全てが成功（合格率100%）
- コンソールエラーがゼロ
- ブラウザ互換性テスト（Chrome, Safari）が成功
- スマホレスポンシブテスト（iPhone, Android）が成功

### 14.2 Phase 2（重要機能）完了基準
- 18テストケース中16テスト以上が成功（合格率88%以上）
- クリティカルな不具合がゼロ
- Lighthouseパフォーマンススコア70以上
- Lighthouseアクセシビリティスコア90以上

### 14.3 Phase 3（補完）完了基準
- 7テストケース中5テスト以上が成功（合格率70%以上）
- すべての不具合が文書化され、優先順位付けされている

---

## 15. 参考資料

### 15.1 実装ファイル
- `/frontend/src/pages/public/LoginPage.tsx`（121行）
- `/frontend/src/services/api/mockAuthService.ts`（166行）
- `/mockups/LoginPage.html`（354行）

### 15.2 関連ドキュメント
- `/docs/requirements.md` - D-001セクション（ログイン要件）
- `/CLAUDE.md` - コーディング規約、セキュリティ要件
- `/docs/design-system.md` - UIデザインシステム

### 15.3 外部リソース
- [Playwright公式ドキュメント](https://playwright.dev/)
- [MUI Accessibility](https://mui.com/material-ui/guides/accessibility/)
- [WCAG 2.1ガイドライン](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 16. 更新履歴

| 日付 | バージョン | 更新内容 | 更新者 |
|------|-----------|---------|--------|
| 2025-11-02 | 1.0 | 初版作成（43テストケース） | Claude Code |

---

**作成日**: 2025-11-02
**バージョン**: 1.0
**作成者**: Claude Code
**レビュー状態**: 未レビュー
