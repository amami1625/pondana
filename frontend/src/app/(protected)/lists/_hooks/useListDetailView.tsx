import { useModal } from '@/hooks/useModal';
import { getListDetailBreadcrumbs } from '@/lib/utils';
import PublicBadge from '@/components/badges/PublicBadge';
import { useListMutations } from '@/app/(protected)/lists/_hooks/useListMutations';
import { ListDetail } from '@/schemas/list';

export function useListDetailView(list: ListDetail) {
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

  // バッジ
  const badges = <PublicBadge isPublic={list.public} />;

  return {
    breadcrumbItems,
    badges,
    handleDelete,
    updateModal,
    addBookModal,
  };
}
