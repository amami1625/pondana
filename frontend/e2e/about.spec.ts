/**
 * アバウトページのE2Eテスト
 */
import { test, expect } from '@playwright/test';

const TEST_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD;

if (!TEST_EMAIL || !TEST_PASSWORD) {
  throw new Error(
    'E2Eテストの実行には環境変数 TEST_USER_EMAIL と TEST_USER_PASSWORD の設定が必要です。\n' +
      'ローカル環境: export TEST_USER_EMAIL="..." && export TEST_USER_PASSWORD="..."\n' +
      'CI環境: Repository Secrets に設定してください。',
  );
}

test.describe('アバウトページ', () => {
  // 各テストの前にストレージをクリアして、ログイン状態をリセット
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('ヘッダーからアバウトページにアクセスできる', async ({ page }) => {
    await page.goto('/');

    const aboutLink = page.getByRole('link', { name: /About/i });
    await aboutLink.click();

    // Aboutページへの遷移を明示的に待機
    await page.waitForURL(/.*about/);

    // URLとコンテンツの両方を確認
    await expect(page).toHaveURL(/.*about/);
    await expect(page.getByRole('heading', { level: 1, name: /ぽんダナについて/i })).toBeVisible();
  });

  test('未ログイン状態で新規登録ページへリンクできる', async ({ page }) => {
    await page.goto('/');

    const aboutLink = page.getByRole('link', { name: /About/i });
    await aboutLink.click();

    // Aboutページへの遷移を明示的に待機
    await page.waitForURL(/.*about/);

    const startLink = page.getByRole('link', { name: /今すぐ始める/i });
    await startLink.click();

    // 新規登録ページへの遷移を明示的に待機
    await page.waitForURL(/.*register/);

    // URLとコンテンツの両方を確認
    await expect(page).toHaveURL(/.*register/);
    await expect(page.getByRole('heading', { level: 2, name: /新規登録/i })).toBeVisible();
  });

  test('ログイン状態でトップページへリンクできる', async ({ page }) => {
    await page.goto('/');

    const loginLink = page.getByRole('link', { name: /ログイン/i });
    await loginLink.click();

    // ログインページへの遷移を明示的に待機
    await page.waitForURL(/.*login/);

    const emailInput = page.getByLabel(/メールアドレス/i);
    await emailInput.fill(TEST_EMAIL);

    const passwordInput = page.getByLabel(/パスワード/i);
    await passwordInput.fill(TEST_PASSWORD);

    const loginButton = page.getByRole('button', { name: 'ログイン', exact: true });
    await loginButton.click();

    // ログイン後、トップページに遷移することを確認
    await page.waitForURL(/.*top/, { timeout: 10000 });

    const aboutLink = page.getByRole('link', { name: /About/i });
    await aboutLink.click();

    // Aboutページへの遷移を明示的に待機
    await page.waitForURL(/.*about/);

    const startLink = page.getByRole('link', { name: /今すぐ始める/i });
    await startLink.click();

    // トップページへの遷移を明示的に待機
    await page.waitForURL(/.*top/);

    // ログイン済みの場合、トップページに遷移することを確認
    await expect(page).toHaveURL(/.*top/);
  });
});
