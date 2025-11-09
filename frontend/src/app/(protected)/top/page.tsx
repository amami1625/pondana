'use client';

import { useTopPageData } from '@/app/(protected)/top/_hooks/useTopPageData';
import LoadingState from '@/components/LoadingState';
import ErrorMessage from '@/components/ErrorMessage';
import Link from 'next/link';

export default function TopPage() {
  const { data, error, isLoading } = useTopPageData();

  // ローディング状態
  if (isLoading) {
    return <LoadingState message="データを読み込んでいます..." />;
  }

  // エラー状態
  if (error) {
    return <ErrorMessage message={error?.message || 'エラーが発生しました'} />;
  }

  // データが取得できていない場合
  if (!data) {
    return <ErrorMessage message="データの取得に失敗しました" />;
  }

  const { profile, recent_books, recent_lists, recent_cards } = data;

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* プロフィールセクション */}
      <section className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">ようこそ、{profile.name}さん</h1>
        <p className="text-gray-600">最近の活動をご確認ください</p>
      </section>

      {/* 最近作成した本 */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">最近作成した本</h2>
          <Link href="/books" className="text-blue-600 hover:text-blue-800">
            すべて見る →
          </Link>
        </div>
        {recent_books.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent_books.map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-bold text-lg mb-2">{book.title}</h3>
                {book.category && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">
                    {book.category.name}
                  </span>
                )}
                {book.authors && book.authors.length > 0 && (
                  <p className="text-sm text-gray-600">
                    著者: {book.authors.map((a) => a.name).join(', ')}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">{book.created_at}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">まだ本が登録されていません</p>
        )}
      </section>

      {/* 最近作成したリスト */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">最近作成したリスト</h2>
          <Link href="/lists" className="text-blue-600 hover:text-blue-800">
            すべて見る →
          </Link>
        </div>
        {recent_lists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent_lists.map((list) => (
              <Link
                key={list.id}
                href={`/lists/${list.id}`}
                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-bold text-lg mb-2">{list.name}</h3>
                {list.description && (
                  <p className="text-sm text-gray-600 mb-2">{list.description}</p>
                )}
                <p className="text-xs text-gray-400">{list.created_at}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">まだリストが作成されていません</p>
        )}
      </section>

      {/* 最近作成したカード */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">最近作成したカード</h2>
          <Link href="/cards" className="text-blue-600 hover:text-blue-800">
            すべて見る →
          </Link>
        </div>
        {recent_cards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent_cards.map((card) => (
              <Link
                key={card.id}
                href={`/cards/${card.id}`}
                className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-bold text-lg mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600 mb-2">本: {card.book.title}</p>
                <p className="text-sm text-gray-700 line-clamp-3 mb-2">{card.content}</p>
                <p className="text-xs text-gray-400">{card.created_at}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">まだカードが作成されていません</p>
        )}
      </section>
    </div>
  );
}
