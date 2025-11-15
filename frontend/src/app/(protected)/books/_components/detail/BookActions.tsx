import { Edit, ListPlus, FilePlus, Trash2 } from 'lucide-react';
import Button from '@/components/buttons/Button';

interface BookActionsProps {
  onEdit: () => void;
  onAddToList: () => void;
  onCreateCard: () => void;
  onDelete: () => void;
}

export default function BookActions({
  onEdit,
  onAddToList,
  onCreateCard,
  onDelete,
}: BookActionsProps) {
  return (
    <div className="flex flex-wrap gap-3 pt-4">
      <Button variant="primary" onClick={onEdit} icon={<Edit size={18} />}>
        編集
      </Button>
      <Button variant="secondary" onClick={onAddToList} icon={<ListPlus size={18} />}>
        リストへ追加
      </Button>
      <Button variant="secondary" onClick={onCreateCard} icon={<FilePlus size={18} />}>
        カードを作成
      </Button>
      <div className="ml-auto">
        <Button variant="danger" onClick={onDelete} icon={<Trash2 size={18} />}>
          削除
        </Button>
      </div>
    </div>
  );
}
