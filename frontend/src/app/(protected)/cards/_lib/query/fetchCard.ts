import { cardDetailSchema, type CardDetail } from '@/app/(protected)/cards/_types';
import { CARDS_ERROR_MESSAGES } from '@/constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

/**
 * カード詳細を取得する
 * クライアントコンポーネント（useQuery）で使用
 */
export async function fetchCard(id: string): Promise<CardDetail> {
  try {
    const response = await fetch(`/api/cards/${id}`);

    if (!response.ok) {
      await handleApiError(response, CARDS_ERROR_MESSAGES, 'Cards');
    }

    const data = await response.json();
    return cardDetailSchema.parse(data);
  } catch (error) {
    handleNetworkError(error, CARDS_ERROR_MESSAGES);
  }
}
