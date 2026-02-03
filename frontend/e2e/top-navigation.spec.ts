/**
 * トップページからの主要ナビゲーションE2Eテスト
 *
 * このテストでは以下を確認します：
 * 1. ログイン後のトップページから各主要ページへの遷移
 * 2. 各ページが正しく表示されること
 * 3. 実際のユーザー動線を再現
 */
import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test.describe('トップページからの主要ナビゲーション', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('書籍一覧ページへ遷移できる', async ({ page }) => {
    // 書籍一覧へのリンクをクリック
    const booksLink = page.getByRole('link', { name: /本棚/i });
    await booksLink.click();

    // 書籍一覧ページへの遷移を待機
    await page.waitForURL(/.*books/);

    // URLを確認
    await expect(page).toHaveURL(/.*books/);
  });

  test('リスト一覧ページへ遷移できる', async ({ page }) => {
    // リスト一覧へのリンクをクリック
    const listsLink = page.getByRole('link', { name: /リスト/i });
    await listsLink.click();

    // リスト一覧ページへの遷移を待機
    await page.waitForURL(/.*lists/);

    // URLを確認
    await expect(page).toHaveURL(/.*lists/);
  });

  test('カード一覧ページへ遷移できる', async ({ page }) => {
    // カード一覧へのリンクをクリック
    const cardsLink = page.getByRole('link', { name: /カード/i });
    await cardsLink.click();

    // カード一覧ページへの遷移を待機
    await page.waitForURL(/.*cards/);

    // URLを確認
    await expect(page).toHaveURL(/.*cards/);
  });

  test('ユーザー検索ページへ遷移できる', async ({ page }) => {
    // ユーザー検索へのリンクをクリック
    const usersLink = page.getByRole('link', { name: /ユーザーを検索/i });
    await usersLink.click();

    // ユーザー検索ページへの遷移を待機
    await page.waitForURL(/.*users/);

    // URLを確認
    await expect(page).toHaveURL(/.*users/);
  });

  test('設定ページへ遷移できる', async ({ page }) => {
    // 設定へのリンクをクリック
    const settingsLink = page.getByRole('link', { name: /設定/i });
    await settingsLink.click();

    // 設定ページへの遷移を待機
    await page.waitForURL(/.*settings/);

    // URLを確認
    await expect(page).toHaveURL(/.*settings/);
  });

  test('ダッシュボードへ遷移できる', async ({ page }) => {
    // ダッシュボードへのリンクをクリック
    const dashboardLink = page.getByRole('link', { name: /ダッシュボード/i });
    await dashboardLink.click();

    // ダッシュボードへの遷移を待機
    await page.waitForURL(/.*dashboard/);

    // URL を確認
    await expect(page).toHaveURL(/.*dashboard/);
  });
});
