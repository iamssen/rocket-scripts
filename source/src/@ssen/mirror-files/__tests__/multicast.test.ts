import { ConnectableObservable, Observable, Subject } from 'rxjs';
import { bufferTime, multicast } from 'rxjs/operators';

describe('rxjs', () => {
  test('multicast', async () => {
    await new Promise((resolve) => {
      const observable = new Observable<number>((subscriber) => {
        let i: number = 0;

        const interval = setInterval(() => {
          if (Math.random() > 0.5) {
            subscriber.next(i);
            i += 1;
          }
        }, 100);

        return () => {
          console.log('multicast.test.ts..() clear!!!');
          clearInterval(interval);
        };
      });

      const multi = observable.pipe(multicast(() => new Subject<number>())) as ConnectableObservable<number>;

      const toUI: Observable<number[]> = multi.pipe(bufferTime(500));

      const uiSubscription = toUI.subscribe((i) => console.log('a:', i));
      const subscription2 = multi.subscribe((i) => console.log('b:', i));

      const multiSubscription = multi.connect();

      setTimeout(() => {
        multiSubscription.unsubscribe();
        uiSubscription.unsubscribe();
        subscription2.unsubscribe();
        resolve();
      }, 5000);
    });
  });
});
