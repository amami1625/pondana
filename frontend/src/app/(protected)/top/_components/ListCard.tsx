import Link from 'next/link';
import { BookOpen } from 'lucide-react';

interface ListCardProps {
  id: string;
  name: string;
  description?: string;
  bookCount?: number;
}

export default function ListCard({ id, name, description, bookCount = 0 }: ListCardProps) {
  return (
    <Link
      href={`/lists/${id}`}
      className="group flex flex-col justify-between p-5 bg-white rounded-xl shadow-sm transition-shadow duration-300 hover:shadow-lg"
    >
      <div>
        <h3 className="text-slate-900 font-bold text-lg mb-2 truncate">{name}</h3>
        {description && <p className="text-slate-600 text-sm line-clamp-2 mb-3">{description}</p>}
      </div>
      <div className="flex items-center gap-2 text-slate-500 text-sm mt-2">
        <BookOpen size={16} />
        <span>{bookCount}冊の本</span>
      </div>
    </Link>
  );
}
