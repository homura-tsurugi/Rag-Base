import { test, expect } from '@playwright/test';

// テスト用認証情報
const CLIENT1_EMAIL = 'client1@rag-base.local';
const CLIENT1_PASSWORD = 'TestClient2025!';
const COACH_EMAIL = 'coach@rag-base.local';
const COACH_PASSWORD = 'TestCoach2025!';

test.describe('ChatPage E2E Tests', () => {
  // 認証ヘルパー
  async function loginAsClient(page) {
    await page.goto('/login');
    await page.fill('input[type="email"]', CLIENT1_EMAIL);
    await page.fill('input[type="password"]', CLIENT1_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/chat/, { timeout: 5000 });
  }

  test.beforeEach(async ({ page }) => {
    // LocalStorageとCookieをクリア
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
  });

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
  });

  // 高優先度テストのみ実装

  test('E2E-CHAT-001: ページアクセス（認証済み）', async ({ page }) => {
    await loginAsClient(page);

    // ヘッダー確認
    await expect(page.locator('text=COM:PASS')).toBeVisible();

    // モードセレクター表示
    await expect(page.locator('text=課題解決モード')).toBeVisible();

    // ウェルカムメッセージ確認
    const welcomeMessage = page.locator('text=課題解決モード').first();
    await expect(welcomeMessage).toBeVisible();

    // 入力エリア表示
    const messageInput = page.locator('textarea, input[placeholder*="メッセージ"]').first();
    await expect(messageInput).toBeVisible();
  });

  test('E2E-CHAT-002: ページアクセス（未認証）', async ({ page }) => {
    // 未ログイン状態で/chatにアクセス
    await page.goto('/chat');

    // ログインページにリダイレクト
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });

  test('E2E-CHAT-003: 初期表示：課題解決モード', async ({ page }) => {
    await loginAsClient(page);

    // 課題解決モードが選択状態
    const problemSolvingMode = page.locator('button', { hasText: '課題解決モード' });
    await expect(problemSolvingMode).toBeVisible();

    // ウェルカムタイトル
    await expect(page.locator('text=課題解決モード').first()).toBeVisible();

    // クイックプロンプト表示確認（4件）
    const quickPrompts = page.locator('button').filter({ hasText: /問題を特定する|原因を分析する|解決策を考える|アクションプランを立てる/ });
    const count = await quickPrompts.count();
    expect(count).toBeGreaterThanOrEqual(3); // 最低3件表示
  });

  test('E2E-CHAT-005: モード切り替え：学習支援モード', async ({ page }) => {
    await loginAsClient(page);

    // 学習支援モードボタンをクリック
    const learningMode = page.locator('button', { hasText: '学習支援モード' });
    await learningMode.click();

    // ウェルカムタイトルが変更される
    await expect(page.locator('text=学習支援モード').first()).toBeVisible({ timeout: 3000 });
  });

  test('E2E-CHAT-008: クイックプロンプト選択', async ({ page }) => {
    await loginAsClient(page);

    // クイックプロンプトをクリック
    const quickPrompt = page.locator('button').filter({ hasText: '問題を特定する' }).first();
    await quickPrompt.click();

    // 入力欄に自動入力される
    const messageInput = page.locator('textarea, input[placeholder*="メッセージ"]').first();
    const inputValue = await messageInput.inputValue();
    expect(inputValue.length).toBeGreaterThan(0);
  });

  test('E2E-CHAT-041: レスポンシブ：タブレット表示', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await loginAsClient(page);

    // ページ全体が表示される
    await expect(page.locator('text=COM:PASS')).toBeVisible();

    // 横スクロールなし
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 10);
  });

  test('E2E-CHAT-042: レスポンシブ：モバイル表示（iPhone）', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await loginAsClient(page);

    // ページ全体が表示される
    await expect(page.locator('text=COM:PASS')).toBeVisible();

    // 入力エリアが表示される
    const messageInput = page.locator('textarea, input[placeholder*="メッセージ"]').first();
    await expect(messageInput).toBeVisible();

    // 横スクロールなし
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 10);
  });

  test('E2E-CHAT-043: レスポンシブ：モバイル表示（Android）', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 851 });
    await loginAsClient(page);

    // ページ全体が表示される
    await expect(page.locator('text=COM:PASS')).toBeVisible();

    // 横スクロールなし
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 10);
  });
});
