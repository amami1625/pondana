import { ListBase, listBaseSchema } from '@/app/(protected)/lists/_types';
import { LISTS_ERROR_MESSAGES } from '../constants/errorMessages';
import { handleApiError, handleNetworkError } from '@/lib/api/handleApiError';

// 更新用の型
export interface UpdateListData {
  id: string;
  name: string;
  description?: string;
  public: boolean;
}

export async function updateList(data: UpdateListData): Promise<ListBase> {
  try {
    const { id, ...updateData } = data;
    const response = await fetch(`/api/lists/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      await handleApiError(response, LISTS_ERROR_MESSAGES, 'Lists');
    }

    const res = await response.json();
    return listBaseSchema.parse(res);
  } catch (error) {
    handleNetworkError(error, LISTS_ERROR_MESSAGES);
  }
}
