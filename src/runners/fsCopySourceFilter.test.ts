import { fsCopySourceFilter } from './fsCopySourceFilter';

describe('fsCopySourceFilter', () => {
  test('basic', () => {
    expect(fsCopySourceFilter('/path/to/some.js')).toBeFalsy();
    expect(fsCopySourceFilter('/path/to/some.ts')).toBeFalsy();
    expect(fsCopySourceFilter('/path/to/some.jsx')).toBeFalsy();
    expect(fsCopySourceFilter('/path/to/some.mjs')).toBeFalsy();
    expect(fsCopySourceFilter('/path/to/some.tsx')).toBeFalsy();
    
    expect(fsCopySourceFilter('/path/to/some.d.ts')).toBeTruthy();
    expect(fsCopySourceFilter('/path/to/image.png')).toBeTruthy();
  });
});