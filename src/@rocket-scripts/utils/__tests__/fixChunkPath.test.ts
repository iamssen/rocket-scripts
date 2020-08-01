import { fixChunkPath } from '@rocket-scripts/utils/fixChunkPath';

describe('fixChunkPath()', () => {
  test('should fix chunk paths', () => {
    expect(fixChunkPath('')).toBe('');
    expect(fixChunkPath('/path/to')).toBe('/path/to/');
    expect(fixChunkPath('/path/to/')).toBe('/path/to/');
  });
});
