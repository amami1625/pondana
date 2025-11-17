import { Edit, Trash2 } from 'lucide-react';
import Button from '@/components/buttons/Button';

interface CardActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function CardActions({ onEdit, onDelete }: CardActionsProps) {
  return (
    <div className="flex flex-wrap gap-3 pt-4">
      <Button variant="primary" onClick={onEdit} icon={<Edit size={18} />}>
        編集
      </Button>
      <div className="ml-auto">
        <Button variant="danger" onClick={onDelete} icon={<Trash2 size={18} />}>
          削除
        </Button>
      </div>
    </div>
  );
}
