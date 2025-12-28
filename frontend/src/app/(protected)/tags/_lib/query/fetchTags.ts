import { tagSchema, type Tag } from '@/app/(protected)/tags/_types';
import { TAGS_ERROR_MESSAGES } from '@/constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

/**
 * タグ一覧を取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchTags(): Promise<Tag[]> {
  try {
    const response = await fetch('/api/tags');

    if (!response.ok) {
      await handleApiError(response, TAGS_ERROR_MESSAGES, 'Tags');
    }

    const data = await response.json();
    return tagSchema.array().parse(data);
  } catch (error) {
    handleNetworkError(error, TAGS_ERROR_MESSAGES);
  }
}
