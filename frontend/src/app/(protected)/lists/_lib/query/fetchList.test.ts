import { describe, it, expect } from 'vitest';
import { createMockList } from '@/test/factories';
import { createTestUuid } from '@/test/helpers';
import { fetchList } from './fetchList';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { LISTS_ERROR_MESSAGES } from '@/constants/errorMessages';

describe('fetchList', () => {
  describe('成功時', () => {
    it('リスト詳細データを正しく取得できる', async () => {
      const result = await fetchList('1');

      expect(result.id).toBe(createTestUuid(1));
      expect(result.name).toBe('テストリスト');
    });

    it('異なるIDで正しくリクエストできる', async () => {
      server.use(
        http.get('/api/lists/:id', ({ params }) => {
          const { id } = params;
          return HttpResponse.json(
            createMockList({ id: createTestUuid(Number(id)), name: '別のリスト' }),
            { status: 200 },
          );
        }),
      );

      const result = await fetchList('42');

      expect(result.id).toBe(createTestUuid(42));
      expect(result.name).toBe('別のリスト');
    });
  });

  describe('エラー時', () => {
    it('404エラー時に適切なエラーメッセージをスローする', async () => {
      server.use(
        http.get('/api/lists/:id', () => {
          return HttpResponse.json({ error: 'Not Found' }, { status: 404 });
        }),
      );

      await expect(fetchList('1')).rejects.toThrow(LISTS_ERROR_MESSAGES.NOT_FOUND);
    });

    it('500エラー時にデフォルトエラーメッセージをスローする', async () => {
      server.use(
        http.get('/api/lists/:id', () => {
          return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
        }),
      );

      await expect(fetchList('1')).rejects.toThrow(LISTS_ERROR_MESSAGES.UNKNOWN_ERROR);
    });

    it('ネットワークエラー時にエラーをスローする', async () => {
      server.use(
        http.get('/api/lists/:id', () => {
          return HttpResponse.error();
        }),
      );

      await expect(fetchList('1')).rejects.toThrow(LISTS_ERROR_MESSAGES.NETWORK_ERROR);
    });
  });

  describe('Zod バリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.get('/api/lists/:id', () => {
          return HttpResponse.json({ invalid: 'invalid-data' });
        }),
      );

      await expect(fetchList('1')).rejects.toThrow();
    });
  });
});
