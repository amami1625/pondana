/**
 * トップページからの主要ナビゲーションE2Eテスト
 *
 * このテストでは以下を確認します：
 * 1. ログイン後のトップページから各主要ページへの遷移
 * 2. 各ページが正しく表示されること
 * 3. 実際のユーザー動線を再現
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

test.describe('トップページからの主要ナビゲーション', () => {
  // 各テストの前にログイン
  test.beforeEach(async ({ page }) => {
    // ログイン処理
    await page.goto('/login');

    await page.getByLabel(/メールアドレス/i).fill(TEST_EMAIL);
    await page.getByLabel(/パスワード/i).fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /ログイン/i }).click();

    // トップページへの遷移を待機
    await page.waitForURL(/.*top/, { timeout: 10000 });
  });

  test('書籍一覧ページへ遷移できる', async ({ page }) => {
    // 書籍一覧へのリンクをクリック
    const booksLink = page.getByRole('link', { name: /本棚/i });
    await booksLink.click();

    // 書籍一覧ページへの遷移を待機
    await page.waitForURL(/.*books/);

    // URLとコンテンツの両方を確認
    await expect(page).toHaveURL(/.*books/);
    // ページタイトルが表示されるのを待機
    await expect(page.getByRole('heading', { level: 1, name: /本棚/i })).toBeVisible({ timeout: 10000 });
  });

  test('リスト一覧ページへ遷移できる', async ({ page }) => {
    // リスト一覧へのリンクをクリック
    const listsLink = page.getByRole('link', { name: /リスト/i });
    await listsLink.click();

    // リスト一覧ページへの遷移を待機
    await page.waitForURL(/.*lists/);

    // URLとコンテンツの両方を確認
    await expect(page).toHaveURL(/.*lists/);
    // ページタイトルが表示されるのを待機
    await expect(page.getByRole('heading', { level: 1, name: /リスト一覧/i })).toBeVisible({ timeout: 10000 });
  });

  test('カード一覧ページへ遷移できる', async ({ page }) => {
    // カード一覧へのリンクをクリック
    const cardsLink = page.getByRole('link', { name: /カード/i });
    await cardsLink.click();

    // カード一覧ページへの遷移を待機
    await page.waitForURL(/.*cards/);

    // URLとコンテンツの両方を確認
    await expect(page).toHaveURL(/.*cards/);
    // ページタイトルが表示されるのを待機
    await expect(page.getByRole('heading', { level: 1, name: /カード一覧/i })).toBeVisible({ timeout: 10000 });
  });

  test('ユーザー検索ページへ遷移できる', async ({ page }) => {
    // ユーザー検索へのリンクをクリック
    const usersLink = page.getByRole('link', { name: /ユーザーを検索/i });
    await usersLink.click();

    // ユーザー検索ページへの遷移を待機
    await page.waitForURL(/.*users/);

    // URLとコンテンツの両方を確認
    await expect(page).toHaveURL(/.*users/);
    // ページタイトルが表示されるのを待機
    await expect(page.getByRole('heading', { level: 1, name: /ユーザー検索/i })).toBeVisible({ timeout: 10000 });
  });

  test('設定ページへ遷移できる', async ({ page }) => {
    // 設定へのリンクをクリック
    const settingsLink = page.getByRole('link', { name: /設定/i });
    await settingsLink.click();

    // 設定ページへの遷移を待機
    await page.waitForURL(/.*settings/);

    // URLとコンテンツの両方を確認
    await expect(page).toHaveURL(/.*settings/);
    // ページタイトルが表示されるのを待機
    await expect(page.getByRole('heading', { level: 1, name: /設定/i })).toBeVisible({ timeout: 10000 });
  });
});
