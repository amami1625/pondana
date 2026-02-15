export async function deleteTag({ id }: { id: number }): Promise<void> {
  const response = await fetch(`/api/tags/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }
}
