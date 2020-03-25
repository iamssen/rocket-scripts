import { PackageArgv } from '../types';
import { parsePackageArgv } from './parsePackageArgv';

const defaultArgv: PackageArgv = {
  command: 'build',
  choice: true,
};

describe('parsePackageArgv()', () => {
  test('기본 Argv Parsing 테스트', () => {
    expect(parsePackageArgv(['build'])).toEqual({
      ...defaultArgv,
      command: 'build',
    });

    expect(parsePackageArgv(['publish'])).toEqual({
      ...defaultArgv,
      command: 'publish',
    });

    expect(parsePackageArgv(['publish', '--choice', 'false'])).toEqual({
      ...defaultArgv,
      command: 'publish',
      choice: false,
    });

    expect(parsePackageArgv(['validate'])).toEqual({
      ...defaultArgv,
      command: 'validate',
    });
  });

  test('build | publish 이외의 Command가 들어오면 Error를 발생시킨다', () => {
    expect(() => parsePackageArgv(['xxx'])).toThrowError();
  });
});
