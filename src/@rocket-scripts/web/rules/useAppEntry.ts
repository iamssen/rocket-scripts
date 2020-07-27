import { watch } from 'chokidar';
import { FSWatcher } from 'fs';
import { useEffect, useState } from 'react';
import { AppEntry, getAppEntry } from './getAppEntry';

interface Params {
  appDir: string;
}

export function useAppEntry({ appDir }: Params): AppEntry[] {
  const [entry, setEntry] = useState<AppEntry[]>(getAppEntry({ appDir }));

  useEffect(() => {
    function update() {
      const nextEntry: AppEntry[] = getAppEntry({ appDir });

      setEntry((prevEntry) => {
        return prevEntry.length !== nextEntry.length ||
          prevEntry.map(({ name }) => name).join('') !== nextEntry.map(({ name }) => name).join('')
          ? nextEntry
          : prevEntry;
      });
    }

    const watcher: FSWatcher = watch([`${appDir}/*.{js,jsx,ts,tsx}`, `${appDir}/*.html`])
      .on('add', update)
      .on('unlink', update);

    return () => {
      watcher.close();
    };
  }, [appDir]);

  return entry;
}
