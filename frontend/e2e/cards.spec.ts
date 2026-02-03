import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test.describe('カード一覧ページ', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/cards');
  });

  test('カード一覧ページが正しく表示される', async ({ page }) => {
    // ページタイトルを確認
    await expect(page.getByRole('heading', { name: /カード一覧/i })).toBeVisible();
  });

  test('書籍グループの展開・折りたたみができる', async ({ page }) => {
    const cardExpandButton = page.getByTestId('expand').first();
    const groupExists = (await cardExpandButton.count()) > 0;

    if (groupExists) {
      // 展開ボタンをクリック
      await cardExpandButton.click();
      await expect(cardExpandButton).toHaveAttribute('aria-expanded', 'true');

      // カードが存在する場合は詳細リンク、存在しない場合はメッセージを確認
      const detailLink = page.getByRole('link', { name: /詳細/i }).first();
      const emptyMessage = page.getByText(/この本にはまだカードが登録されていません/i);
      await expect(detailLink.or(emptyMessage)).toBeVisible();

      // 再度クリックで折りたたみ
      await cardExpandButton.click();
      await expect(cardExpandButton).toHaveAttribute('aria-expanded', 'false');
    } else {
      // グループ自体が存在しない場合
      await expect(page.getByText(/カードが登録されていません/i)).toBeVisible();
    }
  });

  test('「カードを作成」ボタンでモーダルが開ける', async ({ page }) => {
    const createCardButton = page.getByRole('button', { name: /カードを作成/i }).first();
    const buttonExists = (await createCardButton.count()) > 0;

    if (buttonExists) {
      await createCardButton.click();
      // モーダルのタイトルを確認
      await expect(page.getByRole('heading', { name: /カードを作成/i })).toBeVisible();
    } else {
      // 書籍が存在しない場合
      await expect(page.getByText(/カードが登録されていません/i)).toBeVisible();
    }
  });
});

test.describe('カード詳細ページ', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/cards');
  });

  test('カード一覧から詳細ページへ遷移できる', async ({ page }) => {
    const cardExpandButton = page.getByTestId('expand').first();
    const groupExists = (await cardExpandButton.count()) > 0;

    if (groupExists) {
      await cardExpandButton.click();

      const cardDetailLink = page.getByRole('link', { name: /詳細/i }).first();
      const emptyMessage = page.getByText(/この本にはまだカードが登録されていません/i);

      // カードが存在する場合のみ詳細ページへ遷移
      if ((await cardDetailLink.count()) > 0) {
        await cardDetailLink.waitFor({ state: 'visible' });
        await cardDetailLink.click();

        await page.waitForURL(/.*cards\/[a-f0-9-]+/);
        await expect(page).toHaveURL(/.*cards\/[a-f0-9-]+/);
      } else {
        // カードが存在しない場合はメッセージを確認
        await expect(emptyMessage).toBeVisible();
      }
    } else {
      await expect(page.getByText(/カードが登録されていません/i)).toBeVisible();
    }
  });

  test('カード詳細ページで編集モーダルが開ける', async ({ page }) => {
    const cardExpandButton = page.getByTestId('expand').first();
    const groupExists = (await cardExpandButton.count()) > 0;

    if (groupExists) {
      await cardExpandButton.click();

      const cardDetailLink = page.getByRole('link', { name: /詳細/i }).first();
      const emptyMessage = page.getByText(/この本にはまだカードが登録されていません/i);

      if ((await cardDetailLink.count()) > 0) {
        await cardDetailLink.waitFor({ state: 'visible' });
        await cardDetailLink.click();
        await page.waitForURL(/.*cards\/[a-f0-9-]+/);

        // 編集ボタンをクリック
        const editButton = page.getByRole('button', { name: /編集/i });
        await editButton.click();

        // 編集モーダルが表示されることを確認
        await expect(page.getByText(/カードを更新/i)).toBeVisible();

        // フォーム要素が表示されることを確認
        await expect(page.getByLabel(/タイトル/i)).toBeVisible();
        await expect(page.getByLabel(/本文/i)).toBeVisible();
      } else {
        await expect(emptyMessage).toBeVisible();
      }
    }
  });
});

test.describe('カードの編集フロー', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/cards');
  });

  test('カードの詳細を変更できる', async ({ page }) => {
    const cardExpandButton = page.getByTestId('expand').first();
    const groupExists = (await cardExpandButton.count()) > 0;

    if (groupExists) {
      await cardExpandButton.click();

      const cardDetailLink = page.getByRole('link', { name: /詳細/i }).first();
      const emptyMessage = page.getByText(/この本にはまだカードが登録されていません/i);

      if ((await cardDetailLink.count()) > 0) {
        await cardDetailLink.waitFor({ state: 'visible' });
        await cardDetailLink.click();
        await page.waitForURL(/.*cards\/[a-f0-9-]+/);

        // 編集ボタンをクリック
        await page.getByRole('button', { name: /編集/i }).click();

        // 編集モーダルが表示されることを確認
        await expect(page.getByText(/カードを更新/i)).toBeVisible();

        // カード本文を変更
        const textArea = page.getByLabel(/本文/i);
        await textArea.fill('E2Eテストです');

        // 更新ボタンをクリック
        await page.getByRole('button', { name: '更新', exact: true }).click();

        // 成功トーストが表示されていることを確認
        await expect(page.getByText(/カードを更新しました/i)).toBeVisible();
      } else {
        await expect(emptyMessage).toBeVisible();
      }
    }
  });
});
