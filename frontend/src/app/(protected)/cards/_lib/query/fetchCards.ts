import { cardListSchema, type CardList } from '@/app/(protected)/cards/_types';
import { CARDS_ERROR_MESSAGES } from '@/constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

/**
 * カード一覧を取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchCards(): Promise<CardList> {
  try {
    const response = await fetch('/api/cards');

    if (!response.ok) {
      await handleApiError(response, CARDS_ERROR_MESSAGES, 'Cards');
    }

    const data = await response.json();
    return cardListSchema.parse(data);
  } catch (error) {
    handleNetworkError(error, CARDS_ERROR_MESSAGES);
  }
}
