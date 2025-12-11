/**
 * テスト用のUUID生成ヘルパー関数
 */
export const createTestUuid = (seed: number = 1): string => {
  // テスト用の決定的なUUIDを生成（実際のUUIDv4形式）
  const hex = seed.toString(16).padStart(32, '0');
  return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-4${hex.substring(13, 16)}-a${hex.substring(17, 20)}-${hex.substring(20, 32)}`;
};
