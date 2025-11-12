export function formatRating(rating?: number | null) {
  if (rating == null || rating === 0) {
    return '未評価';
  }

  const rounded = Math.round(rating);
  const safe = Math.max(0, Math.min(5, rounded));
  const stars = '★'.repeat(safe) + '☆'.repeat(5 - safe);
  return `${stars} (${rating}/5)`;
}
