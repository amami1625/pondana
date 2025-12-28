import { describe, it, expect, vi, beforeEach } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { createTestUuid } from '@/test/helpers';
import { LISTS_ERROR_MESSAGES } from '@/constants/errorMessages';
import { updateList, UpdateListData } from './updateList';

describe('updateList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockUpdateData: UpdateListData = {
    id: createTestUuid(1),
    name: '更新されたリスト',
    description: '更新された説明',
    public: false,
  };

  describe('成功時', () => {
    it('リストを更新できる', async () => {
      server.use(
        http.put('/api/lists/:id', () => {
          return HttpResponse.json({
            id: createTestUuid(1),
            name: '更新されたリスト',
            description: '更新された説明',
            user_id: 1,
            public: false,
            created_at: '2025-01-01T00:00:00Z',
            updated_at: '2025-01-02T00:00:00Z',
          });
        }),
      );

      const result = await updateList(mockUpdateData);

      expect(result.name).toBe('更新されたリスト');
      expect(result.description).toBe('更新された説明');
      expect(result.public).toBe(false);
    });
  });

  describe('エラー時', () => {
    it('404エラー時に適切なエラーメッセージをスローする', async () => {
      server.use(
        http.put('/api/lists/:id', () => {
          return HttpResponse.json({ error: 'Not Found' }, { status: 404 });
        }),
      );

      await expect(updateList(mockUpdateData)).rejects.toThrow(LISTS_ERROR_MESSAGES.NOT_FOUND);
    });

    it('500エラー時にデフォルトエラーメッセージをスローする', async () => {
      server.use(
        http.put('/api/lists/:id', () => {
          return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
        }),
      );

      await expect(updateList(mockUpdateData)).rejects.toThrow(LISTS_ERROR_MESSAGES.UNKNOWN_ERROR);
    });

    it('ネットワークエラー時にエラーをスローする', async () => {
      server.use(
        http.put('/api/lists/:id', () => {
          return HttpResponse.error();
        }),
      );

      await expect(updateList(mockUpdateData)).rejects.toThrow(LISTS_ERROR_MESSAGES.NETWORK_ERROR);
    });
  });

  describe('Zod バリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.put('/api/lists/:id', () => {
          return HttpResponse.json({ invalid: 'invalid-data' });
        }),
      );

      await expect(updateList(mockUpdateData)).rejects.toThrow();
    });
  });
});
