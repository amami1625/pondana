/**
 * 認証（ログイン・ログアウト）のE2Eテスト
 *
 * このテストでは以下を確認します：
 * 1. ログインページへのアクセス
 * 2. フォームへの入力
 * 3. ログイン処理
 * 4. ログイン後のリダイレクト
 * 5. ログアウト処理（確認ダイアログのOK/キャンセル）
 * 6. ログイン失敗時のエラー処理
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

test.describe('ログイン機能', () => {
  // 各テストの前にストレージをクリアして、ログイン状態をリセット
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('トップページからログインページに遷移してログインできること', async ({ page }) => {
    await page.goto('/');

    const loginLink = page.getByRole('link', { name: /ログイン/i });
    await loginLink.click();

    // toHaveURL() でURLを検証（正規表現で部分一致）
    await expect(page).toHaveURL(/.*login/);

    const emailInput = page.getByLabel(/メールアドレス/i);
    await emailInput.fill(TEST_EMAIL);

    const passwordInput = page.getByLabel(/パスワード/i);
    await passwordInput.fill(TEST_PASSWORD);

    const loginButton = page.getByRole('button', { name: 'ログイン', exact: true });
    await loginButton.click();

    await page.waitForURL(/.*top/, { timeout: 10000 });

    const logoutButton = page.getByRole('button', { name: /ログアウト/i });
    await expect(logoutButton).toBeVisible();
  });

  test('ログイン後、ログアウトをキャンセルできること', async ({ page }) => {
    await page.goto('/');

    const loginLink = page.getByRole('link', { name: /ログイン/i });
    await loginLink.click();

    const emailInput = page.getByLabel(/メールアドレス/i);
    await emailInput.fill(TEST_EMAIL);

    const passwordInput = page.getByLabel(/パスワード/i);
    await passwordInput.fill(TEST_PASSWORD);

    const loginButton = page.getByRole('button', { name: 'ログイン', exact: true });
    await loginButton.click();

    await page.waitForURL(/.*top/, { timeout: 10000 });

    // ダイアログが表示されたら, キャンセルを選択する
    page.once('dialog', async (dialog) => {
      await dialog.dismiss();
    });

    const logoutButton = page.getByRole('button', { name: /ログアウト/i });
    await logoutButton.click();

    const logoutButtonAfterLogout = page.getByRole('button', { name: /ログアウト/i });
    await expect(logoutButtonAfterLogout).toBeVisible();
  });

  test('ログイン後、ログアウトできること', async ({ page }) => {
    await page.goto('/');

    const loginLink = page.getByRole('link', { name: /ログイン/i });
    await loginLink.click();

    const emailInput = page.getByLabel(/メールアドレス/i);
    await emailInput.fill(TEST_EMAIL);

    const passwordInput = page.getByLabel(/パスワード/i);
    await passwordInput.fill(TEST_PASSWORD);

    const loginButton = page.getByRole('button', { name: 'ログイン', exact: true });
    await loginButton.click();

    await page.waitForURL(/.*top/, { timeout: 10000 });

    // ダイアログが表示されたら, OKを選択する
    page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    const logoutButton = page.getByRole('button', { name: /ログアウト/i });
    await logoutButton.click();

    await page.waitForURL('/', { timeout: 10000 });

    const loginLinkAfterLogout = page.getByRole('link', { name: /ログイン/i });
    await expect(loginLinkAfterLogout).toBeVisible();
  });

  test('誤ったパスワードでログインに失敗すること', async ({ page }) => {
    // ログインページに直接アクセス
    await page.goto('/login');

    // 正しいメールアドレスを入力
    const emailInput = page.getByLabel(/メールアドレス/i);
    await emailInput.fill(TEST_EMAIL);

    // 誤ったパスワードを入力
    const passwordInput = page.getByLabel(/パスワード/i);
    await passwordInput.fill('wrong-password-123');

    // ログインボタンをクリック
    const loginButton = page.getByRole('button', { name: 'ログイン', exact: true });
    await loginButton.click();

    // エラーメッセージが表示されることを確認
    const errorMessage = page.getByText(/メールアドレスまたはパスワードが正しくありません/i);
    await expect(errorMessage).toBeVisible();
  });

  test('誤ったメールアドレスでログインに失敗すること', async ({ page }) => {
    // ログインページに直接アクセス
    await page.goto('/login');

    // 誤ったメールアドレスを入力
    const emailInput = page.getByLabel(/メールアドレス/i);
    await emailInput.fill('wrong-address@example.com');

    // 正しいパスワードを入力
    const passwordInput = page.getByLabel(/パスワード/i);
    await passwordInput.fill(TEST_PASSWORD);

    // ログインボタンをクリック
    const loginButton = page.getByRole('button', { name: 'ログイン', exact: true });
    await loginButton.click();

    // エラーメッセージが表示されることを確認
    const errorMessage = page.getByText(/メールアドレスまたはパスワードが正しくありません/i);
    await expect(errorMessage).toBeVisible();
  });

  test('メールアドレスが空の場合、ログインできないこと', async ({ page }) => {
    // ログインページに直接アクセス
    await page.goto('/login');

    // パスワードのみ入力
    const passwordInput = page.getByLabel(/パスワード/i);
    await passwordInput.fill(TEST_PASSWORD);

    // ログインボタンをクリック
    const loginButton = page.getByRole('button', { name: 'ログイン', exact: true });
    await loginButton.click();

    // エラーメッセージが表示されることを確認
    const errorMessage = page.getByText(/有効なメールアドレスを入力してください/i);
    await expect(errorMessage).toBeVisible();
  });
});
