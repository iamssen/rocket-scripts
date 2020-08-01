import { getProxyConfig } from '@rocket-scripts/web/utils/getProxyConfig';
import { observeProxyConfigChange } from '@rocket-scripts/web/utils/observeProxyConfigChange';
import { copyTmpDirectory } from '@ssen/tmp-directory';
import { waitFor } from '@testing-library/dom';
import fs from 'fs-extra';
import path from 'path';
import { PackageJson } from 'type-fest';
import { ProxyConfigArray, ProxyConfigMap } from 'webpack-dev-server';

describe('observeProxyConfigChange', () => {
  test('should catch proxy config change', async () => {
    // Arrange
    const cwd: string = await copyTmpDirectory(process.cwd(), 'test/fixtures/web/proxy');
    const file: string = path.join(cwd, 'package.json');
    const { proxy, ...packageJson }: PackageJson = fs.readJsonSync(file);

    // Act
    const current: ProxyConfigMap | ProxyConfigArray | undefined = getProxyConfig(cwd);

    // Assert
    expect(current).not.toBeNull();

    // Arrange
    let change: string | null = null;

    const subscription = observeProxyConfigChange({ current, cwd }).subscribe(
      (changeValue: string | null) => {
        change = changeValue;
      },
    );

    // Act
    fs.writeJsonSync(file, packageJson, { encoding: 'utf8' });

    // Assert
    await waitFor(() => expect(change).toContain('proxy config changed'), { timeout: 2000 });

    // Act
    fs.writeJsonSync(file, { proxy, ...packageJson }, { encoding: 'utf8' });

    // Assert
    await waitFor(() => expect(change).toBeNull(), { timeout: 2000 });

    // Exit
    subscription.unsubscribe();
  });
});
