import { copyTmpDirectory } from '@ssen/tmp-directory';
import { renderHook } from '@testing-library/react-hooks';
import fs from 'fs-extra';
import path from 'path';
import { useAppEntry } from '../rules/useAppEntry';

describe('useAppEntry()', () => {
  test.skip('should update the entry list with the files add and delete', async () => {
    const cwd: string = await copyTmpDirectory(process.cwd(), 'test/fixtures/web/useAppEntry');

    const { result, waitForValueToChange, unmount } = renderHook(() => useAppEntry({ appDir: cwd }));

    expect(result.current.length).toBe(2);
    expect(fs.existsSync(path.join(cwd, 'test1.html'))).toBeTruthy();
    expect(fs.existsSync(path.join(cwd, 'test1.tsx'))).toBeTruthy();
    expect(fs.existsSync(path.join(cwd, 'test2.html'))).toBeTruthy();
    expect(fs.existsSync(path.join(cwd, 'test2.tsx'))).toBeTruthy();

    fs.copyFileSync(path.join(cwd, 'test1.html'), path.join(cwd, 'test3.html'));
    fs.copyFileSync(path.join(cwd, 'test1.tsx'), path.join(cwd, 'test3.tsx'));

    await waitForValueToChange(() => result.current.length === 3, { interval: 1000 });

    expect(result.current.length).toBe(3);

    fs.unlinkSync(path.join(cwd, 'test2.html'));

    await waitForValueToChange(() => result.current.length === 2, { interval: 1000 });

    expect(result.current.length).toBe(2);

    unmount();
  });
});
