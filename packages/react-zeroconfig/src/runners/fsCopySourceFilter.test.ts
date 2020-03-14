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
    
    expect(fsCopySourceFilter('/path/to/bin/cli.js')).toBeTruthy();
    expect(fsCopySourceFilter('/path/to/bin/cli')).toBeTruthy();
  });
  
  test('exclude public directories', () => {
    expect(fsCopySourceFilter('/path/to/public/some.js')).toBeTruthy();
    expect(fsCopySourceFilter('/path/to/public/xxx/yyy/some.js')).toBeTruthy();
  });
});