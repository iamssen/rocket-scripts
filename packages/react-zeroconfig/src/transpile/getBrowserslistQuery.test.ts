import { createTmpFixture } from '../utils/createTmpFixture';
import { getBrowserslistQuery } from './getBrowserslistQuery';

describe('getBrowserslistQuery', () => {
  test('기본 Browserslist 가져오기', async () => {
    const cwd: string = await createTmpFixture('simple-csr-ts');

    process.env.BROWSERSLIST_ENV = 'production';
    expect(getBrowserslistQuery({ cwd })).toEqual(['>0.2%', 'not dead', 'not op_mini all']);

    process.env.BROWSERSLIST_ENV = 'development';
    expect(getBrowserslistQuery({ cwd })).toEqual([
      'last 1 chrome version',
      'last 1 firefox version',
      'last 1 safari version',
      'ie 11',
    ]);

    process.env.BROWSERSLIST_ENV = 'server';
    expect(getBrowserslistQuery({ cwd })).toEqual('node 10');

    process.env.BROWSERSLIST_ENV = 'server_development';
    expect(getBrowserslistQuery({ cwd })).toEqual('current node');

    process.env.BROWSERSLIST_ENV = 'package';
    expect(getBrowserslistQuery({ cwd })).toEqual(['>0.2%', 'not dead', 'not op_mini all']);

    process.env.BROWSERSLIST_ENV = 'test';
    expect(getBrowserslistQuery({ cwd })).toEqual('current node');
  });

  test('Custom Browserslist 가져오기', async () => {
    const cwd: string = await createTmpFixture('custom');

    process.env.BROWSERSLIST_ENV = 'production';
    expect(getBrowserslistQuery({ cwd })).toEqual('last 1 chrome version');

    process.env.BROWSERSLIST_ENV = 'development';
    expect(getBrowserslistQuery({ cwd })).toEqual('last 1 chrome version');

    process.env.BROWSERSLIST_ENV = 'server';
    expect(getBrowserslistQuery({ cwd })).toEqual('node 12');

    process.env.BROWSERSLIST_ENV = 'server_development';
    expect(getBrowserslistQuery({ cwd })).toEqual('node 12');

    process.env.BROWSERSLIST_ENV = 'package';
    expect(getBrowserslistQuery({ cwd })).toEqual(['>0.2%', 'not dead', 'not op_mini all']);

    process.env.BROWSERSLIST_ENV = 'test';
    expect(getBrowserslistQuery({ cwd })).toEqual('current node');
  });
});
