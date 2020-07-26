import { watch } from 'chokidar';
import fs, { FSWatcher } from 'fs-extra';
import debounce from 'lodash.debounce';
import { useEffect, useState } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Params<T> {
  file: string;
  selector: (object: any) => T | undefined;
}

export function useJsonConfig<T>({ file, selector }: Params<T>): T | undefined {
  const [config, setConfig] = useState<T | undefined>(() => {
    const object: object = fs.readJsonSync(file);
    return selector(object);
  });

  useEffect(() => {
    const watcher: FSWatcher = watch(file);

    function updateHandler() {
      if (fs.existsSync(file)) {
        // WARNING do not write tests with asynchronous fs write
        const object: object = fs.readJsonSync(file);
        const next: T | undefined = selector(object);
        setConfig((prev) => {
          return !next ? undefined : JSON.stringify(prev) !== JSON.stringify(next) ? next : prev;
        });
      } else {
        setConfig(undefined);
      }
    }

    const update = debounce(updateHandler);

    watcher.on('add', update).on('change', update).on('unlink', update);

    return () => {
      update.cancel();
      watcher.close();
    };
  }, [file, selector]);

  return config;
}
