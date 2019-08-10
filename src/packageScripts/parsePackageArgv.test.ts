import { parsePackageArgv } from './parsePackageArgv';

describe('parsePackageArgv()', () => {
  test('기본 Argv Parsing 테스트', () => {
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
  
    expect(parsePackageArgv([
      'validate',
    ])).toEqual({
      command: 'validate',
    });
  });
  
  test('build | publish 이외의 Command가 들어오면 Error를 발생시킨다', () => {
    expect(() => parsePackageArgv([
      'xxx',
    ])).toThrowError();
  });
});