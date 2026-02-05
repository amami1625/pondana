export async function removeListBook({ id }: { id: number }): Promise<void> {
  const response = await fetch(`/api/list_books/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }
}
