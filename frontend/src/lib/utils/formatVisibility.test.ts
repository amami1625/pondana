import { describe, expect, it } from 'vitest';
import { formatVisibility } from './formatVisibility';

describe('formatVisibility', () => {
  it('true が渡されたら 公開 を返す', () => {
    const result = formatVisibility(true);
    expect(result).toBe('公開');
  });

  it('false が渡されたら 非公開 を返す', () => {
    const result = formatVisibility(false);
    expect(result).toBe('非公開');
  });
});
