import type { GoogleBooksResponse, GoogleBooksVolume } from '@/app/(protected)/books/_types';
import toast from 'react-hot-toast';

const GOOGLE_BOOKS_API_BASE_URL = 'https://www.googleapis.com/books/v1';

/**
 * Google Books APIで書籍を検索
 * @param query - 検索キーワード
 * @param maxResults - 最大取得件数（デフォルト: 10）
 * @returns Google Books APIのレスポンス（エラー時は空の結果を返す）
 */
export async function searchBooks(
  query: string,
  maxResults: number = 10,
): Promise<GoogleBooksResponse> {
  // 空文字、空白文字での検索を防御
  if (!query.trim()) {
    return {
      kind: 'books#volumes',
      totalItems: 0,
      items: [],
    };
  }

  try {
    // TODO: 本リリース時にapiキーを取得、設定する
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
    const params = new URLSearchParams({
      q: query,
      maxResults: maxResults.toString(),
      ...(apiKey && { key: apiKey }),
    });

    const response = await fetch(`${GOOGLE_BOOKS_API_BASE_URL}/volumes?${params}`);

    if (!response.ok) {
      // HTTPステータスエラー
      console.error(`Google Books API error: ${response.status} ${response.statusText}`);
      toast.error('書籍の検索に失敗しました。少し時間をおいて再度お試しください');
      return {
        kind: 'books#volumes',
        totalItems: 0,
        items: [],
      };
    }

    const data: GoogleBooksResponse = await response.json();
    return data;
  } catch (error) {
    // ネットワークエラーやその他の例外
    console.error('Search error:', error);
    toast.error('ネットワークエラーが発生しました。インターネット接続を確認してください');
    return {
      kind: 'books#volumes',
      totalItems: 0,
      items: [],
    };
  }
}

/**
 * ISBN-13を取得するヘルパー関数
 */
export function getIsbn13(volume: GoogleBooksVolume): string | undefined {
  return volume.volumeInfo.industryIdentifiers?.find((id) => id.type === 'ISBN_13')?.identifier;
}

/**
 * ISBN-10を取得するヘルパー関数
 */
export function getIsbn10(volume: GoogleBooksVolume): string | undefined {
  return volume.volumeInfo.industryIdentifiers?.find((id) => id.type === 'ISBN_10')?.identifier;
}

/**
 * ISBNを取得するヘルパー関数（ISBN-13を優先、なければISBN-10）
 */
export function getIsbn(volume: GoogleBooksVolume): string | undefined {
  return getIsbn13(volume) || getIsbn10(volume);
}
