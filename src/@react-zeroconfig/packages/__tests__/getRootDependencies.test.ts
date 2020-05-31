import { getRootDependencies } from '@react-zeroconfig/packages';
import path from 'path';
import { PackageJson } from 'type-fest';

describe('getRootDependencies()', () => {
  test('should get root dependencies', async () => {
    const deps: PackageJson.Dependency = await getRootDependencies({
      cwd: path.join(process.cwd(), `test/fixtures/packages/basic`),
    });

    expect(deps['react']).not.toBeUndefined();
    expect(deps['react-app-polyfill']).not.toBeUndefined();
    expect(deps['react-dom']).not.toBeUndefined();
    expect(deps['@types/react']).not.toBeUndefined();
    expect(deps['@types/react-dom']).not.toBeUndefined();
    expect(deps['@types/webpack-env']).not.toBeUndefined();
  });

  test('should throw error if there is no package.json', async () => {
    async function check() {
      await getRootDependencies({
        cwd: path.join(process.cwd(), `test/fixtures/mirror-files/static-files`),
      });
    }

    await expect(check()).rejects.toThrow();
  });
});
