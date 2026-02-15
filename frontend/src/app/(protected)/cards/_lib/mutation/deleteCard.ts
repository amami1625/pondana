export async function deleteCard({
  bookId,
  cardId,
}: {
  bookId: string;
  cardId: string;
}): Promise<void> {
  const response = await fetch(`/api/books/${bookId}/cards/${cardId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }
}
