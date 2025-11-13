'use client';

import { useTopPageData } from '@/app/(protected)/top/_hooks/useTopPageData';
import LoadingState from '@/components/LoadingState';
import ErrorMessage from '@/components/ErrorMessage';
import SideNav from '@/components/navigation/SideNav';
import BookCard from '@/app/(protected)/top/_components/BookCard';
import ListCard from '@/app/(protected)/top/_components/ListCard';
import KnowledgeCard from '@/app/(protected)/top/_components/KnowledgeCard';
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
    <div className="flex h-full min-h-screen bg-background-light font-display">
      {/* サイドナビゲーション */}
      <SideNav />

      {/* メインコンテンツ */}
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-5xl">
          {/* ページ見出し */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
            <h1 className="text-slate-900 text-4xl font-black leading-tight tracking-[-0.033em]">
              ホーム
            </h1>
          </div>

          {/* 最近作成した本セクション */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-slate-900 text-[22px] font-bold leading-tight tracking-[-0.015em]">
                最近作成した本
              </h2>
              <Link href="/books" className="text-sm font-medium text-primary hover:underline">
                すべて表示
              </Link>
            </div>
            {recent_books.length > 0 ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-5">
                {recent_books.map((book) => (
                  <BookCard
                    key={book.id}
                    id={book.id}
                    title={book.title}
                    authors={book.authors}
                    category={book.category}
                  />
                ))}
              </div>
            ) : (
              <p className="text-slate-500">まだ本が登録されていません</p>
            )}
          </section>

          {/* 最近作成したリストセクション */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-slate-900 text-[22px] font-bold leading-tight tracking-[-0.015em]">
                最近作成したリスト
              </h2>
              <Link href="/lists" className="text-sm font-medium text-primary hover:underline">
                すべて表示
              </Link>
            </div>
            {recent_lists.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recent_lists.map((list) => (
                  <ListCard
                    key={list.id}
                    id={list.id}
                    name={list.name}
                    description={list.description ?? ''}
                  />
                ))}
              </div>
            ) : (
              <p className="text-slate-500">まだリストが作成されていません</p>
            )}
          </section>

          {/* 最近作成したカードセクション */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-slate-900 text-[22px] font-bold leading-tight tracking-[-0.015em]">
                最近作成したカード
              </h2>
              <Link href="/cards" className="text-sm font-medium text-primary hover:underline">
                すべて表示
              </Link>
            </div>
            {recent_cards.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {recent_cards.map((card) => (
                  <KnowledgeCard
                    key={card.id}
                    id={card.id}
                    title={card.title}
                    content={card.content}
                    bookTitle={card.book.title}
                  />
                ))}
              </div>
            ) : (
              <p className="text-slate-500">まだカードが作成されていません</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
