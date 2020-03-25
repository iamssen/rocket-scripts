import path from 'path';
import { WebappArgv, WebappConfig } from '../types';
import { createTmpFixture } from '../utils/createTmpFixture';
import { createWebappConfig } from './createWebappConfig';

const defaultArgv: WebappArgv = {
  command: 'build',
  app: 'app',
  sourceMap: undefined,
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
  internalEslint: true,
  port: 3100,
  serverPort: 4100,
  https: false,
};
const zeroconfigPath: string = path.resolve(__dirname, '../../');

describe('createWebappConfig', () => {
  test('기본 Webapp Config를 만든다', async () => {
    const argv: WebappArgv = {
      ...defaultArgv,
    };

    const cwd: string = await createTmpFixture('simple-ssr-ts');

    await expect(createWebappConfig({ argv, cwd, zeroconfigPath })).resolves.toEqual({
      command: 'build',
      app: 'app',
      sourceMap: undefined,
      staticFileDirectories: [path.join(cwd, 'public')],
      sizeReport: true,
      mode: 'production',
      output: path.join(cwd, 'dist', argv.app),
      appFileName: 'app',
      vendorFileName: 'vendor',
      styleFileName: 'style.js',
      chunkPath: '',
      publicPath: '',
      internalEslint: true,
      port: 3100,
      serverPort: 4100,
      https: false,
      cwd,
      zeroconfigPath,
      extend: {
        serverSideRendering: true,
        templateFiles: [],
      },
    } as WebappConfig);
  });

  test('절대경로로 입력된 output 옵션이 정상적으로 반영되는지 확인', async () => {
    const argv: WebappArgv = {
      ...defaultArgv,
      output: '/path/to/output',
    };

    const cwd: string = await createTmpFixture('simple-ssr-ts');

    await expect(createWebappConfig({ argv, cwd, zeroconfigPath })).resolves.toEqual({
      command: 'build',
      app: 'app',
      sourceMap: undefined,
      staticFileDirectories: [path.join(cwd, 'public')],
      sizeReport: true,
      mode: 'production',
      output: '/path/to/output',
      appFileName: 'app',
      vendorFileName: 'vendor',
      styleFileName: 'style.js',
      chunkPath: '',
      publicPath: '',
      internalEslint: true,
      port: 3100,
      serverPort: 4100,
      https: false,
      cwd,
      zeroconfigPath,
      extend: {
        serverSideRendering: true,
        templateFiles: [],
      },
    } as WebappConfig);
  });

  test('상대경로로 입력된 output 옵션이 정상적으로 반영되는지 확인', async () => {
    const argv: WebappArgv = {
      ...defaultArgv,
      output: 'path/to/output',
    };

    const cwd: string = await createTmpFixture('simple-ssr-ts');

    await expect(createWebappConfig({ argv, cwd, zeroconfigPath })).resolves.toEqual({
      command: 'build',
      app: 'app',
      sourceMap: undefined,
      staticFileDirectories: [path.join(cwd, 'public')],
      sizeReport: true,
      mode: 'production',
      output: path.join(cwd, 'path/to/output'),
      appFileName: 'app',
      vendorFileName: 'vendor',
      styleFileName: 'style.js',
      chunkPath: '',
      publicPath: '',
      internalEslint: true,
      port: 3100,
      serverPort: 4100,
      https: false,
      cwd,
      zeroconfigPath,
      extend: {
        serverSideRendering: true,
        templateFiles: [],
      },
    } as WebappConfig);
  });

  test('존재하지 않는 app name은 에러로 처리', async () => {
    const argv: WebappArgv = {
      ...defaultArgv,
      app: 'xxx',
    };

    const cwd: string = await createTmpFixture('simple-csr-ts');

    await expect(createWebappConfig({ argv, cwd, zeroconfigPath })).rejects.toThrow();
  });
});
