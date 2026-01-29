import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test.describe('リスト一覧ページ', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/lists');
  });

  test('リスト一覧ページが正しく表示される', async ({ page }) => {
    // ページタイトルを確認
    await expect(page.getByRole('heading', { name: /リスト一覧/i })).toBeVisible();

    // "リストを新規作成" ボタンが表示される
    await expect(page.getByRole('button', { name: /リストを新規作成/i })).toBeVisible();
  });

  test('「リストを新規作成」ボタンで作成フォームが表示される', async ({ page }) => {
    const createButton = page.getByRole('button', { name: /リストを新規作成/i });
    await createButton.click();

    // フォームが表示されることを確認
    await expect(page.getByText(/リストを作成/i)).toBeVisible();
  });
});

test.describe('リスト詳細ページ', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/lists');
  });

  test('リスト一覧から詳細ページへ遷移できる', async ({ page }) => {
    // リストカードの「詳細」リンクをクリック（最初のリスト）
    const listDetailLink = page.getByRole('link', { name: '詳細' }).first();

    // リストが存在する場合のみテスト
    const listExists = (await listDetailLink.count()) > 0;
    if (listExists) {
      await listDetailLink.click();

      // 詳細ページへの遷移を確認
      await page.waitForURL(/.*lists\/[a-f0-9-]+/);
      await expect(page).toHaveURL(/.*lists\/[a-f0-9-]+/);

      // 詳細ページの要素を確認
      await expect(page.getByRole('button', { name: /編集/i })).toBeVisible();
    } else {
      // リストがない場合は EmptyState を確認
      await expect(page.getByText(/リストが登録されていません/i)).toBeVisible();
    }
  });

  test('リスト詳細ページで編集モーダルが開ける', async ({ page }) => {
    // リストカードの「詳細」リンクをクリック（最初のリスト）
    const listDetailLink = page.getByRole('link', { name: '詳細' }).first();

    const listExists = (await listDetailLink.count()) > 0;
    if (listExists) {
      await listDetailLink.click();
      await page.waitForURL(/.*lists\/[a-f0-9-]+/);

      // 編集ボタンをクリック
      const editButton = page.getByRole('button', { name: /編集/i });
      await editButton.click();

      // 編集モーダルが表示されることを確認
      await expect(page.getByText(/リストを編集/i)).toBeVisible();

      // フォーム要素が表示されることを確認
      await expect(page.getByLabel(/リスト名/i)).toBeVisible();
      await expect(page.getByLabel(/説明/i)).toBeVisible();
    }
  });

  test('リスト詳細ページで「本を追加」モーダルが開ける', async ({ page }) => {
    // リストカードの「詳細」リンクをクリック（最初のリスト）
    const listDetailLink = page.getByRole('link', { name: '詳細' }).first();

    const listExists = (await listDetailLink.count()) > 0;
    if (listExists) {
      await listDetailLink.click();
      await page.waitForURL(/.*lists\/[a-f0-9-]+/);

      // 「本を追加」ボタンをクリック
      const addBookButton = page.getByRole('button', { name: /本を追加/i });
      await addBookButton.click();

      // モーダルが表示されることを確認
      await expect(page.getByText(/本をリストに追加/i)).toBeVisible();

      // 追加ボタンが表示されることを確認
      await expect(page.getByRole('button', { name: /追加/i })).toBeVisible();
    }
  });
});

test.describe('リストの編集フロー', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/lists');
  });

  test('リストの詳細を変更できる', async ({ page }) => {
    // リストカードの「詳細」リンクをクリック（最初のリスト）
    const listDetailLink = page.getByRole('link', { name: '詳細' }).first();

    const listExists = (await listDetailLink.count()) > 0;
    if (listExists) {
      await listDetailLink.click();
      await page.waitForURL(/.*lists\/[a-f0-9-]+/);

      // 編集ボタンをクリック
      await page.getByRole('button', { name: /編集/i }).click();

      // 編集モーダルが表示されるまで待機
      await expect(page.getByText(/リストを編集/)).toBeVisible();

      // リスト説明を変更
      const descriptionArea = page.getByLabel(/説明/i);
      await descriptionArea.fill('E2Eテストです');

      // 更新ボタンをクリック
      await page.getByRole('button', { name: '更新', exact: true }).click();

      // 成功トーストが表示されていることを確認
      await expect(page.getByText(/リストを更新しました/i)).toBeVisible();
    }
  });
});
