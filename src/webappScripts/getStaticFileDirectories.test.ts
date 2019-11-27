import path from 'path';
import { WebappArgv } from '../types';
import { createTmpFixture } from '../utils/createTmpFixture';
import { getStaticFileDirectories } from './getStaticFileDirectories';

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
  internalEslint: true,
  port: 3100,
  serverPort: 4100,
  https: false,
};

describe('getStaticFileDirectories()', () => {
  test('staticFileDirectories를 직접 입력했을때 public을 가져옴', async () => {
    const argv: WebappArgv = {
      ...defaultArgv,
      staticFileDirectories: 'src/_packages/c/public',
    };
    
    const cwd: string = await createTmpFixture('packages');
    const staticFileDirectories: string[] = await getStaticFileDirectories({argv, cwd});
    
    expect(staticFileDirectories).toEqual([
      path.join(cwd, 'src/_packages/c/public'),
    ]);
  });
  
  test('staticFileDirectories를 입력하지 않았을때 static 디렉토리를 자동으로 가져옴', async () => {
    const argv: WebappArgv = {
      ...defaultArgv,
    };
    
    const cwd: string = await createTmpFixture('packages');
    
    await expect(getStaticFileDirectories({argv, cwd})).resolves.toEqual([
      path.join(cwd, 'public'),
      path.join(cwd, 'src/_packages/c/public'),
    ]);
  });
  
  test('staticFilePackages를 입력했을때 public을 가져옴', async () => {
    const argv: WebappArgv = {
      ...defaultArgv,
      staticFilePackages: 'x y',
    };
    
    const cwd: string = await createTmpFixture('mock-modules');
    
    await expect(getStaticFileDirectories({argv, cwd})).resolves.toEqual([
      path.join(cwd, 'public'),
      path.join(cwd, 'src/_packages/c/public'),
      //path.join(cwd, 'node_modules/x/public'), // x/public 디렉토리가 없음
      path.join(cwd, 'node_modules/y/public'),
    ]);
  });
});