import { DesktopappArgv } from '../types';
import { parseDesktopappArgv } from './parseDesktopappArgv';

const defaultArgv: DesktopappArgv = {
  command: 'start',
  app: 'app',
  sourceMap: undefined,
  mode: 'production',
  output: undefined,
  staticFileDirectories: undefined,
  staticFilePackages: undefined,
};

describe('parseDesktopappArgv()', () => {
  test('desktopapp-scripts argv를 정상적으로 Parsing 한다', () => {
    delete process.env.NODE_ENV;
    expect(parseDesktopappArgv(['start', 'app'])).toEqual({
      ...defaultArgv,
      mode: 'development',
    });
    expect(process.env.NODE_ENV).toEqual('development');

    delete process.env.NODE_ENV;
    expect(parseDesktopappArgv(['build', 'app', '--mode', 'production', '--source-map', 'true'])).toEqual({
      ...defaultArgv,
      command: 'build',
      mode: 'production',
      sourceMap: true,
    });
    expect(process.env.NODE_ENV).toEqual('production');

    delete process.env.NODE_ENV;
    expect(parseDesktopappArgv(['build', 'app', '--mode', 'development', '--source-map', 'false'])).toEqual({
      ...defaultArgv,
      command: 'build',
      mode: 'development',
      sourceMap: false,
    });
    expect(process.env.NODE_ENV).toEqual('development');

    delete process.env.NODE_ENV;
    expect(parseDesktopappArgv(['start', 'app', '--output', '/path/to/output'])).toEqual({
      ...defaultArgv,
      mode: 'development',
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
      mode: 'development',
      staticFileDirectories: 'public static',
      staticFilePackages: 'xxx yyy',
    });
    expect(process.env.NODE_ENV).toEqual('development');
  });

  test('NODE_ENV에 의한 영향을 받게 된다', () => {
    process.env.NODE_ENV = 'development';
    expect(parseDesktopappArgv(['build', 'app'])).toEqual({
      ...defaultArgv,
      command: 'build',
      mode: 'development',
    });
    expect(process.env.NODE_ENV).toEqual('development');

    process.env.NODE_ENV = 'production';
    expect(parseDesktopappArgv(['build', 'app'])).toEqual({
      ...defaultArgv,
      command: 'build',
      mode: 'production',
    });
    expect(process.env.NODE_ENV).toEqual('production');

    process.env.NODE_ENV = 'production';
    expect(parseDesktopappArgv(['build', 'app', '--mode', 'development'])).toEqual({
      ...defaultArgv,
      command: 'build',
      mode: 'production',
    });
    expect(process.env.NODE_ENV).toEqual('production');

    process.env.NODE_ENV = 'development';
    expect(parseDesktopappArgv(['build', 'app', '--mode', 'production'])).toEqual({
      ...defaultArgv,
      command: 'build',
      mode: 'development',
    });
    expect(process.env.NODE_ENV).toEqual('development');

    process.env.NODE_ENV = 'production';
    expect(parseDesktopappArgv(['start', 'app', '--mode', 'production'])).toEqual({
      ...defaultArgv,
      command: 'start',
      mode: 'development',
    });
    expect(process.env.NODE_ENV).toEqual('development');
  });

  test('build | start 이외의 command가 들어오면 Error를 발생시킨다', () => {
    expect(() => parseDesktopappArgv(['wrong-command', 'app'])).toThrowError();
  });
});
