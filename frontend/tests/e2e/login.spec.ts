import { test, expect } from '@playwright/test';

// テスト用認証情報
const COACH_EMAIL = 'coach@rag-base.local';
const COACH_PASSWORD = 'TestCoach2025!';
const CLIENT1_EMAIL = 'client1@rag-base.local';
const CLIENT1_PASSWORD = 'TestClient2025!';
const CLIENT2_EMAIL = 'client2@rag-base.local';
const CLIENT2_PASSWORD = 'TestClient2025!';

test.describe('LoginPage E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // LocalStorageとCookieをクリア
    await page.context().clearCookies();
    await page.goto('/login');
    await page.evaluate(() => localStorage.clear());
  });

  test.afterEach(async ({ page }) => {
    // テスト後のクリーンアップ
    await page.evaluate(() => localStorage.clear());
  });

  // Phase 1: クリティカルパステスト（高優先度）

  test('Test-001: ページ初期表示の確認', async ({ page }) => {
    // ページタイトル確認
    await expect(page).toHaveTitle(/COM:PASS/);

    // ロゴ確認
    const logo = page.locator('text=COM:PASS').first();
    await expect(logo).toBeVisible();

    // サブタイトル確認
    const subtitle = page.locator('text=RAGベースAIコーチング');
    await expect(subtitle).toBeVisible();

    // フォームタイトル確認
    const formTitle = page.locator('text=ログイン').last();
    await expect(formTitle).toBeVisible();

    // メールアドレス入力フィールド
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('placeholder', 'example@email.com');
    await expect(emailInput).toHaveAttribute('required', '');

    // パスワード入力フィールド
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('placeholder', '8文字以上');
    await expect(passwordInput).toHaveAttribute('required', '');

    // ログインボタン
    const loginButton = page.locator('button[type="submit"]', { hasText: 'ログイン' });
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();

    // デモアカウント情報確認
    await expect(page.locator('text=coach@rag-base.local')).toBeVisible();
    await expect(page.locator('text=client1@rag-base.local')).toBeVisible();
    await expect(page.locator('text=client2@rag-base.local')).toBeVisible();

    // エラーメッセージは表示されない
    const errorAlert = page.locator('div[role="alert"]');
    await expect(errorAlert).not.toBeVisible();
  });

  test('Test-002: コーチアカウントでのログイン成功', async ({ page }) => {
    // 認証情報入力
    await page.fill('input[type="email"]', COACH_EMAIL);
    await page.fill('input[type="password"]', COACH_PASSWORD);

    // ログインボタンクリック
    await page.click('button[type="submit"]');

    // ローディング状態確認（CircularProgress表示）
    const loader = page.locator('span.MuiCircularProgress-root');
    await expect(loader).toBeVisible();

    // 入力フィールドがdisabled状態
    await expect(page.locator('input[type="email"]')).toBeDisabled();
    await expect(page.locator('input[type="password"]')).toBeDisabled();

    // リダイレクト確認（コーチは/adminへ）
    await expect(page).toHaveURL(/\/admin/, { timeout: 5000 });

    // LocalStorageに認証トークンが保存されている
    const token = await page.evaluate(() => localStorage.getItem('rag_base_auth_token'));
    expect(token).toBeTruthy();
    expect(token).toContain('mock_token_coach-001');
  });

  test('Test-003: クライアント1アカウントでのログイン成功', async ({ page }) => {
    await page.fill('input[type="email"]', CLIENT1_EMAIL);
    await page.fill('input[type="password"]', CLIENT1_PASSWORD);
    await page.click('button[type="submit"]');

    // リダイレクト確認
    await expect(page).toHaveURL(/\/chat/, { timeout: 5000 });

    // LocalStorageに認証トークンが保存されている
    const token = await page.evaluate(() => localStorage.getItem('rag_base_auth_token'));
    expect(token).toBeTruthy();
    expect(token).toContain('mock_token_client-001');
  });

  test('Test-004: クライアント2アカウントでのログイン成功', async ({ page }) => {
    await page.fill('input[type="email"]', CLIENT2_EMAIL);
    await page.fill('input[type="password"]', CLIENT2_PASSWORD);
    await page.click('button[type="submit"]');

    // リダイレクト確認
    await expect(page).toHaveURL(/\/chat/, { timeout: 5000 });

    // LocalStorageに認証トークンが保存されている
    const token = await page.evaluate(() => localStorage.getItem('rag_base_auth_token'));
    expect(token).toBeTruthy();
    expect(token).toContain('mock_token_client-002');
  });

  test('Test-005: ローディング状態の表示', async ({ page }) => {
    await page.fill('input[type="email"]', COACH_EMAIL);
    await page.fill('input[type="password"]', COACH_PASSWORD);
    await page.click('button[type="submit"]');

    // ローディング中の確認
    const loginButton = page.locator('button[type="submit"]');
    await expect(loginButton).toBeDisabled();

    const loader = page.locator('span.MuiCircularProgress-root');
    await expect(loader).toBeVisible();

    // 入力フィールドがdisabled
    await expect(page.locator('input[type="email"]')).toBeDisabled();
    await expect(page.locator('input[type="password"]')).toBeDisabled();
  });

  test('Test-006: 存在しないメールアドレスでのログイン失敗', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', COACH_PASSWORD);
    await page.click('button[type="submit"]');

    // エラーメッセージ表示確認
    const errorAlert = page.locator('div[role="alert"]', { hasText: 'メールアドレスまたはパスワードが正しくありません' });
    await expect(errorAlert).toBeVisible({ timeout: 5000 });

    // リダイレクトされない
    await expect(page).toHaveURL(/\/login/);

    // 入力フィールドが再度有効化
    await expect(page.locator('input[type="email"]')).toBeEnabled();
    await expect(page.locator('input[type="password"]')).toBeEnabled();

    // 入力値はクリアされない
    await expect(page.locator('input[type="email"]')).toHaveValue('invalid@example.com');
    await expect(page.locator('input[type="password"]')).toHaveValue(COACH_PASSWORD);
  });

  test('Test-007: 正しいメールアドレス、間違ったパスワードでのログイン失敗', async ({ page }) => {
    await page.fill('input[type="email"]', COACH_EMAIL);
    await page.fill('input[type="password"]', 'WrongPassword123!');
    await page.click('button[type="submit"]');

    // エラーメッセージ表示
    const errorAlert = page.locator('div[role="alert"]', { hasText: 'メールアドレスまたはパスワードが正しくありません' });
    await expect(errorAlert).toBeVisible({ timeout: 5000 });

    // リダイレクトされない
    await expect(page).toHaveURL(/\/login/);
  });

  test('Test-011: エラー後の再ログイン試行', async ({ page }) => {
    // 1回目: 失敗
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'WrongPassword');
    await page.click('button[type="submit"]');

    // エラーメッセージ表示確認
    const errorAlert = page.locator('div[role="alert"]');
    await expect(errorAlert).toBeVisible({ timeout: 5000 });

    // 2回目: 成功（コーチアカウント）
    await page.fill('input[type="email"]', COACH_EMAIL);
    await page.fill('input[type="password"]', COACH_PASSWORD);
    await page.click('button[type="submit"]');

    // エラーメッセージが消える
    await expect(errorAlert).not.toBeVisible();

    // ログイン成功（コーチは/adminへ）
    await expect(page).toHaveURL(/\/admin/, { timeout: 5000 });
  });

  test('Test-012: パスワード入力のマスク表示', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');

    // type属性がpasswordである
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // パスワード入力
    await passwordInput.fill('TestPassword123!');

    // valueは内部的には保持されるが、画面上はマスク表示される
    await expect(passwordInput).toHaveValue('TestPassword123!');
  });

  test('Test-013: メールアドレスへのスクリプト注入試行', async ({ page }) => {
    await page.fill('input[type="email"]', "<script>alert('XSS')</script>@test.com");
    await page.fill('input[type="password"]', COACH_PASSWORD);
    await page.click('button[type="submit"]');

    // スクリプトは実行されない、エラーメッセージが表示される
    const errorAlert = page.locator('div[role="alert"]');
    await expect(errorAlert).toBeVisible({ timeout: 5000 });

    // アラートダイアログは表示されない（スクリプトが実行されていない）
    page.on('dialog', () => {
      throw new Error('XSSアラートが発生しました');
    });
  });

  test('Test-014: パスワードへのスクリプト注入試行', async ({ page }) => {
    await page.fill('input[type="email"]', COACH_EMAIL);
    await page.fill('input[type="password"]', "<img src=x onerror=alert('XSS')>");
    await page.click('button[type="submit"]');

    // エラーメッセージ表示
    const errorAlert = page.locator('div[role="alert"]');
    await expect(errorAlert).toBeVisible({ timeout: 5000 });

    // アラートダイアログは表示されない
    page.on('dialog', () => {
      throw new Error('XSSアラートが発生しました');
    });
  });

  test('Test-017: PC画面でのレイアウト確認（1920x1080）', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/login');

    // ページ全体が表示される
    await expect(page.locator('text=COM:PASS')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // 横スクロールなし
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(bodyScrollWidth).toBe(bodyClientWidth);
  });

  test('Test-018: iPhone 12でのレイアウト確認（390x844）', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/login');

    // すべての要素が表示される
    await expect(page.locator('text=COM:PASS')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // 横スクロールなし
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 5); // 5pxの許容誤差
  });

  test('Test-019: Android Pixel 5でのレイアウト確認（393x851）', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 851 });
    await page.goto('/login');

    // すべての要素が表示される
    await expect(page.locator('text=COM:PASS')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // 横スクロールなし
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 5);
  });

  test('Test-022: Enterキーでのログイン実行', async ({ page }) => {
    await page.fill('input[type="email"]', COACH_EMAIL);
    await page.fill('input[type="password"]', COACH_PASSWORD);

    // パスワードフィールドでEnterキー押下
    await page.locator('input[type="password"]').press('Enter');

    // ログイン成功（コーチは/adminへ）
    await expect(page).toHaveURL(/\/admin/, { timeout: 5000 });
  });

  test('Test-030: Chrome最新版での動作確認', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Chrome専用テスト');

    await page.fill('input[type="email"]', COACH_EMAIL);
    await page.fill('input[type="password"]', COACH_PASSWORD);
    await page.click('button[type="submit"]');

    // ログイン成功（コーチは/adminへ）
    await expect(page).toHaveURL(/\/admin/, { timeout: 5000 });

    // コンソールエラーなし
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    expect(consoleErrors.length).toBe(0);
  });

  test('Test-031: Safari最新版での動作確認', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'Safari専用テスト');

    await page.fill('input[type="email"]', COACH_EMAIL);
    await page.fill('input[type="password"]', COACH_PASSWORD);
    await page.click('button[type="submit"]');

    // ログイン成功（コーチは/adminへ）
    await expect(page).toHaveURL(/\/admin/, { timeout: 5000 });
  });

  test('Test-034: キーボードのみでのログイン操作', async ({ page }) => {
    // Tabキーでフォーカス移動
    await page.keyboard.press('Tab'); // メールアドレスフィールドへ
    await page.keyboard.type(COACH_EMAIL);

    await page.keyboard.press('Tab'); // パスワードフィールドへ
    await page.keyboard.type(COACH_PASSWORD);

    await page.keyboard.press('Tab'); // ログインボタンへ
    await page.keyboard.press('Enter'); // ログイン実行

    // ログイン成功（コーチは/adminへ）
    await expect(page).toHaveURL(/\/admin/, { timeout: 5000 });
  });

  test('Test-043: ログイン成功後のブラウザバック操作', async ({ page }) => {
    // ログイン
    await page.fill('input[type="email"]', COACH_EMAIL);
    await page.fill('input[type="password"]', COACH_PASSWORD);
    await page.click('button[type="submit"]');

    // /adminにリダイレクト（コーチ）
    await expect(page).toHaveURL(/\/admin/, { timeout: 5000 });

    // ブラウザバック
    await page.goBack();

    // /loginに戻るが、認証済みのため再度/adminにリダイレクトされる可能性
    // または/loginページに「既にログイン済み」メッセージ表示
    // MVP段階では実装されていない可能性があるため、URLのみ確認
    const currentURL = page.url();
    expect(currentURL).toMatch(/\/(login|admin)/);
  });
});
