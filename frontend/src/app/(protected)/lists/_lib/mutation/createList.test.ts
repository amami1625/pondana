import { describe, it, expect, vi, beforeEach } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { ListFormData } from '@/app/(protected)/lists/_types';
import { LISTS_ERROR_MESSAGES } from '@/constants/errorMessages';
import { createList } from './createList';

describe('createList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockListData: ListFormData = {
    name: 'テストリスト',
    description: 'テスト説明',
    public: true,
  };

  describe('成功時', () => {
    it('リストを作成できる', async () => {
      const result = await createList(mockListData);

      expect(result.name).toBe('テストリスト');
      expect(result.description).toBe('テスト説明');
      expect(result.public).toBe(true);
    });
  });

  describe('エラー時', () => {
    it('404エラー時に適切なエラーメッセージをスローする', async () => {
      server.use(
        http.post('/api/lists', () => {
          return HttpResponse.json({ error: 'Not Found' }, { status: 404 });
        }),
      );

      await expect(createList(mockListData)).rejects.toThrow(LISTS_ERROR_MESSAGES.NOT_FOUND);
    });

    it('500エラー時にデフォルトエラーメッセージをスローする', async () => {
      server.use(
        http.post('/api/lists', () => {
          return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
        }),
      );

      await expect(createList(mockListData)).rejects.toThrow(LISTS_ERROR_MESSAGES.UNKNOWN_ERROR);
    });

    it('ネットワークエラー時にエラーをスローする', async () => {
      server.use(
        http.post('/api/lists', () => {
          return HttpResponse.error();
        }),
      );

      await expect(createList(mockListData)).rejects.toThrow(LISTS_ERROR_MESSAGES.NETWORK_ERROR);
    });
  });

  describe('Zod バリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.post('/api/lists', () => {
          return HttpResponse.json({ invalid: 'invalid-data' });
        }),
      );

      await expect(createList(mockListData)).rejects.toThrow();
    });
  });
});
