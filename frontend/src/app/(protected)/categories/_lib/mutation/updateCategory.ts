import { Category, categorySchema } from '@/app/(protected)/categories/_types';
import { CATEGORIES_ERROR_MESSAGES, CategoriesErrorCode } from '../constants/errorMessages';

interface ApiErrorResponse {
  code?: string;
  error?: string;
}

// 更新用の型
export interface UpdateCategoryData {
  id: number;
  name: string;
}

export async function updateCategory(data: UpdateCategoryData): Promise<Category> {
  try {
    const { id, ...updateData } = data;
    const response = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json();

      // 開発環境でAPIエラーの詳細をログ出力
      if (process.env.NODE_ENV === 'development') {
        console.error('Categories API Error:', {
          status: response.status,
          data: errorData,
        });
      }

      // 404は明確に区別
      if (response.status === 404) {
        throw new Error(CATEGORIES_ERROR_MESSAGES.NOT_FOUND);
      }

      // エラーコードがある場合はマッピング
      if (errorData.code && errorData.code in CATEGORIES_ERROR_MESSAGES) {
        throw new Error(CATEGORIES_ERROR_MESSAGES[errorData.code as CategoriesErrorCode]);
      }

      // それ以外はUNKNOWN_ERROR
      throw new Error(CATEGORIES_ERROR_MESSAGES.UNKNOWN_ERROR);
    }

    const res = await response.json();
    return categorySchema.parse(res);
  } catch (error) {
    // ネットワークエラー（ブラウザ → Next.js API Route 間の通信失敗）
    // 例: オフライン、DNSエラー、接続タイムアウトなど
    if (error instanceof TypeError) {
      throw new Error(CATEGORIES_ERROR_MESSAGES.NETWORK_ERROR);
    }

    // 既に適切なエラーメッセージが設定されている場合（try ブロックで throw したもの）
    // または予期しないエラーの場合はそのまま再throw
    throw error;
  }
}
