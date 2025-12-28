import { describe, it, expect, beforeEach, vi } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { FOLLOW_ERROR_MESSAGES } from '@/constants/errorMessages';
import { unfollowUser } from './unfollowUser';

describe('unfollowUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('正常系', () => {
    it('アンフォローリクエストが成功する', async () => {
      const result = await unfollowUser('1');

      expect(result).toEqual({ message: 'Unfollowed successfully' });
    });
  });

  describe('異常系', () => {
    describe('エラーコードマッピング', () => {
      it('NOT_FOLLOWING: フォローしていないユーザーをアンフォローしようとした場合', async () => {
        server.use(
          http.delete('/api/users/:id/follow', () => {
            return HttpResponse.json(
              {
                code: 'NOT_FOLLOWING',
                error: 'Not following this user',
              },
              { status: 404 },
            );
          }),
        );

        await expect(unfollowUser('1')).rejects.toThrow(FOLLOW_ERROR_MESSAGES.NOT_FOLLOWING);
      });

      it('NETWORK_ERROR: ネットワークエラーが発生した場合', async () => {
        server.use(
          http.delete('/api/users/:id/follow', () => {
            return HttpResponse.json(
              {
                code: 'NETWORK_ERROR',
                error: 'Failed to fetch',
              },
              { status: 503 },
            );
          }),
        );

        await expect(unfollowUser('1')).rejects.toThrow(FOLLOW_ERROR_MESSAGES.NETWORK_ERROR);
      });
    });

    describe('フォールバック', () => {
      it('エラーコードがない場合はUNKNOWN_ERRORを返す', async () => {
        server.use(
          http.delete('/api/users/:id/follow', () => {
            return HttpResponse.json(
              {
                error: 'Some unknown error',
              },
              { status: 500 },
            );
          }),
        );

        await expect(unfollowUser('1')).rejects.toThrow(FOLLOW_ERROR_MESSAGES.UNKNOWN_ERROR);
      });

      it('不明なエラーコードの場合はUNKNOWN_ERRORを返す', async () => {
        server.use(
          http.delete('/api/users/:id/follow', () => {
            return HttpResponse.json(
              {
                code: 'SOME_UNKNOWN_CODE',
                error: 'Unknown error',
              },
              { status: 500 },
            );
          }),
        );

        await expect(unfollowUser('1')).rejects.toThrow(FOLLOW_ERROR_MESSAGES.UNKNOWN_ERROR);
      });
    });

    describe('ネットワークエラー', () => {
      it('fetch自体が失敗した場合にNETWORK_ERRORを返す', async () => {
        server.use(
          http.delete('/api/users/:id/follow', () => {
            return HttpResponse.error();
          }),
        );

        await expect(unfollowUser('1')).rejects.toThrow(FOLLOW_ERROR_MESSAGES.NETWORK_ERROR);
      });
    });
  });

  describe('開発環境でのログ出力', () => {
    it('開発環境ではエラー詳細をログ出力する', async () => {
      vi.stubEnv('NODE_ENV', 'development');
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      server.use(
        http.delete('/api/users/:id/follow', () => {
          return HttpResponse.json(
            {
              code: 'NOT_FOLLOWING',
              error: 'Not following this user',
            },
            { status: 404 },
          );
        }),
      );

      await expect(unfollowUser('1')).rejects.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Users API Error:', {
        status: 404,
        data: {
          code: 'NOT_FOLLOWING',
          error: 'Not following this user',
        },
      });

      consoleErrorSpy.mockRestore();
      vi.unstubAllEnvs();
    });

    it('本番環境ではエラー詳細をログ出力しない', async () => {
      vi.stubEnv('NODE_ENV', 'production');
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      server.use(
        http.delete('/api/users/:id/follow', () => {
          return HttpResponse.json(
            {
              code: 'NOT_FOLLOWING',
              error: 'Not following this user',
            },
            { status: 404 },
          );
        }),
      );

      await expect(unfollowUser('1')).rejects.toThrow();

      expect(consoleErrorSpy).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
      vi.unstubAllEnvs();
    });
  });
});
