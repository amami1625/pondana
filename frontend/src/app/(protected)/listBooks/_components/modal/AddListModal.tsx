import BaseModal from '@/components/modals/BaseModal';
import ListItem from '@/app/(protected)/listBooks/_components/display/ListItem';
import { useLists } from '@/app/(protected)/lists/_hooks/useLists';

interface AddListModalProps {
  bookId: number;
  listIds: number[];
  isOpen: boolean;
  onClose: () => void;
}

export default function AddListModal({ bookId, listIds, isOpen, onClose }: AddListModalProps) {
  const { data: lists } = useLists();

  return (
    <BaseModal title="本をリストに追加" isOpen={isOpen} onClose={onClose}>
      {!lists || lists.length === 0 ? (
        <p className="text-gray-500">リストがありません</p>
      ) : (
        <div className="space-y-2">
          {lists.map((list) => (
            <ListItem
              key={list.id}
              list={list}
              bookId={bookId}
              isAdded={listIds.includes(list.id)}
            />
          ))}
        </div>
      )}
    </BaseModal>
  );
}
