import { Edit, Plus, Trash2 } from 'lucide-react';
import Button from '@/components/buttons/Button';

interface ListActionsProps {
  onEdit: () => void;
  onAddBook: () => void;
  onDelete: () => void;
}

export default function ListActions({ onEdit, onAddBook, onDelete }: ListActionsProps) {
  return (
    <div className="flex flex-wrap gap-3 pt-4">
      <Button variant="primary" onClick={onEdit} icon={<Edit size={18} />}>
        編集
      </Button>
      <Button variant="secondary" onClick={onAddBook} icon={<Plus size={18} />}>
        本を追加
      </Button>
      <div className="ml-auto">
        <Button variant="danger" onClick={onDelete} icon={<Trash2 size={18} />}>
          削除
        </Button>
      </div>
    </div>
  );
}
