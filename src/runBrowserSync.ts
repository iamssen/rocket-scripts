import browserSync, { Options } from 'browser-sync';
import { Observable, Subscribable } from 'rxjs';

export = function (browserSyncConfig: Options): Subscribable<void> {
  return Observable.create(observer => {
    browserSync(browserSyncConfig, error => {
      if (error) {
        observer.error(error);
      } else {
        observer.next();
      }
    });
  });
}