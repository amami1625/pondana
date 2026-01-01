/**
 * アバウトページのE2Eテスト
 */
import { test, expect } from '@playwright/test';

// テスト用の認証情報を環境変数から取得
const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'test-user@example.com';
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'password1234';

test.describe('アバウトページ', () => {
  // 各テストの前にストレージをクリアして、ログイン状態をリセット
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('ヘッダーからアバウトページにアクセスできる', async ({ page }) => {
    await page.goto('/');

    const aboutLink = page.getByRole('link', { name: /About/i });
    await aboutLink.click();

    // ページ遷移を待って、Aboutページの見出しが表示されることを確認
    await expect(page.getByRole('heading', { level: 1, name: /ぽんダナについて/i })).toBeVisible();
  });

  test('未ログイン状態で新規登録ページへリンクできる', async ({ page }) => {
    await page.goto('/');

    const aboutLink = page.getByRole('link', { name: /About/i });
    await aboutLink.click();

    const startLink = page.getByRole('link', { name: /今すぐ始める/i });
    await startLink.click();

    // 新規登録ページに遷移することを確認
    await expect(page).toHaveURL(/.*register/);
    await expect(page.getByRole('heading', { level: 2, name: /新規登録/i })).toBeVisible();
  });

  test('ログイン状態でトップページへリンクできる', async ({ page }) => {
    await page.goto('/');

    const loginLink = page.getByRole('link', { name: /ログイン/i });
    await loginLink.click();

    // ログインページに遷移したことを確認
    await expect(page).toHaveURL(/.*login/);

    const emailInput = page.getByLabel(/メールアドレス/i);
    await emailInput.fill(TEST_EMAIL);

    const passwordInput = page.getByLabel(/パスワード/i);
    await passwordInput.fill(TEST_PASSWORD);

    const loginButton = page.getByRole('button', { name: /ログイン/i });
    await loginButton.click();

    // ログイン後、トップページに遷移することを確認
    await page.waitForURL(/.*top/, { timeout: 10000 });

    const aboutLink = page.getByRole('link', { name: /About/i });
    await aboutLink.click();

    const startLink = page.getByRole('link', { name: /今すぐ始める/i });
    await startLink.click();

    // ログイン済みの場合、トップページに遷移することを確認
    await expect(page).toHaveURL(/.*top/);
  });
});
