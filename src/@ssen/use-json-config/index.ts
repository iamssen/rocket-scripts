import { watch } from 'chokidar';
import fs, { FSWatcher } from 'fs-extra';
import { useEffect, useState } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */

export function useJsonConfig<T>(file: string, selector: (object: any) => T | undefined): T | undefined {
  const [config, setConfig] = useState<T | undefined>(undefined);

  useEffect(() => {
    const watcher: FSWatcher = watch(file);

    async function handler(file: string) {
      if (fs.existsSync(file)) {
        const object: object = await fs.readJson(file);
        const next: T | undefined = selector(object);
        setConfig((prev) => {
          return !next ? undefined : JSON.stringify(prev) !== JSON.stringify(next) ? next : prev;
        });
      } else {
        if (process.env.JEST_WORKER_ID) {
          setTimeout(() => setConfig(undefined), 1);
        } else {
          setConfig(undefined);
        }
      }
    }

    watcher.on('add', handler).on('change', handler).on('unlink', handler);

    return () => {
      watcher.close();
    };
  }, [file, selector]);

  return config;
}
