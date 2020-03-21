import { DesktopappArgv } from '../types';
import { parseDesktopappArgv } from './parseDesktopappArgv';

const defaultArgv: DesktopappArgv = {
  command: 'start',
  app: 'app',
  output: undefined,
  staticFileDirectories: undefined,
  staticFilePackages: undefined,
};

describe('parseDesktopappArgv()', () => {
  test('desktopapp-scripts argv를 정상적으로 Parsing 한다', () => {
    delete process.env.NODE_ENV;
    expect(parseDesktopappArgv(['start', 'app'])).toEqual({
      ...defaultArgv,
    });
    expect(process.env.NODE_ENV).toEqual('development');

    delete process.env.NODE_ENV;
    expect(parseDesktopappArgv(['start', 'app', '--output', '/path/to/output'])).toEqual({
      ...defaultArgv,
      output: '/path/to/output',
    });
    expect(process.env.NODE_ENV).toEqual('development');

    delete process.env.NODE_ENV;
    expect(
      parseDesktopappArgv([
        'start',
        'app',
        '--static-file-directories',
        'public static',
        '--static-file-packages',
        'xxx yyy',
      ]),
    ).toEqual({
      ...defaultArgv,
      staticFileDirectories: 'public static',
      staticFilePackages: 'xxx yyy',
    });
    expect(process.env.NODE_ENV).toEqual('development');
  });

  test('build | start 이외의 command가 들어오면 Error를 발생시킨다', () => {
    expect(() => parseDesktopappArgv(['wrong-command', 'app'])).toThrowError();
  });
});
