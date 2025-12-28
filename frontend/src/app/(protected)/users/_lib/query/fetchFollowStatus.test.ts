import { describe, it, expect, beforeEach, vi } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { FOLLOW_ERROR_MESSAGES } from '@/constants/errorMessages';
import { fetchFollowStatus } from './fetchFollowStatus';

describe('fetchFollowStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('正常系', () => {
    it('フォローの状態を取得できる', async () => {
      const result = await fetchFollowStatus('1');

      expect(result).toEqual({
        is_following: false,
        is_followed_by: true,
      });
    });
  });

  describe('異常系', () => {
    describe('エラーマッピング', () => {
      it('NETWORK_ERROR: ネットワークエラーが発生した場合', async () => {
        server.use(
          http.get('/api/users/:id/follow-status', () => {
            return HttpResponse.json(
              {
                code: 'NETWORK_ERROR',
                error: 'Failed to fetch',
              },
              { status: 503 },
            );
          }),
        );

        await expect(fetchFollowStatus('1')).rejects.toThrow(FOLLOW_ERROR_MESSAGES.NETWORK_ERROR);
      });
    });

    describe('フォールバック', () => {
      it('エラーコードがない場合はUNKNOWN_ERRORを返す', async () => {
        server.use(
          http.get('/api/users/:id/follow-status', () => {
            return HttpResponse.json(
              {
                error: 'Some unknown error',
              },
              { status: 500 },
            );
          }),
        );

        await expect(fetchFollowStatus('1')).rejects.toThrow(FOLLOW_ERROR_MESSAGES.UNKNOWN_ERROR);
      });

      it('不明なエラーコードの場合はUNKNOWN_ERRORを返す', async () => {
        server.use(
          http.get('/api/users/:id/follow-status', () => {
            return HttpResponse.json(
              {
                code: 'SOME_UNKNOWN_CODE',
                error: 'Unknown error',
              },
              { status: 500 },
            );
          }),
        );

        await expect(fetchFollowStatus('1')).rejects.toThrow(FOLLOW_ERROR_MESSAGES.UNKNOWN_ERROR);
      });
    });

    describe('ネットワークエラー', () => {
      it('fetch自体が失敗した場合にNETWORK_ERRORを返す', async () => {
        server.use(
          http.get('/api/users/:id/follow-status', () => {
            return HttpResponse.error();
          }),
        );

        await expect(fetchFollowStatus('1')).rejects.toThrow(FOLLOW_ERROR_MESSAGES.NETWORK_ERROR);
      });
    });
  });

  describe('ログ出力', () => {
    it('開発環境ではエラー詳細をログ出力する', async () => {
      vi.stubEnv('NODE_ENV', 'development');
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      server.use(
        http.get('/api/users/:id/follow-status', () => {
          return HttpResponse.json(
            {
              code: 'UNKNOWN_ERROR',
              error: 'error',
            },
            { status: 422 },
          );
        }),
      );

      await expect(fetchFollowStatus('1')).rejects.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Users API Error:', {
        status: 422,
        data: {
          code: 'UNKNOWN_ERROR',
          error: 'error',
        },
      });

      consoleErrorSpy.mockRestore();
      vi.unstubAllEnvs();
    });

    it('本番環境ではエラー詳細をログ出力しない', async () => {
      vi.stubEnv('NODE_ENV', 'production');
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      server.use(
        http.get('/api/users/:id/follow-status', () => {
          return HttpResponse.json(
            {
              code: 'UNKNOWN_ERROR',
              error: 'error',
            },
            { status: 422 },
          );
        }),
      );

      await expect(fetchFollowStatus('1')).rejects.toThrow();

      expect(consoleErrorSpy).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
      vi.unstubAllEnvs();
    });
  });
});
