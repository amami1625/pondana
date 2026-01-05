import Link from 'next/link';
import type { RecentBook } from '@/schemas/dashboard';

interface RecentBooksProps {
  data: RecentBook[];
}

export default function RecentBooks({ data }: RecentBooksProps) {
  // データがない場合の処理
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">最近の書籍</h3>
        <div className="text-gray-500 text-center py-8">書籍がまだ登録されていません</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-4">最近の書籍</h3>
      <ul className="space-y-3">
        {data.map((book) => (
          <li
            key={book.id}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Link
              href={`/books/${book.id}`}
              className="flex-1 text-blue-600 hover:text-blue-800 hover:underline font-medium"
            >
              {book.title}
            </Link>
            <span className="text-sm text-gray-500 ml-4">
              {new Date(book.created_at).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
