import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// .env.test ファイルから環境変数を読み込む（テスト用の認証情報など）
dotenv.config({ path: path.resolve(__dirname, '.env.test') });

/**
 * Playwright E2E テスト設定
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // テストファイルが格納されているディレクトリ
  testDir: './e2e',

  // テストを並列実行するかどうか（true = 高速化）
  fullyParallel: true,

  // CI環境では test.only() を禁止（全テストを実行する必要があるため）
  forbidOnly: !!process.env.CI,

  // テスト失敗時のリトライ回数（CI環境では2回、ローカルでは0回）
  retries: process.env.CI ? 2 : 0,

  // 並列実行するワーカー数（認証状態の干渉を防ぐため常に1）
  workers: 1,

  // テスト結果のレポート形式（html = ブラウザで見やすいレポート）
  reporter: 'html',

  use: {
    // テスト内で page.goto('/') とした時のベースURL
    baseURL: 'http://localhost:3001',

    // トレース記録のタイミング（最初の失敗時のリトライで記録）
    trace: 'on-first-retry',

    // スクリーンショットを撮るタイミング（失敗時のみ）
    screenshot: 'only-on-failure',
  },

  // テストするブラウザの設定（複数指定可能）
  projects: [
    {
      name: 'chromium', // Chrome/Edgeブラウザでテスト
      use: { ...devices['Desktop Chrome'] },
    },
    // 他のブラウザを追加する場合はここに記述
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  // テスト実行前に開発サーバーを自動起動する設定
  webServer: {
    // 実行するコマンド
    command: 'npm run dev',

    // サーバーが起動したかチェックするURL
    url: 'http://localhost:3001',

    // ローカル環境では既存のサーバーを再利用（CI環境では新規起動）
    reuseExistingServer: !process.env.CI,

    // サーバー起動のタイムアウト（ミリ秒）
    timeout: 120000,
  },
});
