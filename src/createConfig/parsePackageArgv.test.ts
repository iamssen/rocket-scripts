import { parsePackageArgv } from './parsePackageArgv';

describe('parsePackageArgv()', () => {
  test('parse', () => {
    expect(parsePackageArgv([
      'build',
    ])).toEqual({
      command: 'build',
    });
    
    expect(parsePackageArgv([
      'publish',
    ])).toEqual({
      command: 'publish',
    });
  });
  
  test('error cases', () => {
    expect(() => parsePackageArgv([
      'xxx',
    ])).toThrowError();
  });
});