import { getWebpackAlias } from '@rocket-scripts/utils';
import { Observable } from 'rxjs';
import { clearInterval, setInterval } from 'timers';

interface Params {
  cwd: string;
  current: Record<string, string>;
  interval?: number;
}

export function observeAliasChange({ cwd, current, interval = 10000 }: Params): Observable<string | null> {
  return new Observable<string | null>((subscriber) => {
    let intervalId: NodeJS.Timeout | null = null;

    const currentString: string = Object.keys(current).sort().join(', ');

    function update() {
      const next: Record<string, string> = getWebpackAlias(cwd);
      const nextString: string = Object.keys(next).sort().join(', ');

      if (currentString !== nextString) {
        subscriber.next(`alias changed : ${currentString} > ${nextString}`);
      } else {
        subscriber.next(null);
      }
    }

    intervalId = setInterval(update, interval);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
  });
}
