export async function deleteStatus(id: number): Promise<void> {
  const response = await fetch(`/api/statuses/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }
}
