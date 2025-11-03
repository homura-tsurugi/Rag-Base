import { test, expect } from '@playwright/test';

test('モードボタンの動作確認', async ({ page }) => {
  // ローカル開発サーバーにアクセス
  await page.goto('http://localhost:3000/chat');

  // ログインページにリダイレクトされる場合はログイン
  if (page.url().includes('/login')) {
    await page.fill('input[type="email"]', 'client1@rag-base.local');
    await page.fill('input[type="password"]', 'TestClient2025!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/chat');
  }

  console.log('Current URL:', page.url());

  // メッセージを送信
  await page.fill('input[placeholder*="メッセージ"]', 'テストメッセージです');
  await page.click('button[aria-label*="送信"], button:has-text("送信"), svg[data-testid="SendIcon"]');

  // 少し待機
  await page.waitForTimeout(2000);

  // 現在のモードを確認（課題解決モードがデフォルト）
  const currentMode = await page.locator('button:has-text("課題解決モード")').getAttribute('variant');
  console.log('Current mode variant:', currentMode);

  // 学習支援モードボタンをクリック
  console.log('学習支援モードボタンをクリックします...');
  await page.click('button:has-text("学習支援モード")');

  // 少し待機
  await page.waitForTimeout(1000);

  // モードが変わったか確認
  const newMode = await page.locator('button:has-text("学習支援モード")').getAttribute('variant');
  console.log('New mode variant:', newMode);

  // スクリーンショット撮影
  await page.screenshot({ path: 'mode-button-test.png', fullPage: true });

  console.log('テスト完了。スクリーンショットを保存しました: mode-button-test.png');
});
