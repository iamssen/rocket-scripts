import { copyTmpDirectory } from '@ssen/tmp-directory';
import { useJsonConfig } from '@ssen/use-json-config';
import { renderHook } from '@testing-library/react-hooks';
import fs from 'fs-extra';
import path from 'path';

describe('useJsonConfig()', () => {
  //if (!process.env.GITHUB_ACTIONS) {
  test('should read json config', async () => {
    // Arrange
    const cwd: string = await copyTmpDirectory(process.cwd(), 'test/fixtures/use-json-config/basic');
    const file: string = path.join(cwd, 'test.json');

    // Act
    const { result, unmount, waitForValueToChange } = renderHook(() =>
      useJsonConfig<{ a: number }>({ file: file, selector: ({ config }) => config }),
    );

    // Assert
    expect(result.current?.a).toBe(1);

    // Act
    fs.writeJsonSync(file, { config: { a: 2 } });
    await waitForValueToChange(() => result.current?.a === 2, { interval: 1000 });

    // Assert
    expect(result.current?.a).toBe(2);

    unmount();
  });
  //} else {
  //  test.todo('[skipped test in github actions] should read json config');
  //}

  //test('should get undefined if the file is not exist', async () => {
  //  const cwd: string = await createTmpDirectory();
  //  const file: string = path.join(cwd, 'test.json');
  //
  //  const { result, unmount, waitForValueToChange } = renderHook(() =>
  //    useJsonConfig<{ a: number }>(file, ({ config }) => config),
  //  );
  //
  //  expect(result.current).toBeUndefined();
  //
  //  await fs.writeJson(file, { config: { a: 2 } });
  //  await waitForValueToChange(() => result.current?.a === 2);
  //  expect(result.current?.a).toBe(2);
  //
  //  await fs.unlink(file);
  //  await waitForValueToChange(() => !result.current);
  //  expect(result.current).toBeUndefined();
  //
  //  unmount();
  //});
});
