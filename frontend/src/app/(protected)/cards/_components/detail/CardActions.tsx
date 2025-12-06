import Link from 'next/link';
import { Book, Edit, Trash2 } from 'lucide-react';
import Button from '@/components/buttons/Button';

interface CardActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  id: string;
}

export default function CardActions({ onEdit, onDelete, id }: CardActionsProps) {
  return (
    <div className="flex flex-wrap gap-3 pt-4">
      <Button variant="primary" onClick={onEdit} icon={<Edit size={18} />}>
        編集
      </Button>
      <Link
        href={`/books/${id}`}
        className="flex min-w-[84px] items-center justify-center overflow-hidden rounded-lg h-10 px-4 text-sm font-bold transition-colors cursor-pointer gap-2 bg-slate-200 text-slate-800 hover:bg-slate-300"
      >
        <Book />
        書籍情報へ
      </Link>
      <div className="ml-auto">
        <Button variant="danger" onClick={onDelete} icon={<Trash2 size={18} />}>
          削除
        </Button>
      </div>
    </div>
  );
}
