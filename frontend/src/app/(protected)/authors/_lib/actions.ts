'use server';

import { Author, AuthorFormData, authorSchema } from '@/schemas/author';
import { authenticatedRequest } from '@/supabase/dal';

export async function createAuthor(formData: AuthorFormData): Promise<Author | { error: string }> {
  try {
    const author = await authenticatedRequest('/authors', {
      method: 'POST',
      body: JSON.stringify({ author: formData }),
    });
    return authorSchema.parse(author);
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: '不明なエラーが発生しました' };
    }
  }
}

export async function updateAuthor(formData: AuthorFormData): Promise<Author | { error: string }> {
  if (!formData.id) {
    return { error: '著者IDが指定されていません' };
  }

  try {
    const author = await authenticatedRequest(`/authors/${formData.id}`, {
      method: 'PUT',
      body: JSON.stringify({ author: formData }),
    });
    return authorSchema.parse(author);
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: '不明なエラーが発生しました' };
    }
  }
}

export async function deleteAuthor(id: number): Promise<{ success: true } | { error: string }> {
  try {
    await authenticatedRequest(`/authors/${id}`, {
      method: 'DELETE',
    });
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: '不明なエラーが発生しました' };
    }
  }
}
