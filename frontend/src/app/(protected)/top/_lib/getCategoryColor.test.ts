import { describe, it, expect } from 'vitest';
import { getCategoryColor } from './getCategoryColor';

describe('getCategoryColor', () => {
  it('カテゴリ名が未定義の場合、デフォルトカラーを返す', () => {
    const result = getCategoryColor(undefined);
    expect(result).toBe('bg-gradient-to-br from-slate-400 to-slate-600');
  });

  it('同じカテゴリ名に対して常に同じ色を返す', () => {
    const categoryName = 'SF小説';
    const color1 = getCategoryColor(categoryName);
    const color2 = getCategoryColor(categoryName);
    expect(color1).toBe(color2);
  });

  it('異なるカテゴリ名に対して色を返す', () => {
    const color1 = getCategoryColor('SF小説');
    const color2 = getCategoryColor('ミステリー');

    // 両方とも有効なグラデーションクラスであることを確認
    expect(color1).toMatch(/^bg-gradient-to-br from-\w+-\d+ to-\w+-\d+$/);
    expect(color2).toMatch(/^bg-gradient-to-br from-\w+-\d+ to-\w+-\d+$/);
  });

  it('定義されている8つの色のいずれかを返す', () => {
    const expectedColors = [
      'bg-gradient-to-br from-blue-400 to-blue-600',
      'bg-gradient-to-br from-purple-400 to-purple-600',
      'bg-gradient-to-br from-pink-400 to-pink-600',
      'bg-gradient-to-br from-green-400 to-green-600',
      'bg-gradient-to-br from-yellow-400 to-yellow-600',
      'bg-gradient-to-br from-red-400 to-red-600',
      'bg-gradient-to-br from-indigo-400 to-indigo-600',
      'bg-gradient-to-br from-teal-400 to-teal-600',
    ];

    const testCategories = ['小説', 'ビジネス書', '自己啓発', '技術書', '歴史'];

    testCategories.forEach((category) => {
      const color = getCategoryColor(category);
      expect(expectedColors).toContain(color);
    });
  });

  it('空文字列の場合でも有効な色を返す', () => {
    const result = getCategoryColor('');
    expect(result).toMatch(/^bg-gradient-to-br from-\w+-\d+ to-\w+-\d+$/);
  });

  it('特殊文字を含むカテゴリ名でも動作する', () => {
    const result = getCategoryColor('SF・ファンタジー');
    expect(result).toMatch(/^bg-gradient-to-br from-\w+-\d+ to-\w+-\d+$/);
  });
});
