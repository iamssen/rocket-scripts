import { defaultQuery, getBrowserslistQuery } from '@rocket-scripts/browserslist';
import path from 'path';
import { browserslist } from '../../../../test/fixtures/browserslist/custom/package.json';

describe('browserslist', () => {
  test('should get a correct query by BROWSERSLIST_ENV', () => {
    const cwd: string = path.join(process.cwd(), 'test/fixtures/packages/basic');

    expect(getBrowserslistQuery({ cwd })).toBe(defaultQuery.defaults);

    process.env.BROWSERSLIST_ENV = 'production';
    expect(getBrowserslistQuery({ cwd })).toBe(defaultQuery.production);
    process.env.BROWSERSLIST_ENV = 'development';
    expect(getBrowserslistQuery({ cwd })).toBe(defaultQuery.development);
    process.env.BROWSERSLIST_ENV = 'server';
    expect(getBrowserslistQuery({ cwd })).toBe(defaultQuery.server);
    process.env.BROWSERSLIST_ENV = 'server_development';
    expect(getBrowserslistQuery({ cwd })).toBe(defaultQuery.server_development);
    process.env.BROWSERSLIST_ENV = 'electron';
    expect(getBrowserslistQuery({ cwd })).toBe(defaultQuery.electron);
    process.env.BROWSERSLIST_ENV = 'package';
    expect(getBrowserslistQuery({ cwd })).toBe(defaultQuery.package);

    expect(getBrowserslistQuery({ cwd, env: 'production' })).toBe(defaultQuery.production);
    expect(getBrowserslistQuery({ cwd, env: 'development' })).toBe(defaultQuery.development);
    expect(getBrowserslistQuery({ cwd, env: 'server' })).toBe(defaultQuery.server);
    expect(getBrowserslistQuery({ cwd, env: 'server_development' })).toBe(defaultQuery.server_development);
    expect(getBrowserslistQuery({ cwd, env: 'electron' })).toBe(defaultQuery.electron);
    expect(getBrowserslistQuery({ cwd, env: 'package' })).toBe(defaultQuery.package);
  });

  test('should get a correct query by package.json', () => {
    const cwd: string = path.join(process.cwd(), 'test/fixtures/browserslist/custom');

    delete process.env.BROWSERSLIST_ENV;
    expect(getBrowserslistQuery({ cwd })).toBe(browserslist.defaults);

    process.env.BROWSERSLIST_ENV = 'production';
    expect(getBrowserslistQuery({ cwd })).toBe(browserslist.production);
    process.env.BROWSERSLIST_ENV = 'development';
    expect(getBrowserslistQuery({ cwd })).toBe(browserslist.development);
    process.env.BROWSERSLIST_ENV = 'server';
    expect(getBrowserslistQuery({ cwd })).toBe(browserslist.server);
    process.env.BROWSERSLIST_ENV = 'server_development';
    expect(getBrowserslistQuery({ cwd })).toBe(browserslist.server_development);
    process.env.BROWSERSLIST_ENV = 'electron';
    expect(getBrowserslistQuery({ cwd })).toBe(browserslist.electron);
    process.env.BROWSERSLIST_ENV = 'package';
    expect(getBrowserslistQuery({ cwd })).toBe(browserslist.package);

    expect(getBrowserslistQuery({ cwd, env: 'production' })).toBe(browserslist.production);
    expect(getBrowserslistQuery({ cwd, env: 'development' })).toBe(browserslist.development);
    expect(getBrowserslistQuery({ cwd, env: 'server' })).toBe(browserslist.server);
    expect(getBrowserslistQuery({ cwd, env: 'server_development' })).toBe(browserslist.server_development);
    expect(getBrowserslistQuery({ cwd, env: 'electron' })).toBe(browserslist.electron);
    expect(getBrowserslistQuery({ cwd, env: 'package' })).toBe(browserslist.package);
  });

  test('should get default query by wrong env', () => {
    const cwd: string = path.join(process.cwd(), 'test/fixtures/browserslist/custom');

    // @ts-expect-error
    expect(getBrowserslistQuery({ cwd, env: '???' })).toBe(browserslist.defaults);
  });
});
