import { watch } from 'chokidar';
import { FSWatcher } from 'fs';
import debounce from 'lodash.debounce';
import { useEffect, useState } from 'react';
import { AppEntry, getAppEntry } from './getAppEntry';

export function useAppEntry({ appDir }: { appDir: string }): AppEntry[] | null {
  const [entry, setEntry] = useState<AppEntry[] | null>(null);

  useEffect(() => {
    const update: () => void = debounce(async function () {
      const nextEntry: AppEntry[] = await getAppEntry({ appDir });

      setEntry((prevEntry) => {
        return !prevEntry ||
          prevEntry.length !== nextEntry.length ||
          prevEntry.map(({ name }) => name).join('') !== nextEntry.map(({ name }) => name).join('')
          ? nextEntry
          : prevEntry;
      });
    });

    const watcher: FSWatcher = watch([`${appDir}/*.{js,jsx,ts,tsx}`, `${appDir}/*.html`])
      .on('add', update)
      .on('unlink', update);

    return () => {
      watcher.close();
    };
  }, [appDir]);

  return entry;
}
