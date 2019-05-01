import path from 'path';
import { WebappArgv } from '../types';
import { createTmpMockup } from '../utils/createTmpMockup';
import { getStaticFileDirectories } from './getStaticFileDirectories';

const defaultArgv: WebappArgv = {
  command: 'build',
  app: 'app',
  staticFileDirectories: undefined,
  staticFilePackages: undefined,
  sizeReport: false,
  compress: false,
  output: undefined,
  vendorFileName: 'vendor',
  styleFileName: 'style',
  chunkPath: '',
  port: 3100,
  serverPort: 4100,
  https: false,
};

describe('getStaticFileDirectories()', () => {
  test('get manual directories', async () => {
    const argv: WebappArgv = {
      ...defaultArgv,
      staticFileDirectories: 'src/_packages/c/public',
    };
    
    const dirpath: string = await createTmpMockup('basic');
    const staticFileDirectories: string[] = await getStaticFileDirectories({argv, cwd: dirpath});
    
    expect(staticFileDirectories).toEqual([
      path.join(dirpath, 'src/_packages/c/public'),
    ]);
  });
  
  test('get auto directories', async () => {
    const argv: WebappArgv = {
      ...defaultArgv,
    };
    
    const dirpath: string = await createTmpMockup('basic');
    
    await expect(getStaticFileDirectories({argv, cwd: dirpath})).resolves.toEqual([
      path.join(dirpath, 'public'),
      path.join(dirpath, 'src/_packages/c/public'),
    ]);
  });
  
  test('get directories with packages public', async () => {
    const argv: WebappArgv = {
      ...defaultArgv,
      staticFilePackages: 'x y',
    };
    
    const dirpath: string = await createTmpMockup('basic');
    
    await expect(getStaticFileDirectories({argv, cwd: dirpath})).resolves.toEqual([
      path.join(dirpath, 'public'),
      path.join(dirpath, 'src/_packages/c/public'),
      path.join(dirpath, 'node_modules/y/public'),
    ]);
  });
});