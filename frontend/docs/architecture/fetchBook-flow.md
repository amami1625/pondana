# fetchBook データフロー アーキテクチャ

## 概要

このドキュメントは、書籍詳細データを取得する際の処理フローを説明します。
Next.js App Router、TanStack Query、Server Component/Client Componentの連携方法を理解するための参考資料です。

## アーキテクチャ図

sequenceDiagram
participant Browser as "ブラウザ"
participant Page as "Page Component<br/>(Server)"
participant Client as "BookDetailClient<br/>(Client)"
participant Hook as "useBook Hook<br/>(Client)"
participant FetchFn as "fetchBook関数<br/>(Client)"
participant APIRoute as "Next.js API Route<br/>/api/books/[bookId]"
participant DAL as "authenticatedRequest<br/>(Server)"
participant Rails as "Rails API<br/>/books/:id"

    Note over Browser,Rails: 【初回アクセス時】Server Componentでのプリフェッチ

    Browser->>Page: "GET /books/123"
    activate Page

    Page->>Page: "createServerQueryClient()"
    Page->>DAL: "prefetchQuery実行<br/>authenticatedRequest('/books/123', {}, true)"
    activate DAL

    DAL->>DAL: "verifySession() - セッション検証"
    DAL->>Rails: "GET /books/123<br/>Authorization: Bearer {token}"
    activate Rails

    alt "成功 (200)"
        Rails-->>DAL: "{ id: '123', title: '...', ... }"
        DAL-->>Page: "BookDetail データ"
    else "404エラー"
        Rails-->>DAL: "404 Not Found"
        DAL->>DAL: "throwOn404=true なので notFound() 実行"
        DAL-->>Browser: "not-found.tsx を表示"
        Note over Browser: 404ページ表示で終了
    end
    deactivate Rails
    deactivate DAL

    Page->>Page: "dehydrate(queryClient)<br/>キャッシュをシリアライズ"
    Page-->>Browser: "HTML + ハイドレート済みキャッシュ"
    deactivate Page

    Note over Browser,Rails: 【クライアント側での使用】useQueryでキャッシュ取得

    Browser->>Client: "BookDetailClientをマウント"
    activate Client

    Client->>Hook: "useBook('123')"
    activate Hook

    Hook->>Hook: "useQuery({<br/>  queryKey: ['books', '123'],<br/>  queryFn: () => fetchBook('123')<br/>})"

    Note over Hook: キャッシュが存在 & 新鮮<br/>(staleTime: 5分)
    Hook-->>Client: "{ data: book, isLoading: false }"
    deactivate Hook

    Client-->>Browser: "書籍詳細を即座に表示"
    deactivate Client

    Note over Browser,Rails: 【5分後 or キャッシュ無効化時】再フェッチ

    Browser->>Hook: "キャッシュが古くなる (staleTime: 5分経過)"
    activate Hook

    Hook->>FetchFn: "fetchBook('123')"
    activate FetchFn

    FetchFn->>APIRoute: "fetch('/api/books/123')"
    activate APIRoute

    APIRoute->>DAL: "authenticatedRequest('/books/123', {}, false)"
    activate DAL

    DAL->>DAL: "verifySession()"
    DAL->>Rails: "GET /books/123<br/>Authorization: Bearer {token}"
    activate Rails

    alt "成功 (200)"
        Rails-->>DAL: "{ id: '123', title: '...', ... }"
        DAL-->>APIRoute: "データ"
        APIRoute->>APIRoute: "bookDetailSchema.parse(data)"
        APIRoute-->>FetchFn: "NextResponse.json(book)"
        FetchFn->>FetchFn: "bookDetailSchema.parse(data)"
        FetchFn-->>Hook: "BookDetail データ"
        Hook-->>Browser: "画面更新"

    else "404エラー"
        Rails-->>DAL: "404 { error: 'Book not found' }"
        DAL->>DAL: "throwOn404=false なので ApiError をスロー"
        DAL-->>APIRoute: "throw ApiError('Book not found', 404)"
        APIRoute->>APIRoute: "catch (ApiError)"
        APIRoute-->>FetchFn: "{ error: 'Book not found' } (404)"
        FetchFn->>FetchFn: "response.status === 404<br/>throw Error(BOOKS_ERROR_MESSAGES.NOT_FOUND)"
        FetchFn-->>Hook: "throw Error('本の取得に失敗しました')"
        Hook-->>Browser: "Error Boundaryで表示"

    else "500エラー"
        Rails-->>DAL: "500 { error: 'Internal Server Error' }"
        DAL-->>APIRoute: "throw ApiError('...', 500)"
        APIRoute-->>FetchFn: "{ error: '...' } (500)"
        FetchFn->>FetchFn: "throw Error(BOOKS_ERROR_MESSAGES.UNKNOWN_ERROR)"
        FetchFn-->>Hook: "throw Error('エラーが発生しました...')"
        Hook-->>Browser: "Error Boundaryで表示"

    else "ネットワークエラー"
        Note over FetchFn: fetch自体が失敗 (TypeError)
        FetchFn->>FetchFn: "catch (TypeError)"
        FetchFn-->>Hook: "throw Error(BOOKS_ERROR_MESSAGES.NETWORK_ERROR)"
        Hook-->>Browser: "Error Boundaryで表示"
    end

    deactivate Rails
    deactivate DAL
    deactivate APIRoute
    deactivate FetchFn
    deactivate Hook

