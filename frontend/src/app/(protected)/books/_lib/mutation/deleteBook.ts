export async function deleteBook({ id }: { id: string }): Promise<void> {
  const response = await fetch(`/api/books/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }
}
