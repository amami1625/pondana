// カテゴリバッジの色を返す関数
// 参考デザインのカラーパレットに基づく
export function getCategoryBadgeColor(categoryName?: string): {
  bg: string;
  text: string;
} {
  if (!categoryName) {
    return {
      bg: 'bg-slate-200',
      text: 'text-slate-700',
    };
  }

  const colorMap: Record<number, { bg: string; text: string }> = {
    0: { bg: 'bg-primary/10', text: 'text-primary' },
    1: { bg: 'bg-orange-500/10', text: 'text-orange-600' },
    2: { bg: 'bg-green-500/10', text: 'text-green-600' },
    3: { bg: 'bg-purple-500/10', text: 'text-purple-600' },
    4: { bg: 'bg-pink-500/10', text: 'text-pink-600' },
    5: { bg: 'bg-yellow-500/10', text: 'text-yellow-600' },
    6: { bg: 'bg-red-500/10', text: 'text-red-600' },
    7: { bg: 'bg-indigo-500/10', text: 'text-indigo-600' },
  };

  // カテゴリ名からハッシュ値を生成
  const hash = categoryName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colorMap[hash % 8];
}
