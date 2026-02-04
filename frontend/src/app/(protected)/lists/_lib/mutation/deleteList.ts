export async function deleteList(id: string): Promise<void> {
  const response = await fetch(`/api/lists/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }
}
