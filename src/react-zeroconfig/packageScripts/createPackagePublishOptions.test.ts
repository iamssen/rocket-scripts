import { prerelease } from 'semver';

describe('createPackagePublishOptions()', () => {
  test('test semver prerelease()', () => {
    expect(prerelease('1.0.0')).toBeNull();
    expect(prerelease('1.0.0-alpha.1')).toEqual(['alpha', 1]);
    expect(prerelease('1.0.0-beta.1')).toEqual(['beta', 1]);
    expect(prerelease('1.0.0-rc.3')).toEqual(['rc', 3]);
    expect(prerelease('1.0.0-next.2')).toEqual(['next', 2]);
  });
});
