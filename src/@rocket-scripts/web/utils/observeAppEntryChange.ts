import { watch } from 'chokidar';
import { FSWatcher } from 'fs';
import { Observable } from 'rxjs';
import { AppEntry, getAppEntry } from './getAppEntry';

interface Params {
  current: AppEntry[];
  appDir: string;
}

export function observeAppEntryChange({ appDir, current }: Params): Observable<string | null> {
  return new Observable<string | null>((subscriber) => {
    function update() {
      const next: AppEntry[] = getAppEntry({ appDir });

      if (
        current.length !== next.length ||
        current.map(({ name }) => name).join('') !== next.map(({ name }) => name).join('')
      ) {
        const message: string[] = [
          `entry changed:`,
          `  current: ${current.map(({ name }) => name).join(', ')}`,
          `  changed: ${next.map(({ name }) => name).join(', ')}`,
        ];
        subscriber.next(message.join('\n'));
      } else {
        subscriber.next(null);
      }
    }

    const watcher: FSWatcher = watch([`${appDir}/*.{js,jsx,ts,tsx}`, `${appDir}/*.html`])
      .on('add', update)
      .on('unlink', update);

    return () => {
      watcher.close();
    };
  });
}
