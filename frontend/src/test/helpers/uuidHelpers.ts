/**
 * MSW params.idからテスト用のseed番号を抽出するヘルパー関数
 * - UUID文字列の場合: createTestUuid()で生成したUUIDから元のseedを復元
 * - 数値文字列の場合: そのまま数値に変換
 *
 * @param paramId - MSWの params.id（UUID文字列または数値文字列）
 * @returns createTestUuid()に渡すべきseed番号
 */
export const extractSeedFromParamId = (paramId: string | readonly string[]): number => {
  const id = Array.isArray(paramId) ? paramId[0] : paramId;

  // UUID形式の場合（ハイフン含む）
  if (id.includes('-')) {
    // UUID例: "00000000-0000-4000-a000-000000000001"
    // createTestUuid()は seed.toString(16).padStart(32, '0') でhexを作成し、
    // そのhexの最後の12桁（substring(20, 32)）がUUIDの最後の部分になる
    // 例: seed=1 → hex="00000000000000000000000000000001" → 最後の12桁="000000000001"
    const hex = id.replace(/-/g, '');
    // UUIDの最後の12桁を取得（hex.substring(20, 32)に相当）
    const lastPart = hex.substring(20, 32);
    return parseInt(lastPart, 16);
  }

  // 数値文字列の場合（例: "1", "42"）
  return Number(id);
};

/**
 * テスト用のUUID生成ヘルパー関数
 * 
 * @param seedOrParamId - seed番号、またはMSWのparams.id（UUID/数値文字列）
 * @returns テスト用のUUID文字列
 * 
 * @example
 * // seed番号から生成
 * createTestUuid(1) // "00000000-0000-4000-a000-000000000001"
 * 
 * // params.id（数値文字列）から生成
 * createTestUuid("1") // "00000000-0000-4000-a000-000000000001"
 * 
 * // params.id（UUID文字列）から生成
 * createTestUuid("00000000-0000-4000-a000-000000000001") // "00000000-0000-4000-a000-000000000001"
 */
export const createTestUuid = (seedOrParamId: number | string | readonly string[] = 1): string => {
  // 文字列や配列が渡された場合は、extractSeedFromParamIdでseedを抽出
  const seed = typeof seedOrParamId === 'number' 
    ? seedOrParamId 
    : extractSeedFromParamId(seedOrParamId);
  
  // テスト用の決定的なUUIDを生成（実際のUUIDv4形式）
  const hex = seed.toString(16).padStart(32, '0');
  return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-4${hex.substring(13, 16)}-a${hex.substring(17, 20)}-${hex.substring(20, 32)}`;
};
