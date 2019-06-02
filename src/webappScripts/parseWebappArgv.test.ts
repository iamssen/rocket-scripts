import { WebappArgv } from '../types';
import { parseWebappArgv } from './parseWebappArgv';

const defaultArgv: WebappArgv = {
  command: 'build',
  app: 'app',
  staticFileDirectories: undefined,
  staticFilePackages: undefined,
  sizeReport: false,
  mode: 'production',
  output: undefined,
  appFileName: 'app',
  vendorFileName: 'vendor',
  styleFileName: 'style.js',
  chunkPath: '',
  publicPath: '',
  port: 3100,
  serverPort: 4100,
  https: false,
};

describe('parseWebappArgv()', () => {
  test('webapp-scripts argv를 정상적으로 Parsing 한다', () => {
    expect(parseWebappArgv([
      'build',
      'app',
    ])).toEqual({
      ...defaultArgv,
    });
    
    expect(parseWebappArgv([
      'build',
      'app',
      '--static-file-directories',
      'public static',
      '--static-file-packages',
      'xxx yyy',
    ])).toEqual({
      ...defaultArgv,
      staticFileDirectories: 'public static',
      staticFilePackages: 'xxx yyy',
    });
    
    expect(parseWebappArgv([
      'build',
      'app',
      '--size-report',
      'true',
      '--mode',
      'development',
    ])).toEqual({
      ...defaultArgv,
      sizeReport: true,
      mode: 'development',
    });
    
    expect(parseWebappArgv([
      'build',
      'app',
      '--app-file-name',
      'app2',
      '--vendor-file-name',
      'vendor2',
      '--style-file-name',
      'style2',
    ])).toEqual({
      ...defaultArgv,
      appFileName: 'app2',
      vendorFileName: 'vendor2',
      styleFileName: 'style2',
    });
    
    expect(parseWebappArgv([
      'build',
      'app',
      '--chunk-path',
      'lib/chunks',
    ])).toEqual({
      ...defaultArgv,
      chunkPath: 'lib/chunks/',
    });
    
    expect(parseWebappArgv([
      'build',
      'app',
      '--port',
      '7800',
      '--server-port',
      '8800',
    ])).toEqual({
      ...defaultArgv,
      port: 7800,
      serverPort: 8800,
    });
    
    expect(parseWebappArgv([
      'build',
      'app',
      '--https',
      'true',
    ])).toEqual({
      ...defaultArgv,
      https: true,
    });
    
    expect(parseWebappArgv([
      'build',
      'app',
      '--https-key',
      'path-to-custom.key',
      '--https-cert',
      'path-to-custom.crt',
    ])).toEqual({
      ...defaultArgv,
      https: {key: 'path-to-custom.key', cert: 'path-to-custom.crt'},
    });
    
    expect(parseWebappArgv([
      'build',
      'app',
      '--https-key',
      'path-to-custom.key',
    ])).toEqual({
      ...defaultArgv,
      https: false,
    });
  });
  
  test('build | start 이외의 command가 들어오면 Error를 발생시킨다', () => {
    expect(() => parseWebappArgv([
      'wrong-command',
      'app',
    ])).toThrowError();
  });
});