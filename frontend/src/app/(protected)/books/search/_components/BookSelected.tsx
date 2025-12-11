'use client';

import Image from 'next/image';
import { getIsbn } from '@/lib/googleBooksApi';
import type { GoogleBooksVolume } from '@/app/(protected)/books/_types';
import { useBookSelected } from '@/app/(protected)/books/search/_hooks/useBookSelected';

interface SelectedBookDetailProps {
  book: GoogleBooksVolume;
  onClear: () => void;
}

export default function BookSelected({ book, onClear }: SelectedBookDetailProps) {
  const { registerBook, isRegistering, isAlreadyRegistered } = useBookSelected();
  const alreadyRegistered = isAlreadyRegistered(book.id);

  return (
    <div className="mt-6 border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-gray-900">選択した書籍</h2>
        <button
          onClick={onClear}
          className="text-gray-500 hover:text-gray-700 text-sm"
          disabled={isRegistering}
        >
          ✕ クリア
        </button>
      </div>

      <div className="flex gap-6">
        {/* 書籍画像 */}
        <div className="flex-shrink-0">
          {book.volumeInfo.imageLinks?.thumbnail ? (
            <div className="relative w-40 h-60">
              <Image
                className="rounded object-cover shadow-md"
                src={book.volumeInfo.imageLinks.thumbnail}
                alt={book.volumeInfo.title}
                sizes="160px"
                fill
              />
            </div>
          ) : (
            <div className="w-40 h-60 bg-gray-200 rounded flex items-center justify-center text-gray-400">
              画像なし
            </div>
          )}
        </div>

        {/* 書籍情報 */}
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{book.volumeInfo.title}</h3>
          {book.volumeInfo.subtitle && (
            <p className="text-lg text-gray-700 mb-3">{book.volumeInfo.subtitle}</p>
          )}
          {book.volumeInfo.authors && book.volumeInfo.authors.length > 0 && (
            <p className="text-base text-gray-700 mb-2">
              <span className="font-semibold">著者:</span> {book.volumeInfo.authors.join(', ')}
            </p>
          )}
          {book.volumeInfo.publishedDate && (
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">出版日:</span> {book.volumeInfo.publishedDate}
            </p>
          )}
          {getIsbn(book) && (
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-semibold">ISBN:</span> {getIsbn(book)}
            </p>
          )}
          {book.volumeInfo.description && (
            <div className="mb-4">
              <p className="font-semibold text-gray-900 mb-1">説明:</p>
              <p className="text-sm text-gray-700 leading-relaxed">{book.volumeInfo.description}</p>
            </div>
          )}

          {/* 登録ボタン */}
          {alreadyRegistered ? (
            <button
              onClick={() => registerBook(book)}
              disabled={true}
              className="w-40 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-md disabled:cursor-not-allowed transition-colors"
            >
              ✓ 登録済み
            </button>
          ) : (
            <button
              onClick={() => registerBook(book)}
              disabled={isRegistering}
              className="w-40 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 hover:cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              この本を登録
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
