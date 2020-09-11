import { getWebpackAlias } from '@rocket-scripts/utils/getWebpackAlias';
import { copyTmpDirectory } from '@ssen/tmp-directory';
import path from 'path';

describe('getWebpackAlias()', () => {
  test('should get alias from dir', async () => {
    // Arrange
    const cwd: string = await copyTmpDirectory(
      path.join(process.cwd(), `test/fixtures/web/alias`),
    );

    // Act
    const alias: Record<string, string> = getWebpackAlias(cwd);

    // Assert
    expect(alias['app']).toBe(path.join(cwd, 'src/app'));
    expect(alias['a']).toBe(path.join(cwd, 'src/a'));
    expect(alias['b']).toBe(path.join(cwd, 'src/b'));
    expect(alias['c']).toBe(path.join(cwd, 'src/c'));
  });

  test('should get group alias from dir', async () => {
    // Arrange
    const cwd: string = await copyTmpDirectory(
      path.join(process.cwd(), `test/fixtures/web/alias-group`),
    );

    // Act
    const alias: Record<string, string> = getWebpackAlias(cwd);

    // Assert
    expect(alias['app']).toBe(path.join(cwd, 'src/app'));
    expect(alias['@group/a']).toBe(path.join(cwd, 'src/@group/a'));
    expect(alias['@group/b']).toBe(path.join(cwd, 'src/@group/b'));
    expect(alias['@group/c']).toBe(path.join(cwd, 'src/@group/c'));
  });
});
