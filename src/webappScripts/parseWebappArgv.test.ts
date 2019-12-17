import { WebappArgv } from '../types';
import { parseWebappArgv } from './parseWebappArgv';

const defaultArgv: WebappArgv = {
  command: 'build',
  app: 'app',
  sourceMap: undefined,
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
  internalEslint: true,
  port: 3100,
  serverPort: 4100,
  https: false,
};

describe('parseWebappArgv()', () => {
  test('webapp-scripts argv를 정상적으로 Parsing 한다', () => {
    delete process.env.NODE_ENV;
    expect(parseWebappArgv([
      'build',
      'app',
    ])).toEqual({
      ...defaultArgv,
    });
    expect(process.env.NODE_ENV).toEqual('production');
    
    delete process.env.NODE_ENV;
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
    expect(process.env.NODE_ENV).toEqual('production');
    
    delete process.env.NODE_ENV;
    expect(parseWebappArgv([
      'build',
      'app',
      '--mode',
      'production',
      '--source-map',
      'true',
    ])).toEqual({
      ...defaultArgv,
      mode: 'production',
      sourceMap: true,
    });
    expect(process.env.NODE_ENV).toEqual('production');
    
    delete process.env.NODE_ENV;
    expect(parseWebappArgv([
      'build',
      'app',
      '--mode',
      'development',
      '--source-map',
      'false',
    ])).toEqual({
      ...defaultArgv,
      mode: 'development',
      sourceMap: false,
    });
    expect(process.env.NODE_ENV).toEqual('development');
    
    delete process.env.NODE_ENV;
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
    expect(process.env.NODE_ENV).toEqual('development');
    
    delete process.env.NODE_ENV;
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
    expect(process.env.NODE_ENV).toEqual('production');
    
    delete process.env.NODE_ENV;
    expect(parseWebappArgv([
      'build',
      'app',
      '--chunk-path',
      'lib/chunks',
    ])).toEqual({
      ...defaultArgv,
      chunkPath: 'lib/chunks/',
    });
    expect(process.env.NODE_ENV).toEqual('production');
    
    delete process.env.NODE_ENV;
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
    expect(process.env.NODE_ENV).toEqual('production');
    
    delete process.env.NODE_ENV;
    expect(parseWebappArgv([
      'build',
      'app',
      '--https',
      'true',
    ])).toEqual({
      ...defaultArgv,
      https: true,
    });
    expect(process.env.NODE_ENV).toEqual('production');
    
    delete process.env.NODE_ENV;
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
    expect(process.env.NODE_ENV).toEqual('production');
    
    delete process.env.NODE_ENV;
    expect(parseWebappArgv([
      'build',
      'app',
      '--https-key',
      'path-to-custom.key',
    ])).toEqual({
      ...defaultArgv,
      https: false,
    });
    expect(process.env.NODE_ENV).toEqual('production');
    
    delete process.env.NODE_ENV;
    expect(parseWebappArgv([
      'build',
      'app',
      '--disable-internal-eslint',
      'true',
    ])).toEqual({
      ...defaultArgv,
      internalEslint: true,
    });
    expect(process.env.NODE_ENV).toEqual('production');
    
    delete process.env.NODE_ENV;
    expect(parseWebappArgv([
      'start',
      'app',
    ])).toEqual({
      ...defaultArgv,
      command: 'start',
      mode: 'development',
    });
    expect(process.env.NODE_ENV).toEqual('development');
  });
  
  test('NODE_ENV에 의한 영향을 받게 된다', () => {
    process.env.NODE_ENV = 'development';
    expect(parseWebappArgv([
      'build',
      'app',
    ])).toEqual({
      ...defaultArgv,
      mode: 'development',
    });
    expect(process.env.NODE_ENV).toEqual('development');
    
    process.env.NODE_ENV = 'production';
    expect(parseWebappArgv([
      'build',
      'app',
    ])).toEqual({
      ...defaultArgv,
      mode: 'production',
    });
    expect(process.env.NODE_ENV).toEqual('production');
    
    process.env.NODE_ENV = 'production';
    expect(parseWebappArgv([
      'build',
      'app',
      '--mode',
      'development',
    ])).toEqual({
      ...defaultArgv,
      mode: 'production',
    });
    expect(process.env.NODE_ENV).toEqual('production');
    
    process.env.NODE_ENV = 'development';
    expect(parseWebappArgv([
      'build',
      'app',
      '--mode',
      'production',
    ])).toEqual({
      ...defaultArgv,
      mode: 'development',
    });
    expect(process.env.NODE_ENV).toEqual('development');
    
    process.env.NODE_ENV = 'production';
    expect(parseWebappArgv([
      'start',
      'app',
      '--mode',
      'production',
    ])).toEqual({
      ...defaultArgv,
      command: 'start',
      mode: 'development',
    });
    expect(process.env.NODE_ENV).toEqual('development');
  });
  
  test('build | start 이외의 command가 들어오면 Error를 발생시킨다', () => {
    expect(() => parseWebappArgv([
      'wrong-command',
      'app',
    ])).toThrowError();
  });
});