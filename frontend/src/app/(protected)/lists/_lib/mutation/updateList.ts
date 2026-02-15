import { ListBase, listBaseSchema } from '@/app/(protected)/lists/_types';

// 更新用の型
export interface UpdateListData {
  id: string;
  name: string;
  description?: string;
  public: boolean;
}

export async function updateList(data: UpdateListData): Promise<ListBase> {
  const { id, ...updateData } = data;
  const response = await fetch(`/api/lists/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const res = await response.json();
  return listBaseSchema.parse(res);
}
