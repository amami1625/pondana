export const queryKeys = {
  categories: {
    all: ['categories'] as const, // 一覧取得用
  },
  tags: {
    all: ['tags'] as const, // 一覧取得用
  },
  statuses: {
    all: ['statuses'] as const, // 一覧取得用
  },
  lists: {
    all: ['lists'] as const, // 一覧取得用
    detail: (id: string) => ['lists', 'detail', id] as const, // 詳細取得用
  },
  books: {
    all: ['books'] as const, // 一覧取得用
    detail: (id: string) => ['books', 'detail', id] as const, // 詳細取得用
  },
  cards: {
    all: ['cards'] as const, // 一覧取得用
    detail: (id: string) => ['cards', 'detail', id] as const, // 詳細取得用
  },
  profile: {
    all: ['profile'] as const, // 自分のプロフィール取得用
  },
  top: {
    all: ['top'] as const, // トップページデータ取得用
  },
  dashboard: {
    all: ['dashboard'] as const, // ダッシュボードデータ取得用
  },
  users: {
    detail: (id: string) => ['users', 'detail', id] as const, // ユーザー詳細取得用
    books: (id: string) => ['users', 'books', id] as const, // ユーザーの公開本一覧取得用
    lists: (id: string) => ['users', 'lists', id] as const, // ユーザーの公開リスト一覧取得用
    followStatus: (id: string) => ['users', 'followStatus', id] as const, // フォロー状態取得用
    following: (id: string) => ['users', 'following', id] as const, // フォロー中一覧取得用
    followers: (id: string) => ['users', 'followers', id] as const, // フォロワー一覧取得用
  },
} as const;
