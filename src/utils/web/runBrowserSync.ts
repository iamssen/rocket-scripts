import browserSync, { Options } from 'browser-sync';
import { Observable, Observer, Subscribable } from 'rxjs';

export = function (browserSyncConfig: Options): Subscribable<void> {
  return Observable.create((observer: Observer<void>) => {
    browserSync(browserSyncConfig, (error: Error) => {
      if (error) {
        observer.error(error);
      } else {
        observer.next();
      }
    });
  });
}