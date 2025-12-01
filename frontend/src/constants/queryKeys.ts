export const queryKeys = {
  categories: {
    all: ['categories'] as const, // 一覧取得用
  },
  tags: {
    all: ['tags'] as const, // 一覧取得用
  },
  authors: {
    all: ['authors'] as const, // 一覧取得用
  },
  lists: {
    all: ['lists'] as const, // 一覧取得用
    detail: (id: number) => ['lists', 'detail', id] as const, // 詳細取得用
  },
  books: {
    all: ['books'] as const, // 一覧取得用
    detail: (id: number) => ['books', 'detail', id] as const, // 詳細取得用
  },
  cards: {
    all: ['cards'] as const, // 一覧取得用
    detail: (id: number) => ['cards', 'detail', id] as const, // 詳細取得用
  },
  profile: {
    all: ['profile'] as const, // 自分のプロフィール取得用
  },
  top: {
    all: ['top'] as const, // トップページデータ取得用
  },
} as const;
