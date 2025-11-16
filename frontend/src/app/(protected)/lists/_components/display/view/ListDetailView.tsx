'use client';

import { useModal } from '@/hooks/useModal';
import { getListDetailBreadcrumbs } from '@/lib/utils';
import UpdateListFormModal from '@/app/(protected)/lists/_components/modal';
import AddBookModal from '@/app/(protected)/listBooks/_components/modal/AddBookModal';
import AddedBooks from '@/app/(protected)/lists/_components/display/AddedBooks';
import Breadcrumb from '@/components/Breadcrumb';
import PublicBadge from '@/app/(protected)/books/_components/detail/badge/PublicBadge';
import ListActions from '@/app/(protected)/lists/_components/detail/ListActions';
import { useListMutations } from '@/app/(protected)/lists/_hooks/useListMutations';
import { ListDetail } from '@/schemas/list';

interface ListDetailProps {
  list: ListDetail;
}

export default function ListDetailView({ list }: ListDetailProps) {
  const { deleteList } = useListMutations();
  const updateModal = useModal();
  const addBookModal = useModal();

  const handleDelete = (id: number) => {
    if (!confirm('本当に削除しますか？')) {
      return;
    }

    deleteList(id);
  };

  // パンくずリストのアイテム
  const breadcrumbItems = getListDetailBreadcrumbs(list.name);

  return (
    <>
      <div className="flex flex-col gap-8">
        {/* パンくずリスト */}
        <Breadcrumb items={breadcrumbItems} />

        {/* リスト情報カード */}
        <div className="flex flex-col gap-6 p-6 sm:p-8 bg-white rounded-xl border border-slate-200">
          {/* ヘッダー */}
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div className="flex flex-col gap-1">
              {/* タイトル */}
              <h1 className="text-slate-900 text-3xl sm:text-4xl font-black tracking-tighter">
                {list.name}
              </h1>
            </div>
            {/* バッジ */}
            <div className="flex items-center gap-3">
              <PublicBadge isPublic={list.public} />
            </div>
          </div>

          {/* 説明文 */}
          <p className="text-slate-600 text-base font-normal leading-relaxed">
            {list.description || '説明が登録されていません。'}
          </p>

          {/* メタ情報 */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 pt-2 border-t border-slate-200">
            <span>登録日: {list.created_at}</span>
            <span>更新日: {list.updated_at}</span>
          </div>

          {/* アクションボタン */}
          <ListActions
            onEdit={updateModal.open}
            onAddBook={addBookModal.open}
            onDelete={() => handleDelete(list.id)}
          />
        </div>

        {/* 追加済みの本 */}
        <AddedBooks books={list.books} listBooks={list.list_books} />
      </div>

      {/* モーダル */}
      <UpdateListFormModal list={list} isOpen={updateModal.isOpen} onClose={updateModal.close} />
      <AddBookModal
        listId={list.id}
        bookIds={list.books.map((book) => book.id)}
        isOpen={addBookModal.isOpen}
        onClose={addBookModal.close}
      />
    </>
  );
}
