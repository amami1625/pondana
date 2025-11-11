import { describe, it, expect } from 'vitest';

describe('Vitest Setup', () => {
  it('should run basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle objects', () => {
    const user = { name: 'Test User', id: 1 };
    expect(user).toEqual({ name: 'Test User', id: 1 });
  });
});