## コンポーネント構成

graph TB
subgraph "Server Component Layer"
Page["📄 page.tsx<br/>Server Component"]
QC["QueryClient<br/>サーバー専用インスタンス"]
DAL1["authenticatedRequest<br/>Server用"]

        Page -->|prefetchQuery| QC
        QC -->|authenticatedRequest<br/>throwOn404=true| DAL1
    end

    subgraph "Client Component Layer"
        HB["🔄 HydrationBoundary<br/>キャッシュ受け渡し"]
        Client["📱 BookDetailClient<br/>Client Component"]
        Hook["🎣 useBook Hook<br/>TanStack Query"]
        FetchFn["📡 fetchBook<br/>クライアント用fetch関数"]
    end

    subgraph "API Layer"
        APIRoute["🛣️ API Route<br/>/api/books/[bookId]/route.ts"]
        DAL2["authenticatedRequest<br/>API Route用<br/>throwOn404=false"]
    end

    subgraph "Backend"
        Rails["🚂 Rails API<br/>BooksController#show"]
    end

    Page -->|dehydrate| HB
    HB --> Client
    Client --> Hook
    Hook -->|queryFn| FetchFn
    FetchFn -->|fetch| APIRoute
    APIRoute --> DAL2
    DAL1 --> Rails
    DAL2 --> Rails

    classDef server fill:#e1f5ff,stroke:#01579b
    classDef client fill:#fff3e0,stroke:#e65100
    classDef api fill:#f3e5f5,stroke:#4a148c
    classDef backend fill:#e8f5e9,stroke:#1b5e20

    class Page,QC,DAL1 server
    class HB,Client,Hook,FetchFn client
    class APIRoute,DAL2 api
    class Rails backend

## 詳細な処理フロー

### 1️⃣ Server Component でのプリフェッチ

**ファイル**: `src/app/(protected)/books/[id]/page.tsx`

```typescript
export default async function BookPage({ params }: Props) {
  const { id } = await params;
  const queryClient = createServerQueryClient();

  // サーバー側でデータを事前取得
  await queryClient.prefetchQuery({
    queryKey: queryKeys.books.detail(id),
    queryFn: async () => {
      // throwOn404=true (デフォルト) → 404時はnot-found.tsxを表示
      const data = await authenticatedRequest(`/books/${id}`);
      return bookDetailSchema.parse(data);
    },
  });

  // キャッシュをクライアントに転送
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BookDetailClient id={id} />
    </HydrationBoundary>
  );
}
```

**ポイント**:

- ✅ サーバー側で実行されるため、ユーザーには見えない
- ✅ `authenticatedRequest` がRails APIを直接呼び出す
- ✅ 404エラー時は `notFound()` が呼ばれ、`not-found.tsx` が表示される
- ✅ 成功時はキャッシュに保存され、クライアントに転送される

---

### 2️⃣ Client Component でのキャッシュ利用

**ファイル**: `src/app/(protected)/books/_components/clients/BookDetailClient.tsx`

