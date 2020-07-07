import { copyTmpDirectory } from '@ssen/tmp-directory';
import { useJsonConfig } from '@ssen/use-json-config';
import { renderHook } from '@testing-library/react-hooks';
import fs from 'fs-extra';
import path from 'path';

describe('useJsonConfig()', () => {
  test('should read json config', async () => {
    const cwd: string = await copyTmpDirectory(process.cwd(), 'test/fixtures/use-json-config/basic');
    const file: string = path.join(cwd, 'test.json');

    const { result, unmount, waitForValueToChange } = renderHook(() =>
      useJsonConfig<{ a: number }>(file, ({ config }) => config),
    );

    await waitForValueToChange(() => result.current?.a === 1);
    expect(result.current?.a).toBe(1);

    await fs.writeJson(file, { config: { a: 2 } });
    await waitForValueToChange(() => result.current?.a === 2);
    expect(result.current?.a).toBe(2);

    unmount();
  }, 10000);

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
