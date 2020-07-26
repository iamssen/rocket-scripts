import { watch } from 'chokidar';
import { FSWatcher } from 'fs';
import debounce from 'lodash.debounce';
import { useEffect, useState } from 'react';
import { AppEntry, getAppEntry } from './getAppEntry';

interface Params {
  appDir: string;
}

export function useAppEntry({ appDir }: Params): AppEntry[] {
  const [entry, setEntry] = useState<AppEntry[]>(getAppEntry({ appDir }));

  useEffect(() => {
    function updateHandler() {
      const nextEntry: AppEntry[] = getAppEntry({ appDir });

      setEntry((prevEntry) => {
        return prevEntry.length !== nextEntry.length ||
          prevEntry.map(({ name }) => name).join('') !== nextEntry.map(({ name }) => name).join('')
          ? nextEntry
          : prevEntry;
      });
    }

    const update = debounce(updateHandler);

    const watcher: FSWatcher = watch([`${appDir}/*.{js,jsx,ts,tsx}`, `${appDir}/*.html`])
      .on('add', update)
      .on('unlink', update);

    return () => {
      update.cancel();
      watcher.close();
    };
  }, [appDir]);

  return entry;
}
