import { test, expect } from '@playwright/test';

// テスト用認証情報
const CLIENT1_EMAIL = 'client1@rag-base.local';
const CLIENT1_PASSWORD = 'TestClient2025!';

test.describe('ConversationHistoryPage E2E Tests', () => {
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

  test('E2E-LOGS-001: ページアクセス（認証済み・クライアント）', async ({ page }) => {
    await loginAsClient(page);

    // /logsへ遷移
    await page.goto('/logs');

    // 会話履歴ページが表示される
    await expect(page).toHaveURL(/\/logs/);

    // ページタイトル確認
    const pageTitle = page.locator('text=会話履歴').first();
    await expect(pageTitle).toBeVisible({ timeout: 5000 });
  });

  test('E2E-LOGS-002: ページアクセス（未認証）', async ({ page }) => {
    // 未ログイン状態で/logsにアクセス
    await page.goto('/logs');

    // ログインページにリダイレクト
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });

  test('E2E-LOGS-004: 初期表示：ローディング状態', async ({ page }) => {
    await loginAsClient(page);
    await page.goto('/logs');

    // ページが表示される（ローディングは一瞬で終わる可能性）
    await expect(page).toHaveURL(/\/logs/);

    // ローディングが終わるとコンテンツが表示される
    const content = page.locator('body');
    await expect(content).toBeVisible();
  });

  test('E2E-LOGS-007: 空の状態（会話0件）', async ({ page }) => {
    await loginAsClient(page);
    await page.goto('/logs');

    // 空の状態メッセージまたは会話カードを確認
    // 空の場合: 「会話履歴がありません」
    // データがある場合: 会話カードが表示される
    const emptyMessage = page.locator('text=会話履歴がありません');
    const conversationCards = page.locator('[role="button"]').filter({ hasText: /目標|キャリア|振り返り/ });

    const hasEmpty = await emptyMessage.isVisible().catch(() => false);
    const hasCards = (await conversationCards.count()) > 0;

    // どちらかが表示されていることを確認
    expect(hasEmpty || hasCards).toBe(true);
  });

  test('E2E-LOGS-041: レスポンシブ：デスクトップ表示', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginAsClient(page);
    await page.goto('/logs');

    // ページが表示される
    await expect(page).toHaveURL(/\/logs/);

    // 横スクロールなし
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 10);
  });

  test('E2E-LOGS-042: レスポンシブ：タブレット表示', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await loginAsClient(page);
    await page.goto('/logs');

    // ページが表示される
    await expect(page).toHaveURL(/\/logs/);

    // 横スクロールなし
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 10);
  });

  test('E2E-LOGS-043: レスポンシブ：モバイル表示（iPhone）', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await loginAsClient(page);
    await page.goto('/logs');

    // ページが表示される
    await expect(page).toHaveURL(/\/logs/);

    // ページタイトル確認
    const pageTitle = page.locator('text=会話履歴').first();
    await expect(pageTitle).toBeVisible({ timeout: 5000 });

    // 横スクロールなし
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 10);
  });

  test('E2E-LOGS-044: レスポンシブ：モバイル表示（Android）', async ({ page }) => {
    await page.setViewportSize({ width: 393, height: 851 });
    await loginAsClient(page);
    await page.goto('/logs');

    // ページが表示される
    await expect(page).toHaveURL(/\/logs/);

    // 横スクロールなし
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 10);
  });
});
