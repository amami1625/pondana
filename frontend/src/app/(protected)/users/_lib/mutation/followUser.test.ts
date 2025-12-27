import { describe, it, expect, beforeEach, vi } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { FOLLOW_ERROR_MESSAGES } from '../constants/errorMessages';
import { followUser } from './followUser';

describe('followUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('正常系', () => {
    it('フォローリクエストが成功する', async () => {
      const result = await followUser('1');

      expect(result).toEqual({ message: 'Followed successfully' });
    });
  });

  describe('異常系', () => {
    describe('エラーコードマッピング', () => {
      it('FOLLOW_SELF_ERROR: 自分自身をフォローしようとした場合', async () => {
        server.use(
          http.post('/api/users/:id/follow', () => {
            return HttpResponse.json(
              {
                code: 'FOLLOW_SELF_ERROR',
                error: 'Cannot follow yourself',
              },
              { status: 422 },
            );
          }),
        );

        await expect(followUser('1')).rejects.toThrow(FOLLOW_ERROR_MESSAGES.FOLLOW_SELF_ERROR);
      });

      it('ALREADY_FOLLOWING: 既にフォロー済みの場合', async () => {
        server.use(
          http.post('/api/users/:id/follow', () => {
            return HttpResponse.json(
              {
                code: 'ALREADY_FOLLOWING',
                error: 'Already following this user',
              },
              { status: 422 },
            );
          }),
        );

        await expect(followUser('1')).rejects.toThrow(FOLLOW_ERROR_MESSAGES.ALREADY_FOLLOWING);
      });

      it('NETWORK_ERROR: ネットワークエラーが発生した場合', async () => {
        server.use(
          http.post('/api/users/:id/follow', () => {
            return HttpResponse.json(
              {
                code: 'NETWORK_ERROR',
                error: 'Failed to fetch',
              },
              { status: 503 },
            );
          }),
        );

        await expect(followUser('1')).rejects.toThrow(FOLLOW_ERROR_MESSAGES.NETWORK_ERROR);
      });
    });

    describe('フォールバック', () => {
      it('エラーコードがない場合はUNKNOWN_ERRORを返す', async () => {
        server.use(
          http.post('/api/users/:id/follow', () => {
            return HttpResponse.json(
              {
                error: 'Some unknown error',
              },
              { status: 500 },
            );
          }),
        );

        await expect(followUser('1')).rejects.toThrow(FOLLOW_ERROR_MESSAGES.UNKNOWN_ERROR);
      });

      it('不明なエラーコードの場合はUNKNOWN_ERRORを返す', async () => {
        server.use(
          http.post('/api/users/:id/follow', () => {
            return HttpResponse.json(
              {
                code: 'SOME_UNKNOWN_CODE',
                error: 'Unknown error',
              },
              { status: 500 },
            );
          }),
        );

        await expect(followUser('1')).rejects.toThrow(FOLLOW_ERROR_MESSAGES.UNKNOWN_ERROR);
      });
    });

    describe('ネットワークエラー', () => {
      it('fetch自体が失敗した場合にNETWORK_ERRORを返す', async () => {
        server.use(
          http.post('/api/users/:id/follow', () => {
            return HttpResponse.error();
          }),
        );

        await expect(followUser('1')).rejects.toThrow(FOLLOW_ERROR_MESSAGES.NETWORK_ERROR);
      });
    });
  });

  describe('ログ出力', () => {
    it('開発環境ではエラー詳細をログ出力する', async () => {
      vi.stubEnv('NODE_ENV', 'development');
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      server.use(
        http.post('/api/users/:id/follow', () => {
          return HttpResponse.json(
            {
              code: 'FOLLOW_SELF_ERROR',
              error: 'Cannot follow yourself',
            },
            { status: 422 },
          );
        }),
      );

      await expect(followUser('1')).rejects.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Users API Error:', {
        status: 422,
        data: {
          code: 'FOLLOW_SELF_ERROR',
          error: 'Cannot follow yourself',
        },
      });

      consoleErrorSpy.mockRestore();
      vi.unstubAllEnvs();
    });

    it('本番環境ではエラー詳細をログ出力しない', async () => {
      vi.stubEnv('NODE_ENV', 'production');
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      server.use(
        http.post('/api/users/:id/follow', () => {
          return HttpResponse.json(
            {
              code: 'FOLLOW_SELF_ERROR',
              error: 'Cannot follow yourself',
            },
            { status: 422 },
          );
        }),
      );

      await expect(followUser('1')).rejects.toThrow();

      expect(consoleErrorSpy).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
      vi.unstubAllEnvs();
    });
  });
});
