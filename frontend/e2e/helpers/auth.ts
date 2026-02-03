import type { Page } from '@playwright/test';

const TEST_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD;

if (!TEST_EMAIL || !TEST_PASSWORD) {
  throw new Error(
    'E2Eテストの実行には環境変数 TEST_USER_EMAIL と TEST_USER_PASSWORD の設定が必要です。\n' +
      'ローカル環境: export TEST_USER_EMAIL="..." && export TEST_USER_PASSWORD="..."\n' +
      'CI環境: Repository Secrets に設定してください。',
  );
}

/**
 * テストユーザーでログインする
 */
export async function login(page: Page) {
  await page.goto('/login');
  await page.getByLabel(/メールアドレス/i).fill(TEST_EMAIL!);
  await page.getByLabel(/パスワード/i).fill(TEST_PASSWORD!);
  await page.getByRole('button', { name: 'ログイン', exact: true }).click();
  await page.waitForURL(/.*top/, { timeout: 10000 });
}
