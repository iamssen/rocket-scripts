import { getWebpackAlias } from '@rocket-scripts/web/rules/getWebpackAlias';
import { watch } from 'chokidar';
import fs, { FSWatcher } from 'fs-extra';
import { useEffect, useState } from 'react';

export function useWebpackAlias(cwd: string): Record<string, string> {
  const [alias, setAlias] = useState<Record<string, string>>(() => getWebpackAlias(cwd));

  useEffect(() => {
    const watcher: FSWatcher = watch([`${cwd}/src/*`, `${cwd}/src/@*/*`], {
      ignored: (fileOrDir: string) => !fs.statSync(fileOrDir).isDirectory(),
    });

    function handler() {
      const next = getWebpackAlias(cwd);

      setAlias((prev) => {
        return JSON.stringify(prev) !== JSON.stringify(next) ? next : prev;
      });
    }

    watcher.on('add', handler).on('change', handler).on('unlink', handler);

    return () => {
      watcher.close();
    };
  }, [cwd]);

  return alias;
}
