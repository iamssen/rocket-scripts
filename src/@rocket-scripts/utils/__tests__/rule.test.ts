import { icuFormat, parseNumber } from '@rocket-scripts/utils';

describe('parseNumber()', () => {
  test('should get numbers from correctly sources', () => {
    expect(parseNumber(223)).toBe(223);
    expect(parseNumber(-3)).toBe(-3);
    expect(parseNumber(+3)).toBe(3);
    expect(parseNumber('223')).toBe(223);
    expect(parseNumber('-3')).toBe(-3);
    expect(parseNumber('+3')).toBe(3);
  });

  test('should get undefined from incorrectly sources', () => {
    expect(parseNumber('2/23')).toBeUndefined();
    expect(parseNumber('a')).toBeUndefined();
    expect(parseNumber('+-3')).toBeUndefined();
  });
});

describe('icuFormat()', () => {
  test('should format text', () => {
    expect(icuFormat('aaa/bbb/ccc', {})).toBe('aaa/bbb/ccc');
    expect(icuFormat('aaa/{bbb}/ccc', { bbb: 1 })).toBe('aaa/1/ccc');
  });

  test('should throw error with not provided values', () => {
    expect(() => icuFormat('aaa/{bbb}/ccc', {})).toThrow();
  });
});
