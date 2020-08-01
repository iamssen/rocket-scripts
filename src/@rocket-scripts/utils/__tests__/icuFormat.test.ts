import { icuFormat } from '@rocket-scripts/utils';

describe('icuFormat()', () => {
  test('should format text', () => {
    expect(icuFormat('aaa/bbb/ccc', {})).toBe('aaa/bbb/ccc');
    expect(icuFormat('aaa/{bbb}/ccc', { bbb: 1 })).toBe('aaa/1/ccc');
  });

  test('should throw error with not provided values', () => {
    expect(() => icuFormat('aaa/{bbb}/ccc', {})).toThrow();
  });
});
