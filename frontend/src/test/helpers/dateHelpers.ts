/**
 * ISO形式の日付文字列を日本時間に変換するヘルパー関数
 * Zodスキーマと同じ変換ロジックを使用
 * @param isoString - ISO形式の日付文字列（例: '2025-01-01T00:00:00Z'）
 * @returns 日本時間の文字列（例: '2025/1/1 9:00:00'）
 */
export const toJapaneseLocaleString = (isoString: string): string => {
  return new Date(isoString).toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
  });
};