```typescript
'use client';

export default function BookDetailClient({ id }: { id: string }) {
  const { data: book, error, isLoading } = useBook(id);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!book) return <ErrorMessage message="データの取得に失敗しました" />;

  return <BookDetailView book={book} />;
}
```

**ファイル**: `src/app/(protected)/books/_hooks/useBook.ts`

```typescript
export function useBook(id: string) {
  return useQuery({
    queryKey: queryKeys.books.detail(id),
    queryFn: () => fetchBook(id),
    enabled: !!id,
    // staleTimeはproviders.tsxのデフォルト設定（5分）を使用
  });
}
```

**ポイント**:

- ✅ プリフェッチされたデータがキャッシュにある → `isLoading: false` で即座に表示
- ✅ `staleTime: 5分`（デフォルト設定） → 5分間は再フェッチせずキャッシュを使用
- ✅ 5分経過後、バックグラウンドで自動的に再フェッチ

---

### 3️⃣ fetchBook 関数 (Client-side fetch)

**ファイル**: `src/app/(protected)/books/_lib/query/fetchBook.ts`

```typescript
export async function fetchBook(id: string): Promise<BookDetail> {
  try {
    // Next.js API Routeを呼び出し
    const response = await fetch(`/api/books/${id}`);

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json();

      // 開発環境でエラーログ
      if (process.env.NODE_ENV === 'development') {
        console.error('Books API Error:', {
          status: response.status,
          data: errorData,
        });
      }

      // 404エラーを明確に区別
      if (response.status === 404) {
        throw new Error(BOOKS_ERROR_MESSAGES.NOT_FOUND);
      }

      // それ以外は汎用エラー
      throw new Error(BOOKS_ERROR_MESSAGES.UNKNOWN_ERROR);
    }

    const data = await response.json();
    return bookDetailSchema.parse(data);
  } catch (error) {
    // ネットワークエラー
    if (error instanceof TypeError) {
      throw new Error(BOOKS_ERROR_MESSAGES.NETWORK_ERROR);
    }
    throw error;
  }
}
```

**ポイント**:

- ✅ ブラウザから Next.js API Route を呼び出す
- ✅ 404エラーを明確に区別して、ユーザーフレンドリーなメッセージを返す
- ✅ Zodバリデーションでデータの整合性を保証

---

### 4️⃣ Next.js API Route (プロキシ)

**ファイル**: `src/app/api/books/[bookId]/route.ts`

```typescript
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> },
) {
  try {
    const { bookId } = await params;

    // throwOn404=false → API Routeでは404をApiErrorとしてスロー
    const data = await authenticatedRequest(`/books/${bookId}`, {}, false);

    const book = bookDetailSchema.parse(data);
    return NextResponse.json(book);
  } catch (error) {
    // ApiErrorを適切に処理
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode },
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: '不明なエラーが発生しました' }, { status: 500 });
  }
}
```

**ポイント**:

- ✅ **重要**: `throwOn404=false` を指定
- ✅ API Routeは Server Component ではないため、`notFound()` は使えない
- ✅ `ApiError` をキャッチして、適切なステータスコードを返す

---

### 5️⃣ authenticatedRequest (共通DAL関数)

**ファイル**: `src/supabase/dal.ts`

```typescript
export async function authenticatedRequest(
  endpoint: string,
  options: RequestInit = {},
  throwOn404 = true, // ← デフォルトはServer Component用
): Promise<unknown> {
  const { session } = await verifySession();

  if (!session?.access_token) {
    throw new Error('ログインが必要です');
  }

  const baseUrl = process.env.API_BASE_URL;
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
      ...(options.headers as Record<string, string>),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    // 404エラーの処理を分岐
    if (response.status === 404 && throwOn404) {
      notFound(); // ← Server Componentでのみ使用
    }

    const errorData = await response.json().catch(() => ({}));

    let errorMessage = 'リクエストに失敗しました';
    if (errorData.message) {
      errorMessage = errorData.message;
    } else if (errorData.error) {
      errorMessage = Array.isArray(errorData.error) ? errorData.error.join(', ') : errorData.error;
    }

    throw new ApiError(errorMessage, response.status, errorData.code);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }

  return undefined;
}
```

**ポイント**:

