import { parseNumber } from '@rocket-scripts/utils';

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
