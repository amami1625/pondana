import Link from 'next/link';
import { BookOpen } from 'lucide-react';

interface KnowledgeCardProps {
  id: number;
  title: string;
  content: string;
  bookTitle: string;
}

export default function KnowledgeCard({ id, title, content, bookTitle }: KnowledgeCardProps) {
  return (
    <Link
      href={`/cards/${id}`}
      className="group flex flex-col p-5 bg-white rounded-xl shadow-sm transition-shadow duration-300 hover:shadow-lg"
    >
      <h3 className="text-slate-900 font-bold text-base mb-2">{title}</h3>
      <p className="text-slate-700 mb-4 text-sm leading-relaxed line-clamp-3">{content}</p>
      <div className="mt-auto">
        <p className="text-slate-500 text-xs font-medium flex items-center gap-1">
          <BookOpen size={14} />
          {bookTitle}
        </p>
      </div>
    </Link>
  );
}
