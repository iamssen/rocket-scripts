import { AppEntry, getAppEntry } from '@rocket-scripts/web/utils/getAppEntry';
import { observeAppEntryChange } from '@rocket-scripts/web/utils/observeAppEntryChange';
import { copyFixture } from '@ssen/copy-fixture';
import { waitFor } from '@testing-library/react';
import fs from 'fs-extra';
import path from 'path';

describe('observeAppEntrChange()', () => {
  test('should catch app entry changed', async () => {
    // Arrange
    const cwd: string = await copyFixture(
      'test/fixtures/web/observeAppEntryChange',
    );

    // Act
    const current: AppEntry[] = getAppEntry({ appDir: cwd });

    // Assert
    expect(current.length).toBe(2);
    expect(fs.existsSync(path.join(cwd, 'test1.html'))).toBeTruthy();
    expect(fs.existsSync(path.join(cwd, 'test1.tsx'))).toBeTruthy();
    expect(fs.existsSync(path.join(cwd, 'test2.html'))).toBeTruthy();
    expect(fs.existsSync(path.join(cwd, 'test2.tsx'))).toBeTruthy();

    // Arrange
    let change: string | null = null;

    const subscription = observeAppEntryChange({
      current,
      appDir: cwd,
    }).subscribe((changeValue: string | null) => {
      change = changeValue;
    });

    // Act
    fs.copyFileSync(path.join(cwd, 'test1.html'), path.join(cwd, 'test3.html'));
    fs.copyFileSync(path.join(cwd, 'test1.tsx'), path.join(cwd, 'test3.tsx'));

    // Assert
    await waitFor(() => expect(change).toContain('entry changed'), {
      timeout: 5000,
    });

    // Act
    fs.unlinkSync(path.join(cwd, 'test3.html'));

    // Assert
    await waitFor(() => expect(change).toBeNull(), { timeout: 5000 });

    // Exit
    subscription.unsubscribe();
  });
});
