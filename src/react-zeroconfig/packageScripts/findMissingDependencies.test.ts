import { intersects, Range } from 'semver';
import { PackageJson } from 'type-fest';
import { createTmpFixture } from '../utils/createTmpFixture';
import { findMissingDependencies } from './findMissingDependencies';

describe('findMissingDependencies()', () => {
  test('semver.intersects() test', () => {
    expect(intersects('^4.4.2', '^4.2.1')).toBeTruthy();
    expect(intersects('^4.4.2', '^4.2.1-alpha.2')).toBeTruthy();
    expect(intersects('^4.4.2', '^4.2.1-alpha.2', { loose: false })).toBeTruthy();

    const x: Range = new Range('^4.4.2');
    const y: Range = new Range('^4.2.1');
    console.log('syncPackages.test.ts..()', x.intersects(y), y.intersects(x));
    console.log('syncPackages.test.ts..()', intersects('^4.4.2', '^5.3.0'));
  });

  test('', async () => {
    const cwd: string = await createTmpFixture('packages-sync');
    const missingDependencies: PackageJson.Dependency = await findMissingDependencies({ cwd });

    expect(Object.keys(missingDependencies).sort()).toEqual(['d3-array', 'react-redux']);
  });
});
