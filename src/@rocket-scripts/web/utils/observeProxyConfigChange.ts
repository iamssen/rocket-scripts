import { watch } from 'chokidar';
import { FSWatcher } from 'fs';
import path from 'path';
import { Observable } from 'rxjs';
import { ProxyConfigArray, ProxyConfigMap } from 'webpack-dev-server';
import { getProxyConfig } from './getProxyConfig';

interface Params {
  cwd: string;
  current: ProxyConfigMap | ProxyConfigArray | undefined;
}

export function observeProxyConfigChange({ cwd, current }: Params): Observable<string | null> {
  return new Observable<string | null>((subscriber) => {
    const file: string = path.join(cwd, 'package.json');

    function update() {
      const next: ProxyConfigMap | ProxyConfigArray | undefined = getProxyConfig(cwd);
      const currentString: string = JSON.stringify(current);
      const nextString: string = JSON.stringify(next);

      if (currentString !== nextString) {
        const message: string[] = [
          `proxy config changed:`,
          `  current: ${currentString}`,
          `  changed: ${nextString}`,
        ];
        subscriber.next(message.join('`\n'));
      } else {
        subscriber.next(null);
      }
    }

    const watcher: FSWatcher = watch(file).on('add', update).on('change', update).on('unlink', update);

    return () => {
      watcher.close();
    };
  });
}
