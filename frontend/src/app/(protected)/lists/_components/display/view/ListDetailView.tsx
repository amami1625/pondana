'use client';

import { useListDetailView } from '@/app/(protected)/lists/_hooks/useListDetailView';
import UpdateListFormModal from '@/app/(protected)/lists/_components/modal';
import AddBookModal from '@/app/(protected)/listBooks/_components/modal/AddBookModal';
import AddedBooks from '@/app/(protected)/lists/_components/display/AddedBooks';
import Link from 'next/link';
import Breadcrumb from '@/components/layout/Breadcrumb';
import ListActions from '@/app/(protected)/lists/_components/detail/ListActions';
import { ListDetail } from '@/schemas/list';
import { useProfile } from '@/hooks/useProfile';

interface ListDetailProps {
  list: ListDetail;
}

export default function ListDetailView({ list }: ListDetailProps) {
  const { breadcrumbItems, badges, handleDelete, updateModal, addBookModal } =
    useListDetailView(list);
  const { data: profile } = useProfile();

  // ログインユーザーがリストの所有者かどうかを判定
  const isOwner = profile?.id === list.user_id;

  return (
    <>
      <div className="flex flex-col gap-8">
        {/* パンくずリスト（所有者の場合のみ） */}
        {isOwner && <Breadcrumb items={breadcrumbItems} />}
        {/* 所有者でない場合、ユーザー名を表示 */}
        {!isOwner && (
          <div className="mb-4">
            <Link
              href={`/users/${list.user_id}`}
              className="text-sm text-slate-600 hover:text-primary transition-colors"
            >
              {list.user.name}さんのリスト
            </Link>
          </div>
        )}
        {/* メインカード */}
        <div className="flex flex-col sm:flex-row gap-6 p-6 sm:p-8 bg-white rounded-xl border border-slate-200">
          <div className="flex flex-1 flex-col gap-6 min-w-0">
            {/* ヘッダー */}
            <div className="flex flex-wrap justify-between items-start gap-4 min-w-0">
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <h1 className="text-slate-900 text-3xl sm:text-4xl font-black tracking-tighter truncate">
                  {list.name}
                </h1>
              </div>
              {badges && <div className="flex items-center gap-3">{badges}</div>}
            </div>
            {/* 説明 */}
            <p className="text-slate-600 text-base font-normal leading-relaxed">
              {list.description ?? '説明が登録されていません'}
            </p>

            {/* メタデータ */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 pt-2 border-t border-slate-200">
              <span>登録日: {list.created_at}</span>
              <span>更新日: {list.updated_at}</span>
            </div>
            {/* 所有者の場合のみ編集・削除ボタンを表示 */}
            {isOwner && (
              <ListActions
                onEdit={updateModal.open}
                onAddBook={addBookModal.open}
                onDelete={() => handleDelete(list.id)}
              />
            )}
          </div>
        </div>

        {/* 追加済みの本 */}
        <AddedBooks books={list.books} listBooks={list.list_books} isOwner={isOwner} />
      </div>

      {/* 所有者の場合のみモーダルを表示できるようにする */}
      {isOwner && (
        <>
          <UpdateListFormModal
            list={list}
            isOpen={updateModal.isOpen}
            onClose={updateModal.close}
          />
          <AddBookModal
            listId={list.id}
            bookIds={list.books.map((book) => book.id)}
            isOpen={addBookModal.isOpen}
            onClose={addBookModal.close}
          />
        </>
      )}
    </>
  );
}
