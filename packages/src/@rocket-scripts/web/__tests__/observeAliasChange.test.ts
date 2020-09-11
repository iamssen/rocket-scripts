import { getWebpackAlias } from '@rocket-scripts/utils';
import { observeAliasChange } from '@rocket-scripts/web/utils/observeAliasChange';
import { copyTmpDirectory } from '@ssen/tmp-directory';
import { waitFor } from '@testing-library/dom';
import fs from 'fs-extra';
import path from 'path';

describe('observeAliasChange', () => {
  test('should catch alias changed', async () => {
    // Arrange
    const cwd: string = await copyTmpDirectory(
      process.cwd(),
      'test/fixtures/web/start',
    );

    // Act
    const current: Record<string, string> = getWebpackAlias(cwd);

    // Assert
    expect(Object.keys(current)).toEqual(['app']);

    // Arrange
    let change: string | null = null;

    const subscription = observeAliasChange({
      cwd,
      current,
      interval: 1000,
    }).subscribe((changeValue: string | null) => {
      change = changeValue;
    });

    const hello: string = path.join(cwd, 'src/hello');

    // Act
    fs.mkdirpSync(hello);

    // Assert
    await waitFor(() => expect(change).toContain('alias changed'), {
      timeout: 5000,
    });

    // Act
    fs.rmdirSync(hello);

    // Assert
    await waitFor(() => expect(change).toBeNull(), { timeout: 5000 });

    // Exit
    subscription.unsubscribe();
  });
});
