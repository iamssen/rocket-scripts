import path from 'path';
import { WebappArgv, WebappConfig } from '../types';
import { createTmpMockup } from '../utils/createTmpMockup';
import { createWebappConfig } from './createWebappConfig';

const defaultArgv: WebappArgv = {
  command: 'build',
  app: 'app',
  staticFileDirectories: undefined,
  staticFilePackages: undefined,
  sizeReport: true,
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
const zeroconfigPath: string = path.resolve(__dirname, '../../');

describe('createWebappConfig', () => {
  test('create correctly', async () => {
    const argv: WebappArgv = {
      ...defaultArgv,
    };
    
    const dirpath: string = await createTmpMockup('basic');
    
    await expect(createWebappConfig({argv, cwd: dirpath, zeroconfigPath})).resolves.toEqual({
      command: 'build',
      app: 'app',
      staticFileDirectories: [
        path.join(dirpath, 'public'),
        path.join(dirpath, 'src/_packages/c/public'),
      ],
      sizeReport: true,
      mode: 'production',
      output: path.join(dirpath, 'dist', argv.app),
      appFileName: 'app',
      vendorFileName: 'vendor',
      styleFileName: 'style.js',
      chunkPath: '',
      publicPath: '',
      port: 3100,
      serverPort: 4100,
      https: false,
      cwd: dirpath,
      zeroconfigPath,
      extend: {
        serverSideRendering: true,
        templateFiles: [],
      },
    } as WebappConfig);
  });
  
  test('manual output directory 1', async () => {
    const argv: WebappArgv = {
      ...defaultArgv,
      output: '/path/to/output',
    };
    
    const dirpath: string = await createTmpMockup('basic');
    
    await expect(createWebappConfig({argv, cwd: dirpath, zeroconfigPath})).resolves.toEqual({
      command: 'build',
      app: 'app',
      staticFileDirectories: [
        path.join(dirpath, 'public'),
        path.join(dirpath, 'src/_packages/c/public'),
      ],
      sizeReport: true,
      mode: 'production',
      output: '/path/to/output',
      appFileName: 'app',
      vendorFileName: 'vendor',
      styleFileName: 'style.js',
      chunkPath: '',
      publicPath: '',
      port: 3100,
      serverPort: 4100,
      https: false,
      cwd: dirpath,
      zeroconfigPath,
      extend: {
        serverSideRendering: true,
        templateFiles: [],
      },
    } as WebappConfig);
  });
  
  test('manual output directory 2', async () => {
    const argv: WebappArgv = {
      ...defaultArgv,
      output: 'path/to/output',
    };
    
    const dirpath: string = await createTmpMockup('basic');
    
    await expect(createWebappConfig({argv, cwd: dirpath, zeroconfigPath})).resolves.toEqual({
      command: 'build',
      app: 'app',
      staticFileDirectories: [
        path.join(dirpath, 'public'),
        path.join(dirpath, 'src/_packages/c/public'),
      ],
      sizeReport: true,
      mode: 'production',
      output: path.join(dirpath, 'path/to/output'),
      appFileName: 'app',
      vendorFileName: 'vendor',
      styleFileName: 'style.js',
      chunkPath: '',
      publicPath: '',
      port: 3100,
      serverPort: 4100,
      https: false,
      cwd: dirpath,
      zeroconfigPath,
      extend: {
        serverSideRendering: true,
        templateFiles: [],
      },
    } as WebappConfig);
  });
  
  test('error cases', async () => {
    const argv: WebappArgv = {
      ...defaultArgv,
      app: 'xxx',
    };
    
    const dirpath: string = await createTmpMockup('basic');
    
    await expect(createWebappConfig({argv, cwd: dirpath, zeroconfigPath})).rejects.toThrow();
  });
});