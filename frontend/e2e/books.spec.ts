/**
 * 書籍管理機能のE2Eテスト
 *
 * このテストでは以下を確認します：
 * 1. 書籍一覧ページの表示と操作
 * 2. 書籍検索ページの表示
 * 3. 書籍詳細ページの表示と操作（編集）
 *
 * 注意: Google Books APIを使用する検索機能のテストは、
 * CIでのAPIキー制限の問題を避けるため含めていません
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

test.describe('書籍一覧ページ', () => {
  test.beforeEach(async ({ page }) => {
    // ログイン処理
    await page.goto('/login');
    await page.getByLabel(/メールアドレス/i).fill(TEST_EMAIL);
    await page.getByLabel(/パスワード/i).fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'ログイン', exact: true }).click();
    await page.waitForURL(/.*top/, { timeout: 10000 });

    // 書籍一覧ページへ遷移
    await page.goto('/books');
  });

  test('書籍一覧ページが正しく表示される', async ({ page }) => {
    // ページタイトルを確認
    await expect(page.getByRole('heading', { name: /本棚/i })).toBeVisible();

    // 説明テキストを確認
    await expect(page.getByText(/登録した本を管理できます/i)).toBeVisible();

    // "本を追加" ボタンが表示される
    await expect(page.getByRole('link', { name: /本を追加/i })).toBeVisible();
  });

  test('「本を追加」ボタンから書籍検索ページへ遷移できる', async ({ page }) => {
    const addBookLink = page.getByRole('link', { name: /本を追加/i });
    await addBookLink.click();

    await page.waitForURL(/.*books\/search/);
    await expect(page).toHaveURL(/.*books\/search/);
  });
});

test.describe('書籍検索ページ', () => {
  test.beforeEach(async ({ page }) => {
    // ログイン処理
    await page.goto('/login');
    await page.getByLabel(/メールアドレス/i).fill(TEST_EMAIL);
    await page.getByLabel(/パスワード/i).fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'ログイン', exact: true }).click();
    await page.waitForURL(/.*top/, { timeout: 10000 });

    // 書籍検索ページへ遷移
    await page.goto('/books/search');
  });

  test('書籍検索ページが正しく表示される', async ({ page }) => {
    // ページタイトルを確認
    await expect(page.getByRole('heading', { name: /書籍検索/i })).toBeVisible();

    // 説明テキストを確認
    await expect(page.getByText(/書籍名、著者名で検索して、書籍を登録できます/i)).toBeVisible();

    // 検索入力フィールドが表示される
    await expect(page.getByPlaceholder(/書籍名、著者名で検索/i)).toBeVisible();

    // "使い方" ボタンが表示される
    await expect(page.getByRole('button', { name: /使い方/i })).toBeVisible();
  });

  test('「使い方」ボタンでガイドモーダルが表示される', async ({ page }) => {
    const usageButton = page.getByRole('button', { name: /使い方/i });
    await usageButton.click();

    // モーダルが表示されることを確認
    await expect(page.getByText(/検索ボックスに書籍名/i)).toBeVisible();
  });
});

test.describe('書籍詳細ページ', () => {
  test.beforeEach(async ({ page }) => {
    // ログイン処理
    await page.goto('/login');
    await page.getByLabel(/メールアドレス/i).fill(TEST_EMAIL);
    await page.getByLabel(/パスワード/i).fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'ログイン', exact: true }).click();
    await page.waitForURL(/.*top/, { timeout: 10000 });

    // 書籍一覧ページへ遷移
    await page.goto('/books');
  });

  test('書籍一覧から詳細ページへ遷移できる', async ({ page }) => {
    // 書籍カードのリンクをクリック（最初の書籍）
    const bookDetailLink = page.locator('[aria-label="書籍の詳細を表示"]').first();

    // 書籍が存在する場合のみテスト
    const bookExists = (await bookDetailLink.count()) > 0;
    if (bookExists) {
      await bookDetailLink.click();

      // 詳細ページへの遷移を確認
      await page.waitForURL(/.*books\/[a-f0-9-]+/);
      await expect(page).toHaveURL(/.*books\/[a-f0-9-]+/);

      // 詳細ページの要素を確認
      await expect(page.getByRole('button', { name: /編集/i })).toBeVisible();
    } else {
      // 書籍がない場合はEmptyStateを確認
      await expect(page.getByText(/本が登録されていません/i)).toBeVisible();
    }
  });

  test('書籍詳細ページで編集モーダルが開ける', async ({ page }) => {
    // 書籍カードのリンクをクリック（最初の書籍）
    const bookDetailLink = page.locator('[aria-label="書籍の詳細を表示"]').first();

    const bookExists = (await bookDetailLink.count()) > 0;
    if (bookExists) {
      await bookDetailLink.click();
      await page.waitForURL(/.*books\/[a-f0-9-]+/);

      // 編集ボタンをクリック
      const editButton = page.getByRole('button', { name: /編集/i });
      await editButton.click();

      // 編集モーダルが表示されることを確認
      await expect(page.getByText(/本を編集/i)).toBeVisible();

      // フォーム要素が表示されることを確認
      await expect(page.getByLabel(/ステータス/i)).toBeVisible();
      await expect(page.getByLabel(/評価/i)).toBeVisible();
    }
  });

  test('書籍詳細ページでタブ切り替えができる', async ({ page }) => {
    // 書籍カードのリンクをクリック（最初の書籍）
    const bookDetailLink = page.locator('[aria-label="書籍の詳細を表示"]').first();

    const bookExists = (await bookDetailLink.count()) > 0;
    if (bookExists) {
      await bookDetailLink.click();
      await page.waitForURL(/.*books\/[a-f0-9-]+/);

      // "この本が追加されているリスト" タブが存在することを確認
      const listsTab = page.getByRole('button', { name: /この本が追加されているリスト/i });
      await expect(listsTab).toBeVisible();

      // "作成されたカード" タブをクリック
      const cardsTab = page.getByRole('button', { name: /作成されたカード/i });
      await cardsTab.click();

      // タブがアクティブになることを確認（スタイルの変化）
      await expect(cardsTab).toHaveClass(/text-primary/);
    }
  });
});

test.describe('書籍の編集フロー', () => {
  test.beforeEach(async ({ page }) => {
    // ログイン処理
    await page.goto('/login');
    await page.getByLabel(/メールアドレス/i).fill(TEST_EMAIL);
    await page.getByLabel(/パスワード/i).fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'ログイン', exact: true }).click();
    await page.waitForURL(/.*top/, { timeout: 10000 });
  });

  test('書籍のステータスを変更できる', async ({ page }) => {
    // 書籍一覧ページへ遷移
    await page.goto('/books');

    // 書籍カードのリンクをクリック（最初の書籍）
    const bookDetailLink = page.locator('[aria-label="書籍の詳細を表示"]').first();

    const bookExists = (await bookDetailLink.count()) > 0;
    if (bookExists) {
      await bookDetailLink.click();
      await page.waitForURL(/.*books\/[a-f0-9-]+/);

      // 編集ボタンをクリック
      await page.getByRole('button', { name: /編集/i }).click();

      // 編集モーダルが表示されるまで待機
      await expect(page.getByText(/本を編集/i)).toBeVisible();

      // ステータスを変更
      const statusSelect = page.getByLabel(/ステータス/i);
      await statusSelect.selectOption({ label: '読書中' });

      // 更新ボタンをクリック
      await page.getByRole('button', { name: '更新', exact: true }).click();

      // 成功トーストが表示されることを確認
      await expect(page.getByText(/本を更新しました/i)).toBeVisible();
    }
  });
});
