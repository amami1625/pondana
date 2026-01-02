/**
 * 利用規約、プライバシーポリシーページのE2Eテスト
 */
import { test, expect } from '@playwright/test';

test.describe('利用規約', () => {
  test('フッターから利用規約ページにアクセスできる', async ({ page }) => {
    await page.goto('/');

    const termsLink = page.getByRole('link', { name: /利用規約/i });
    await termsLink.click();

    // URLとコンテンツの両方を確認
    await expect(page).toHaveURL(/.*terms/);
    await expect(page.getByRole('heading', { level: 1, name: /利用規約/i })).toBeVisible();
  });
});

test.describe('プライバシーポリシー', () => {
  test('フッターからプライバシーポリシーページにアクセスできる', async ({ page }) => {
    await page.goto('/');

    const policyLink = page.getByRole('link', { name: /プライバシーポリシー/i });
    await policyLink.click();

    // URLとコンテンツの両方を確認
    await expect(page).toHaveURL(/.*privacy/);
    await expect(
      page.getByRole('heading', { level: 1, name: /プライバシーポリシー/i }),
    ).toBeVisible();
  });
});
