import { watch } from 'chokidar';
import { FSWatcher } from 'fs';
import { useEffect, useState } from 'react';
import { AppEntry, getAppEntry } from './getAppEntry';

export function useAppEntry({ appDir }: { appDir: string }): AppEntry[] | null {
  const [entry, setEntry] = useState<AppEntry[] | null>(null);

  useEffect(() => {
    async function update() {
      const nextEntry: AppEntry[] = await getAppEntry({ appDir });

      setEntry((prevEntry) => {
        return !prevEntry ||
          prevEntry.length !== nextEntry.length ||
          prevEntry.map(({ name }) => name).join('') !== nextEntry.map(({ name }) => name).join('')
          ? nextEntry
          : prevEntry;
      });
    }

    update();

    const watcher: FSWatcher = watch([`${appDir}/*.{js,jsx,ts,tsx}`, `${appDir}/*.html`], {
      persistent: true,
      ignoreInitial: true,
    });

    watcher.on('add', update).on('unlink', update);

    return () => {
      watcher.close();
    };
  }, [appDir]);

  return entry;
}
