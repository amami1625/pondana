import { createMockUser } from '@/test/factories';
import { http, HttpResponse } from 'msw';

/**
 * ユーザー関連のAPIモックハンドラー
 *
 * エラーレスポンスの形式:
 * - code: アプリケーション固有のエラーコード（例: "FOLLOW_SELF_ERROR"）
 * - message: エラーメッセージ（例: "Cannot follow yourself"）
 */
export const usersHandlers = [
  // フォローリクエスト（成功）
  http.post('/api/users/:id/follow', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({ message: 'Followed successfully' }, { status: 201 });
  }),

  // アンフォローリクエスト（成功）
  http.delete('/api/users/:id/follow', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({ message: 'Unfollowed successfully' }, { status: 200 });
  }),

  // フォロー状態取得
  http.get('/api/users/:id/follow-status', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      is_following: false,
      is_followed_by: true,
    });
  }),

  // フォロー中一覧
  http.get('/api/users/:id/following', ({ params }) => {
    const { id } = params;
    return HttpResponse.json([createMockUser()]);
  }),

  // フォロワー一覧
  http.get('/api/users/:id/followers', ({ params }) => {
    const { id } = params;
    return HttpResponse.json([createMockUser()]);
  }),
];
