import { Tag, TagFormData } from '@/app/(protected)/tags/_types';
import { TAGS_ERROR_MESSAGES, TagsErrorCode } from '../constants/errorMessages';

interface ApiErrorResponse {
  code?: string;
  error?: string;
}

export async function updateTag(data: TagFormData & { id: number }): Promise<Tag> {
  try {
    const { id, ...updateData } = data;
    const response = await fetch(`/api/tags/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json();

      // 開発環境でAPIエラーの詳細をログ出力
      if (process.env.NODE_ENV === 'development') {
        console.error('Tags API Error:', {
          status: response.status,
          data: errorData,
        });
      }

      // 404は明確に区別
      if (response.status === 404) {
        throw new Error(TAGS_ERROR_MESSAGES.NOT_FOUND);
      }

      // エラーコードがある場合はマッピング
      if (errorData.code && errorData.code in TAGS_ERROR_MESSAGES) {
        throw new Error(TAGS_ERROR_MESSAGES[errorData.code as TagsErrorCode]);
      }

      // それ以外はUNKNOWN_ERROR
      throw new Error(TAGS_ERROR_MESSAGES.UNKNOWN_ERROR);
    }

    return response.json() as Promise<Tag>;
  } catch (error) {
    // ネットワークエラー（ブラウザ → Next.js API Route 間の通信失敗）
    if (error instanceof TypeError) {
      throw new Error(TAGS_ERROR_MESSAGES.NETWORK_ERROR);
    }

    // 既に適切なエラーメッセージが設定されている場合はそのまま再throw
    throw error;
  }
}
