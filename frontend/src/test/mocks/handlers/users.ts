import { createMockUser, createMockBook, createMockList } from '@/test/factories';
import { createTestUuid } from '@/test/helpers';
import { http, HttpResponse } from 'msw';

/**
 * ユーザー関連のAPIモックハンドラー
 *
 * エラーレスポンスの形式:
 * - code: アプリケーション固有のエラーコード（例: "FOLLOW_SELF_ERROR")
 * - message: エラーメッセージ（例: "Cannot follow yourself")
 */
export const usersHandlers = [
  // ユーザー検索
  http.get('/api/users', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');

    if (!query || query.trim() === '') {
      return HttpResponse.json([]);
    }

    // クエリに応じてモックユーザーを返す
    return HttpResponse.json([
      createMockUser({ id: createTestUuid(1), name: `${query} User 1` }),
      createMockUser({ id: createTestUuid(2), name: `${query} User 2` }),
    ]);
  }),

  // ユーザー詳細取得
  http.get('/api/users/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      ...createMockUser({ id: String(id) }),
      stats: {
        books_count: 10,
        lists_count: 5,
        followers_count: 3,
        following_count: 7,
      },
    });
  }),

  // ユーザーの本一覧
  http.get('/api/users/:id/books', () => {
    return HttpResponse.json([
      createMockBook({ id: createTestUuid(1), title: 'ユーザーの本1' }),
      createMockBook({ id: createTestUuid(2), title: 'ユーザーの本2' }),
    ]);
  }),

  // ユーザーのリスト一覧
  http.get('/api/users/:id/lists', () => {
    return HttpResponse.json([
      createMockList({ id: createTestUuid(1), name: 'ユーザーのリスト1', books_count: 3 }),
      createMockList({ id: createTestUuid(2), name: 'ユーザーのリスト2', books_count: 5 }),
    ]);
  }),

  // フォローリクエスト（成功）
  http.post('/api/users/:id/follow', () => {
    return HttpResponse.json({ message: 'Followed successfully' }, { status: 201 });
  }),

  // アンフォローリクエスト（成功）
  http.delete('/api/users/:id/follow', () => {
    return HttpResponse.json({ message: 'Unfollowed successfully' }, { status: 200 });
  }),

  // フォロー状態取得
  http.get('/api/users/:id/follow-status', () => {
    return HttpResponse.json({
      is_following: false,
      is_followed_by: true,
    });
  }),

  // フォロー中一覧
  http.get('/api/users/:id/following', () => {
    return HttpResponse.json([createMockUser()]);
  }),

  // フォロワー一覧
  http.get('/api/users/:id/followers', () => {
    return HttpResponse.json([createMockUser()]);
  }),
];
