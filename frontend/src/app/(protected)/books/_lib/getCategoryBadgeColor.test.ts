import { describe, it, expect } from 'vitest';
import { getCategoryBadgeColor } from './getCategoryBadgeColor';

describe('getCategoryBadgeColor', () => {
  it('カテゴリ名が未定義の場合、デフォルトカラーを返す', () => {
    const result = getCategoryBadgeColor(undefined);
    expect(result).toEqual({
      bg: 'bg-slate-200',
      text: 'text-slate-700',
    });
  });

  it('同じカテゴリ名に対して常に同じ色を返す', () => {
    const categoryName = 'SF小説';
    const color1 = getCategoryBadgeColor(categoryName);
    const color2 = getCategoryBadgeColor(categoryName);
    expect(color1).toEqual(color2);
  });

  it('異なるカテゴリ名に対して色を返す', () => {
    const color1 = getCategoryBadgeColor('SF小説');
    const color2 = getCategoryBadgeColor('ミステリー');

    // 両方とも有効な色オブジェクトであることを確認
    expect(color1).toHaveProperty('bg');
    expect(color1).toHaveProperty('text');
    expect(color2).toHaveProperty('bg');
    expect(color2).toHaveProperty('text');

    // bgとtextが適切なフォーマットであることを確認
    expect(color1.bg).toMatch(/^bg-[\w-]+(\/\d+)?$/);
    expect(color1.text).toMatch(/^text-[\w-]+$/);
    expect(color2.bg).toMatch(/^bg-[\w-]+(\/\d+)?$/);
    expect(color2.text).toMatch(/^text-[\w-]+$/);
  });

  it('定義されている8つの色のいずれかを返す', () => {
    const expectedColors = [
      { bg: 'bg-primary/10', text: 'text-primary' },
      { bg: 'bg-orange-500/10', text: 'text-orange-600' },
      { bg: 'bg-green-500/10', text: 'text-green-600' },
      { bg: 'bg-purple-500/10', text: 'text-purple-600' },
      { bg: 'bg-pink-500/10', text: 'text-pink-600' },
      { bg: 'bg-yellow-500/10', text: 'text-yellow-600' },
      { bg: 'bg-red-500/10', text: 'text-red-600' },
      { bg: 'bg-indigo-500/10', text: 'text-indigo-600' },
    ];

    const testCategories = ['小説', 'ビジネス書', '自己啓発', '技術書', '歴史'];

    testCategories.forEach((category) => {
      const color = getCategoryBadgeColor(category);
      const isExpectedColor = expectedColors.some(
        (expected) => expected.bg === color.bg && expected.text === color.text,
      );
      expect(isExpectedColor).toBe(true);
    });
  });

  it('空文字列の場合でも有効な色を返す', () => {
    const result = getCategoryBadgeColor('');
    expect(result).toHaveProperty('bg');
    expect(result).toHaveProperty('text');
    expect(result.bg).toMatch(/^bg-[\w-]+(\/\d+)?$/);
    expect(result.text).toMatch(/^text-[\w-]+$/);
  });

  it('特殊文字を含むカテゴリ名でも動作する', () => {
    const result = getCategoryBadgeColor('SF・ファンタジー');
    expect(result).toHaveProperty('bg');
    expect(result).toHaveProperty('text');
    expect(result.bg).toMatch(/^bg-[\w-]+(\/\d+)?$/);
    expect(result.text).toMatch(/^text-[\w-]+$/);
  });

  it('戻り値のオブジェクト構造が正しい', () => {
    const result = getCategoryBadgeColor('テストカテゴリ');
    expect(Object.keys(result)).toEqual(['bg', 'text']);
    expect(typeof result.bg).toBe('string');
    expect(typeof result.text).toBe('string');
  });
});
