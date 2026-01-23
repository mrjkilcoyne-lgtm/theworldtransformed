import { describe, it, expect } from 'vitest';

describe('Example Test Suite', () => {
  it('should pass basic assertion', () => {
    expect(true).toBe(true);
  });

  it('should test simple math', () => {
    expect(2 + 2).toBe(4);
  });

  it('should work with strings', () => {
    const message = 'Navigation beats prediction';
    expect(message).toContain('Navigation');
  });
});