- ✅ **Server Component用** (`throwOn404=true`): 404時に `notFound()` を呼ぶ
- ✅ **API Route用** (`throwOn404=false`): 404を `ApiError` としてスロー
- ✅ セッショントークンを自動的に付与
- ✅ エラーメッセージを正規化

---

### 6️⃣ Rails API

**ファイル**: `backend/app/controllers/api/books_controller.rb`

```ruby
class Api::BooksController < Api::ApplicationController
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

  def show
    book = current_user.books
      .includes(:category, :tags, :lists, :list_books, :cards)
      .find(params[:id])

    render json: book, include: {
      category: {},
      tags: {},
      lists: {},
      list_books: { only: [:id, :book_id, :list_id] },
      cards: {}
    }
  end

  private

  def record_not_found
    render json: { error: 'Book not found' }, status: :not_found
  end
end
```

**ポイント**:

- ✅ `rescue_from` で `RecordNotFound` をキャッチ
- ✅ 404エラーを適切に返す
- ✅ 認証は `ApplicationController` で処理

---

## エラーハンドリングのフロー

graph TD
Start["fetchBook実行"] --> Fetch["fetch実行"]

    Fetch --> CheckResponse{"response.ok?"}

    CheckResponse -->|No| CheckStatus{"status code?"}
    CheckStatus -->|404| Error404["NOT_FOUNDエラー"]
    CheckStatus -->|その他| ErrorOther["UNKNOWN_ERRORエラー"]

    CheckResponse -->|Yes| ParseJSON["JSONパース"]
    ParseJSON --> Validate{"Zodバリデーション"}

    Validate -->|成功| Success["データ返却"]
    Validate -->|失敗| ValidationError["バリデーションエラー"]

    Fetch -->|例外| CheckError{"エラー種別?"}
    CheckError -->|TypeError| NetworkError["NETWORK_ERRORエラー"]
    CheckError -->|その他| Rethrow["エラー再スロー"]

    Error404 --> UserMessage1["ユーザーに表示:<br/>本の取得に失敗しました"]
    ErrorOther --> UserMessage2["ユーザーに表示:<br/>エラーが発生しました"]
    NetworkError --> UserMessage3["ユーザーに表示:<br/>ネットワークエラー"]
    ValidationError --> UserMessage4["ユーザーに表示:<br/>データ形式エラー"]

    classDef successStyle fill:#c8e6c9,stroke:#388e3c
    classDef errorStyle fill:#ffcdd2,stroke:#c62828
    classDef checkStyle fill:#fff9c4,stroke:#f57f17

    class Success successStyle
    class Error404,ErrorOther,NetworkError,ValidationError,UserMessage1,UserMessage2,UserMessage3,UserMessage4 errorStyle
    class CheckResponse,CheckStatus,Validate,CheckError checkStyle

## キーポイント

### ✅ なぜAPI Routeが必要？

1. **セキュリティ**: ブラウザから直接Rails APIを呼ぶと、トークンが露出する
2. **環境変数**: `API_BASE_URL` はサーバー側でのみ参照可能
3. **統一**: Server/Clientどちらからも同じデータ取得方法を使える

### ✅ throwOn404 の使い分け

| 呼び出し元                       | throwOn404          | 404時の動作                         |
| -------------------------------- | ------------------- | ----------------------------------- |
| Server Component (prefetchQuery) | `true` (デフォルト) | `notFound()` → `not-found.tsx` 表示 |
| API Route                        | `false`             | `ApiError` スロー → JSONレスポンス  |
| Client Component                 | -                   | API Routeを経由するため無関係       |

### ✅ キャッシュ戦略

```typescript
// providers.tsx でデフォルト設定
staleTime: 1000 * 60 * 5; // 5分間キャッシュを新鮮として扱う
```

- **0〜5分**: キャッシュから即座に返す（再フェッチなし）
- **5分以降**: バックグラウンドで再フェッチ（画面は更新されたまま）
- **キャッシュ無効化時**: 手動で `invalidateQueries` を呼ぶ

---

## 参考資料

- [TanStack Query - Server Rendering & Hydration](https://tanstack.com/query/latest/docs/framework/react/guides/ssr)
- [Next.js - Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Next.js - API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
