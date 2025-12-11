import Link from 'next/link';
import Image from 'next/image';

interface BookCardProps {
  id: string;
  title: string;
  authors?: string[];
  category?: { name: string };
  thumbnail: string | null;
}

export default function BookCard({ id, title, authors, category, thumbnail }: BookCardProps) {
  return (
    <Link href={`/books/${id}`} className="flex flex-col gap-3 pb-3 group">
      {/* 表紙のプレースホルダー */}
      {thumbnail ? (
        <Image
          src={thumbnail}
          alt={title}
          width={128}
          height={176}
          className="w-full aspect-[3/4] rounded-lg object-cover shadow-sm transition-shadow duration-300 group-hover:shadow-xl"
        />
      ) : (
        <div className="w-full aspect-[3/4] rounded-lg shadow-sm transition-shadow duration-300 group-hover:shadow-xl flex items-center justify-center bg-slate-200">
          <div className="text-slate-600 text-center p-4">
            <div className="text-5xl font-black mb-2">{title.charAt(0).toUpperCase()}</div>
            {category && (
              <div className="text-xs font-medium bg-slate-300/50 rounded px-2 py-1">
                {category.name}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 本の情報 */}
      <div>
        <p className="text-slate-900 text-base font-medium leading-normal truncate">{title}</p>
        {authors && authors.length > 0 && (
          <p className="text-slate-500 text-sm font-normal leading-normal truncate">
            {authors.map((author) => author).join(', ')}
          </p>
        )}
      </div>
    </Link>
  );
}
