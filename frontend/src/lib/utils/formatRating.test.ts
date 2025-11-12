import { describe, expect, it } from 'vitest';
import { formatRating } from './formatRating';

describe('formatRating', () => {
  describe('未評価の場合', () => {
    it('null が渡されたら 未評価 を返す', () => {
      const result = formatRating(null);
      expect(result).toBe('未評価');
    });

    it('undefined が渡されたら 未評価 を返す', () => {
      const result = formatRating(undefined);
      expect(result).toBe('未評価');
    });

    it('0 が渡されたら 未評価 を返す', () => {
      const result = formatRating(0);
      expect(result).toBe('未評価');
    });
  });

  describe('評価済みの場合', () => {
    it('1 が渡されたら ★☆☆☆☆ (1/5) を返す', () => {
      const result = formatRating(1);
      expect(result).toBe('★☆☆☆☆ (1/5)');
    });

    it('3 が渡されたら ★★★☆☆ (3/5) を返す', () => {
      const result = formatRating(3);
      expect(result).toBe('★★★☆☆ (3/5)');
    });

    it('5 が渡されたら ★★★★★ (5/5) を返す', () => {
      const result = formatRating(5);
      expect(result).toBe('★★★★★ (5/5)');
    });
  });
});
